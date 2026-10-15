/**
 * Image generation for src/content/asset-manifest.json.
 *
 *   pnpm assets:plan [--batch 1 | --ids a,b]       Dry run (default): lists assets and estimated cost. No API calls.
 *   pnpm assets:verify                              Free metadata call confirming the configured model.
 *   pnpm assets:generate --ids a,b --confirm        Paid: generates exactly the listed assets.
 *   pnpm assets:generate --batch 2 --confirm        Paid: generates every pending asset in a batch.
 *
 * Safeguards: paid runs need --confirm and an explicit selection; generated
 * assets are skipped unless --force; at most MAX_PER_RUN images per run; a
 * lock file prevents concurrent runs; requests run one at a time and are
 * never retried automatically. A failure is recorded and the run continues.
 */
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import { redact, verifyModel } from "../src/lib/ai/gemini-client.ts";
import { GenerationError, type ImageAspectRatio, type ImageSize, type TokenUsage } from "../src/lib/ai/generation-types.ts";
import { generateImage, imageModel } from "../src/lib/ai/image-provider.ts";

const ROOT = join(import.meta.dirname, "..");
const MANIFEST_PATH = join(ROOT, "src/content/asset-manifest.json");
const ORIGINALS_DIR = join(ROOT, ".generated-originals");
const LOCK_PATH = join(ROOT, ".asset-generation.lock");
const MAX_PER_RUN = 20;
/** USD per 1M tokens, from the manifest's (unverified) pricing notes. Thinking tokens are priced at the image rate as an upper bound. */
const PRICE_PER_M = { input: 1.5, output: 30 };

interface Asset {
  id: string;
  file: string;
  section: string;
  aspectRatio: ImageAspectRatio;
  imageSize: ImageSize;
  batch: number;
  prompt: string;
  status: "planned" | "generated" | "failed";
  estimatedCostUsd: number;
  width?: number;
  height?: number;
  blurDataURL?: string;
  generation?: Record<string, unknown>;
  error?: string;
}

interface Manifest {
  styleGuide: string;
  assets: Asset[];
  [key: string]: unknown;
}

function readManifest(): Manifest {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
}

/** Atomic write so an interrupted run never leaves a half-written manifest. */
function writeManifest(manifest: Manifest): void {
  const temp = `${MANIFEST_PATH}.tmp`;
  writeFileSync(temp, `${JSON.stringify(manifest, null, 2)}\n`);
  renameSync(temp, MANIFEST_PATH);
}

function composePrompt(asset: Asset, styleGuide: string): string {
  return `${asset.prompt}\n\n${styleGuide}`;
}

function estimateCost(usage: TokenUsage): number {
  const output = (usage.outputTokens ?? 0) + (usage.thoughtsTokens ?? 0);
  const cost = ((usage.promptTokens ?? 0) * PRICE_PER_M.input + output * PRICE_PER_M.output) / 1_000_000;
  return Math.round(cost * 10_000) / 10_000;
}

function select(manifest: Manifest, ids: string | undefined, batch: string | undefined): Asset[] {
  if (ids) {
    const wanted = ids.split(",").map((id) => id.trim()).filter(Boolean);
    const unknown = wanted.filter((id) => !manifest.assets.some((asset) => asset.id === id));
    if (unknown.length) throw new Error(`Unknown asset id(s): ${unknown.join(", ")}`);
    return manifest.assets.filter((asset) => wanted.includes(asset.id));
  }
  if (batch) return manifest.assets.filter((asset) => asset.batch === Number(batch));
  return manifest.assets;
}

function printPlan(assets: Asset[], manifest: Manifest): void {
  const pending = assets.filter((asset) => asset.status !== "generated");
  console.log(`\nModel: ${process.env.IMAGE_GEN_MODEL_NAME ?? "(IMAGE_GEN_MODEL_NAME not set)"}\n`);
  console.log("id".padEnd(30), "batch", "ratio".padEnd(6), "size", "status".padEnd(10), "est. USD");
  for (const asset of assets) {
    console.log(
      asset.id.padEnd(30),
      String(asset.batch).padEnd(5),
      asset.aspectRatio.padEnd(6),
      asset.imageSize.padEnd(4),
      asset.status.padEnd(10),
      asset.estimatedCostUsd.toFixed(4),
    );
  }
  const total = pending.reduce((sum, asset) => sum + asset.estimatedCostUsd, 0);
  console.log(`\n${pending.length} to generate · estimated $${total.toFixed(2)} (estimate; see manifest pricing notes)`);
  if (process.argv.includes("--prompts")) {
    for (const asset of pending) console.log(`\n— ${asset.id}\n${composePrompt(asset, manifest.styleGuide)}`);
  }
}

async function processImage(asset: Asset, data: Buffer, mimeType: string) {
  mkdirSync(ORIGINALS_DIR, { recursive: true });
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "bin";
  writeFileSync(join(ORIGINALS_DIR, `${asset.id}.${extension}`), data);

  const target = join(ROOT, "public", asset.file);
  mkdirSync(dirname(target), { recursive: true });
  const { width, height } = await sharp(data).metadata();
  await sharp(data).jpeg({ quality: 86, mozjpeg: true }).toFile(target);
  const blur = await sharp(data).resize(16).webp({ quality: 45 }).toBuffer();
  return { width, height, blurDataURL: `data:image/webp;base64,${blur.toString("base64")}` };
}

async function generate(assets: Asset[], manifest: Manifest, force: boolean): Promise<void> {
  const queue = assets.filter((asset) => force || asset.status !== "generated");
  if (queue.length === 0) {
    console.log("Nothing to generate: every selected asset already exists (use --force to replace).");
    return;
  }
  if (queue.length > MAX_PER_RUN) throw new Error(`Refusing to generate ${queue.length} images in one run (limit ${MAX_PER_RUN}).`);

  const model = imageModel();
  let spent = 0;
  for (const asset of queue) {
    const prompt = composePrompt(asset, manifest.styleGuide);
    process.stdout.write(`→ ${asset.id} (${asset.aspectRatio}, ${asset.imageSize}) … `);
    const started = Date.now();
    try {
      const result = await generateImage({ prompt, aspectRatio: asset.aspectRatio, imageSize: asset.imageSize }, model);
      const processed = await processImage(asset, result.data, result.mimeType);
      const cost = estimateCost(result.usage);
      spent += cost;
      Object.assign(asset, processed, {
        status: "generated",
        error: undefined,
        generation: {
          model: result.model,
          generatedAt: new Date().toISOString(),
          promptSent: prompt,
          sourceMimeType: result.mimeType,
          usage: result.usage,
          estimatedCostUsd: cost,
        },
      });
      console.log(`done in ${Math.round((Date.now() - started) / 1000)}s · ${processed.width}×${processed.height} · ~$${cost.toFixed(4)}`);
    } catch (error) {
      const message = error instanceof GenerationError ? `${error.code}: ${error.message}` : redact(String(error));
      Object.assign(asset, { status: "failed", error: message });
      console.log(`failed — ${message}`);
      if (error instanceof GenerationError && (error.code === "missing-credentials" || error.code === "invalid-model")) {
        writeManifest(manifest);
        throw error; // Configuration problems will fail every request; stop instead of repeating them.
      }
    }
    writeManifest(manifest);
  }
  console.log(`\nEstimated spend this run: ~$${spent.toFixed(4)} (from reported token usage).`);
}

async function main(): Promise<void> {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: {
      ids: { type: "string" },
      batch: { type: "string" },
      confirm: { type: "boolean", default: false },
      force: { type: "boolean", default: false },
      prompts: { type: "boolean", default: false },
    },
  });
  const command = positionals[0] ?? "plan";
  const manifest = readManifest();
  const assets = select(manifest, values.ids, values.batch);

  if (command === "plan") return printPlan(assets, manifest);

  if (command === "verify") {
    const model = imageModel();
    const info = await verifyModel(model);
    console.log(`OK: ${model} → "${info.displayName ?? info.name}" supports generateContent.`);
    return;
  }

  if (command === "generate") {
    if (!values.ids && !values.batch) throw new Error("Select assets explicitly with --ids or --batch.");
    if (!values.confirm) {
      printPlan(assets, manifest);
      console.log("\nDry run only. Re-run with --confirm to make these paid requests.");
      return;
    }
    let lock: number;
    try {
      lock = openSync(LOCK_PATH, "wx");
    } catch {
      throw new Error(`Another generation run appears to be active (${LOCK_PATH}). Remove the file if that run has ended.`);
    }
    try {
      await generate(assets, manifest, values.force);
    } finally {
      closeSync(lock);
      if (existsSync(LOCK_PATH)) unlinkSync(LOCK_PATH);
    }
    return;
  }

  throw new Error(`Unknown command "${command}". Use plan, verify or generate.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? redact(error.message) : redact(String(error)));
  process.exitCode = 1;
});
