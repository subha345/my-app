"use client";

import { useState } from "react";
import Link from "next/link";

const QR_API = "https://api.qrserver.com/v1/create-qr-code/";

export default function QRGeneratorPage() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(200);

  const qrUrl = `${QR_API}?size=${size}x${size}&data=${encodeURIComponent(text)}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">QR Code Generator</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                URL or Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Enter URL or any text..."
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Size: {size}px
              </label>
              <input
                type="range"
                min="100"
                max="400"
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
          </div>

          {text.trim() && (
            <div className="mt-8 flex flex-col items-center overflow-hidden">
              <div
                className="rounded-lg border border-border bg-white p-4 max-w-full"
                style={{ width: Math.min(size + 32, 320), height: Math.min(size + 32, 320) }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="QR Code"
                  width={Math.min(size, 288)}
                  height={Math.min(size, 288)}
                  className="mx-auto max-w-full"
                />
              </div>
              <a
                href={qrUrl}
                download="qrcode.png"
                className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-light"
              >
                Download PNG
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
