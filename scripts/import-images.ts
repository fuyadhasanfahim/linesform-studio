/**
 * Registers image files that already exist in public/ (for example, images
 * made with an external tool) in src/content/asset-manifest.json.
 * Local only: no network requests and no API calls.
 *
 *   pnpm assets:import            Validate every manifest image and record it.
 *   pnpm assets:import --check    Validate only; exit 1 if the manifest is out of date.
 *
 * For each asset the file must exist at public/<file>, be a real JPEG and
 * decode completely. The script records the real width, height, byte size,
 * a short SHA-256, a 16px blur placeholder and the file's actual aspect
 * ratio (keeping the originally requested ratio when they differ), and marks
 * the asset as available. Files are never modified.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";

const ROOT = join(import.meta.dirname, "..");
const MANIFEST_PATH = join(ROOT, "src/content/asset-manifest.json");
const RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"] as const;
/** A file within this tolerance of its specified ratio keeps that ratio. */
const RATIO_TOLERANCE = 0.02;

interface Asset {
  id: string;
  file: string;
  aspectRatio: string;
  requestedAspectRatio?: string;
  status: string;
  width?: number;
  height?: number;
  blurDataURL?: string;
  source?: { method: string; importedAt: string; bytes: number; sha256: string };
  error?: string;
}

const ratioValue = (ratio: string) => {
  const [w, h] = ratio.split(":").map(Number);
  return w / h;
};

function nearestRatio(width: number, height: number): string {
  const actual = width / height;
  return RATIOS.reduce((best, ratio) =>
    Math.abs(ratioValue(ratio) - actual) < Math.abs(ratioValue(best) - actual) ? ratio : best,
  );
}

async function inspect(asset: Asset) {
  const path = join(ROOT, "public", asset.file);
  if (!existsSync(path)) throw new Error(`missing file public${asset.file}`);
  const bytes = readFileSync(path);
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) throw new Error("not a JPEG file");

  const { width, height, format, space } = await sharp(bytes).metadata();
  if (format !== "jpeg" || !width || !height) throw new Error(`unreadable image (format ${format})`);
  await sharp(bytes).stats(); // Full decode: fails on truncated or corrupt data.

  // Keep the specified ratio when the file matches it; otherwise record the real one.
  const specified = asset.requestedAspectRatio ?? asset.aspectRatio;
  const deviation = Math.abs(width / height - ratioValue(specified)) / ratioValue(specified);
  const aspectRatio = deviation <= RATIO_TOLERANCE ? specified : nearestRatio(width, height);

  const blur = await sharp(bytes).resize(16).webp({ quality: 45 }).toBuffer();
  return {
    width,
    height,
    space,
    aspectRatio,
    requestedAspectRatio: aspectRatio === specified ? undefined : specified,
    blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex").slice(0, 16),
  };
}

async function main(): Promise<void> {
  const { values } = parseArgs({ options: { check: { type: "boolean", default: false } } });
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as { assets: Asset[] };
  const problems: string[] = [];
  let stale = 0;

  for (const asset of manifest.assets) {
    try {
      const found = await inspect(asset);
      const upToDate =
        asset.status === "generated" &&
        asset.width === found.width &&
        asset.height === found.height &&
        asset.aspectRatio === found.aspectRatio &&
        asset.source?.sha256 === found.sha256;
      if (!upToDate) stale += 1;

      const ratioNote = found.requestedAspectRatio ? ` (specified ${found.requestedAspectRatio})` : "";
      console.log(
        `${upToDate ? "ok     " : "update "} ${asset.id.padEnd(28)} ${`${found.width}×${found.height}`.padEnd(10)} ` +
          `${found.aspectRatio}${ratioNote}`.padEnd(22) + ` ${(found.bytes / 1_048_576).toFixed(2)} MB  ${found.space}`,
      );

      if (!values.check && !upToDate) {
        Object.assign(asset, {
          status: "generated",
          width: found.width,
          height: found.height,
          aspectRatio: found.aspectRatio,
          requestedAspectRatio: found.requestedAspectRatio,
          blurDataURL: found.blurDataURL,
          source: {
            method: "manual-upload",
            importedAt: new Date().toISOString(),
            bytes: found.bytes,
            sha256: found.sha256,
          },
          error: undefined,
        });
      }
    } catch (error) {
      problems.push(`${asset.id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (problems.length) {
    console.error(`\n${problems.length} problem(s):\n  ${problems.join("\n  ")}`);
    process.exitCode = 1;
  }

  if (values.check) {
    if (stale) {
      console.error(`\n${stale} manifest entr${stale === 1 ? "y is" : "ies are"} out of date. Run pnpm assets:import.`);
      process.exitCode = 1;
    }
    return;
  }

  if (!problems.length) {
    const temp = `${MANIFEST_PATH}.tmp`;
    writeFileSync(temp, `${JSON.stringify(manifest, null, 2)}\n`);
    renameSync(temp, MANIFEST_PATH);
    console.log(`\nManifest updated: ${stale} changed, ${manifest.assets.length - stale} already current.`);
  } else {
    console.error("Manifest left unchanged because of the problems above.");
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
