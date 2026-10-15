/**
 * Optional hero video, generated with the configured Gemini Omni model.
 *
 *   pnpm video:plan                 Prints prompt, model, duration, resolution, cost and placement. No API calls.
 *   pnpm video:start --confirm      Paid: starts ONE background job and records its id in .video-job.json.
 *   pnpm video:poll                 Polls the recorded job and saves the result. Safe to repeat; never starts a job.
 *
 * A recorded, unfinished job blocks `start`, so an interrupted session can
 * resume by polling instead of paying for a duplicate generation.
 */
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs } from "node:util";
import { redact } from "../src/lib/ai/gemini-client.ts";
import { GenerationError } from "../src/lib/ai/generation-types.ts";
import { createVideoJob, downloadVideo, isTerminal, videoModel, waitForVideoJob } from "../src/lib/ai/video-provider.ts";

const ROOT = join(import.meta.dirname, "..");
const MANIFEST_PATH = join(ROOT, "src/content/asset-manifest.json");
const JOB_PATH = join(ROOT, ".video-job.json");

interface VideoPlan {
  id: string;
  status: string;
  model: string;
  file: string;
  placement: string;
  aspectRatio: "16:9" | "9:16";
  resolution: "720p" | "1080p";
  durationSeconds: number;
  estimatedCostUsd: number;
  pricingNote: string;
  optimisationPlan: string;
  prompt: string;
  generation?: Record<string, unknown>;
}

function readManifest(): { video: VideoPlan; [key: string]: unknown } {
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

function writeManifest(manifest: unknown): void {
  writeFileSync(`${MANIFEST_PATH}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`);
  renameSync(`${MANIFEST_PATH}.tmp`, MANIFEST_PATH);
}

function printPlan(plan: VideoPlan): void {
  console.log(`
Video: ${plan.id} (${plan.status})
Model:        ${process.env.VIDEO_GEN_MODEL_NAME ?? "(VIDEO_GEN_MODEL_NAME not set)"} (manifest: ${plan.model})
Duration:     ${plan.durationSeconds}s
Resolution:   ${plan.resolution}, ${plan.aspectRatio}
Estimate:     ~$${plan.estimatedCostUsd.toFixed(2)} — ${plan.pricingNote}
Placement:    ${plan.placement}
Optimisation: ${plan.optimisationPlan}
Output:       public${plan.file}

Prompt:
${plan.prompt}
`);
}

async function poll(): Promise<void> {
  if (!existsSync(JOB_PATH)) throw new Error("No recorded video job. Start one with `pnpm video:start --confirm`.");
  const record = JSON.parse(readFileSync(JOB_PATH, "utf8")) as { id: string; startedAt: string };
  console.log(`Polling ${record.id} (started ${record.startedAt}) …`);
  const job = await waitForVideoJob(record.id, { onUpdate: (update) => console.log(`  status: ${update.status}`) });
  if (job.status !== "completed") {
    unlinkSync(JOB_PATH);
    throw new Error(`Video job ended with status "${job.status}". Nothing was saved.`);
  }

  const bytes = await downloadVideo(job);
  const manifest = readManifest();
  const target = join(ROOT, "public", manifest.video.file.replace(/\.mp4$/, ".original.mp4"));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, bytes);
  manifest.video.status = "generated-unoptimised";
  manifest.video.generation = {
    model: videoModel(),
    interactionId: job.id,
    generatedAt: new Date().toISOString(),
    usage: job.usage,
    bytes: bytes.length,
  };
  writeManifest(manifest);
  unlinkSync(JOB_PATH);
  console.log(`Saved ${(bytes.length / 1_048_576).toFixed(1)} MB to ${target}. Optimise it before wiring it into the page.`);
}

async function main(): Promise<void> {
  const { positionals, values } = parseArgs({
    allowPositionals: true,
    options: { confirm: { type: "boolean", default: false } },
  });
  const command = positionals[0] ?? "plan";
  const plan = readManifest().video;

  if (command === "plan") return printPlan(plan);
  if (command === "poll") return poll();

  if (command === "start") {
    if (existsSync(JOB_PATH)) {
      throw new Error("A video job is already recorded in .video-job.json. Run `pnpm video:poll` instead of starting another.");
    }
    if (!values.confirm) {
      printPlan(plan);
      console.log("Dry run only. Re-run with --confirm to start this paid generation.");
      return;
    }
    const job = await createVideoJob({
      prompt: plan.prompt,
      aspectRatio: plan.aspectRatio,
      resolution: plan.resolution,
      durationSeconds: plan.durationSeconds,
    });
    writeFileSync(JOB_PATH, JSON.stringify({ id: job.id, startedAt: new Date().toISOString() }, null, 2));
    console.log(`Started video job ${job.id} (status: ${job.status}). Poll with \`pnpm video:poll\`.`);
    if (isTerminal(job.status)) await poll();
    return;
  }

  throw new Error(`Unknown command "${command}". Use plan, start or poll.`);
}

main().catch((error: unknown) => {
  const message = error instanceof GenerationError ? `${error.code}: ${error.message}` : redact(String(error instanceof Error ? error.message : error));
  console.error(message);
  process.exitCode = 1;
});
