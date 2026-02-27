#!/usr/bin/env node
/**
 * Generates PWA icons (192x192 and 512x512) for the app.
 * Run: node scripts/generate-pwa-icons.mjs
 */
import sharp from "sharp";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// Accent color from globals.css: #6366f1 (indigo)
const accentColor = { r: 99, g: 102, b: 241 };
const bgColor = { r: 10, g: 10, b: 10 };

async function createIcon(size) {
  const padding = Math.floor(size * 0.15);
  const center = size / 2;
  const radius = (size - padding * 2) / 2;

  // Create SVG for "SS" logo with accent styling
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#0a0a0a"/>
          <stop offset="100%" style="stop-color:#1a1a2e"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1"/>
          <stop offset="100%" style="stop-color:#818cf8"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect x="${padding}" y="${padding}" width="${size - padding * 2}" height="${size - padding * 2}" rx="${radius}" fill="none" stroke="url(#accent)" stroke-width="${Math.max(2, size / 64)}"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${size * 0.35}" font-weight="bold" fill="#6366f1">SS</text>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="system-ui, sans-serif" font-size="${size * 0.12}" font-weight="normal" fill="#818cf8" dy="${size * 0.22}">.</text>
    </svg>
  `;

  return sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toBuffer();
}

async function main() {
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  try {
    const [icon192, icon512] = await Promise.all([
      createIcon(192),
      createIcon(512),
    ]);

    writeFileSync(join(publicDir, "icon-192.png"), icon192);
    writeFileSync(join(publicDir, "icon-512.png"), icon512);

    console.log("✓ Generated icon-192.png and icon-512.png in public/");
  } catch (err) {
    console.error("Error generating icons:", err);
    process.exit(1);
  }
}

main();
