/**
 * MeetCoffee — asset preparation pipeline.
 *
 * Derives every intro asset from a single photoreal source frame
 * (public/images/intro/_source.png) and converts gallery PNGs to WebP.
 *
 * Run with:  npm run assets
 *
 * The intro needs two things out of the source frame:
 *   1. a "calm" plate  — the cup with NO bean above it (the resting surface)
 *   2. a bean sprite   — the bean cut out with a feathered alpha edge
 * The intro canvas then animates the sprite falling onto the calm plate and
 * ripples the plate in a shader, so no video file is required.
 */
import sharp from "sharp";
import { mkdir, readdir, unlink } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const INTRO_DIR = path.join(ROOT, "public/images/intro");
const GALLERY_DIR = path.join(ROOT, "public/images/gallery");

// Cadrul-sursă stă în AFARA folderului `public/`: are peste 2 MB și nu are ce
// căuta pe serverul web. Din el se derivează fișierele optimizate de mai jos.
const SRC = path.join(ROOT, "assets-source/intro-source.png");

// --- Hand-measured geometry of the source frame (1376x768) -----------------
// Update these if the source frame is ever replaced. See ASSETS.md.
const BEAN = { left: 638, top: 262, width: 108, height: 112 }; // bean bounding box
const PATCH = { cx: 691, cy: 350, rx: 82, ry: 125 }; // area to paint out (bean + cast shadow)
const STRIP = 14; // width of the donor columns taken either side of the bean

/**
 * Inpaint the bean away by interpolation rather than cloning.
 *
 * The liquid behind the bean is a smooth reflection gradient that varies far
 * more vertically than horizontally, so a narrow column lifted from just
 * outside the patch and stretched across it reproduces that gradient almost
 * exactly. Doing it from both sides and cross-fading left-to-right makes both
 * seams disappear. Cloning a whole donor block (the obvious approach) drags
 * the bright reflection edge along with it and reads as a smear.
 */
async function buildCalmPlate(meta) {
  const { width, height } = meta;
  const patchW = PATCH.rx * 2;
  const patchH = PATCH.ry * 2;
  const top = Math.round(PATCH.cy - PATCH.ry);

  const column = async (left) =>
    sharp(SRC)
      .extract({ left: Math.round(left), top, width: STRIP, height: patchH })
      .resize(patchW, patchH, { fit: "fill" })
      .png()
      .toBuffer();

  const leftCol = await column(PATCH.cx - PATCH.rx - STRIP - 6);
  const rightCol = await column(PATCH.cx + PATCH.rx + 6);

  // Horizontal ramp: fully left column at x=0, fully right column at x=patchW.
  const ramp = Buffer.from(
    `<svg width="${patchW}" height="${patchH}">
       <defs>
         <linearGradient id="r" x1="0" y1="0" x2="1" y2="0">
           <stop offset="0%" stop-color="#fff" stop-opacity="0"/>
           <stop offset="100%" stop-color="#fff" stop-opacity="1"/>
         </linearGradient>
       </defs>
       <rect width="${patchW}" height="${patchH}" fill="url(#r)"/>
     </svg>`,
  );

  const rightFaded = await sharp(rightCol)
    .ensureAlpha()
    .composite([{ input: ramp, blend: "dest-in" }])
    .png()
    .toBuffer();

  const donor = await sharp(leftCol)
    .composite([{ input: rightFaded, blend: "over" }])
    .blur(3) // soften the stretch banding
    .png()
    .toBuffer();

  // ...and feather it through a soft-edged elliptical mask.
  const mask = Buffer.from(
    `<svg width="${patchW}" height="${patchH}">
       <defs>
         <radialGradient id="g" cx="50%" cy="50%" r="50%">
           <stop offset="45%" stop-color="#fff" stop-opacity="1"/>
           <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
         </radialGradient>
       </defs>
       <ellipse cx="${PATCH.rx}" cy="${PATCH.ry}" rx="${PATCH.rx}" ry="${PATCH.ry}" fill="url(#g)"/>
     </svg>`,
  );

  const feathered = await sharp(donor)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  return sharp(SRC)
    .composite([
      {
        input: feathered,
        left: Math.round(PATCH.cx - PATCH.rx),
        top: Math.round(PATCH.cy - PATCH.ry),
      },
    ])
    .resize(width, height)
    .png()
    .toBuffer();
}

async function buildBeanSprite() {
  const { width: w, height: h } = BEAN;
  // Elliptical feather: the bean sits on near-black liquid, so a soft edge
  // composites invisibly wherever it lands.
  const mask = Buffer.from(
    `<svg width="${w}" height="${h}">
       <defs>
         <radialGradient id="g" cx="50%" cy="50%" r="50%">
           <stop offset="62%" stop-color="#fff" stop-opacity="1"/>
           <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
         </radialGradient>
       </defs>
       <ellipse cx="${w / 2}" cy="${h / 2}" rx="${w / 2}" ry="${h / 2}" fill="url(#g)"/>
     </svg>`,
  );

  return sharp(SRC)
    .extract(BEAN)
    .ensureAlpha()
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
}

async function main() {
  await mkdir(INTRO_DIR, { recursive: true });
  const meta = await sharp(SRC).metadata();
  console.log(`source frame: ${meta.width}x${meta.height}`);

  const calm = await buildCalmPlate(meta);
  const bean = await buildBeanSprite();

  // Desktop plate — 16:9-ish, full frame.
  await sharp(calm)
    .resize(1600, null, { withoutEnlargement: false })
    .webp({ quality: 82 })
    .toFile(path.join(INTRO_DIR, "intro-plate-desktop.webp"));

  // Mobile plate — centre-safe portrait crop around the cup.
  const cropW = Math.round(meta.height * 0.8);
  await sharp(calm)
    .extract({
      left: Math.round(PATCH.cx - cropW / 2),
      top: 0,
      width: cropW,
      height: meta.height,
    })
    .resize(1000, null)
    .webp({ quality: 80 })
    .toFile(path.join(INTRO_DIR, "intro-plate-mobile.webp"));

  // NOTE: the plate files above ARE the poster frames. The <img> that the
  // browser paints first is the very same element WebGL later uploads as its
  // texture, so the handover from poster to canvas is pixel-identical — no
  // black frame, no re-framing pop. Generating a separate poster would only
  // introduce a file that has to stay in sync. See ASSETS.md.

  await sharp(bean)
    .resize(220, null)
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(path.join(INTRO_DIR, "intro-bean.webp"));

  // Hero backdrop — the same scene with the bean still suspended, so the site
  // behind the curtain reads as a continuation of the intro rather than a
  // different photo. Also the static fallback for reduced-motion visitors.
  await sharp(SRC)
    .resize(1800, null)
    .webp({ quality: 74 })
    .toFile(path.join(INTRO_DIR, "intro-fallback.webp"));

  console.log("intro assets written");

  // --- Gallery: PNG -> WebP ------------------------------------------------
  const files = await readdir(GALLERY_DIR).catch(() => []);
  for (const file of files) {
    if (!file.endsWith(".png")) continue;
    const from = path.join(GALLERY_DIR, file);
    const to = from.replace(/\.png$/, ".webp");
    const info = await sharp(from)
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(to);
    await unlink(from);
    console.log(`gallery: ${file} -> ${path.basename(to)} (${Math.round(info.size / 1024)} kB)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
