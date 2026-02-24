"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

const CHARS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = useCallback(() => {
    let pool = "";
    if (includeUpper) pool += CHARS.upper;
    if (includeLower) pool += CHARS.lower;
    if (includeNumbers) pool += CHARS.numbers;
    if (includeSymbols) pool += CHARS.symbols;
    if (!pool) {
      setPassword("Select at least one option");
      return;
    }
    let result = "";
    const arr = new Uint8Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) {
      result += pool[arr[i] % pool.length];
    }
    setPassword(result);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Password Generator</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              readOnly
              value={password}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm text-foreground"
            />
            <button
              onClick={copy}
              disabled={!password}
              className="rounded-lg bg-accent px-4 py-3 text-sm font-medium text-white hover:bg-accent-light disabled:opacity-50"
            >
              Copy
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 flex items-center justify-between text-sm text-foreground">
                Length: {length}
              </label>
              <input
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>
            {[
              { key: "includeUpper", label: "Uppercase", checked: includeUpper, set: setIncludeUpper },
              { key: "includeLower", label: "Lowercase", checked: includeLower, set: setIncludeLower },
              { key: "includeNumbers", label: "Numbers", checked: includeNumbers, set: setIncludeNumbers },
              { key: "includeSymbols", label: "Symbols", checked: includeSymbols, set: setIncludeSymbols },
            ].map(({ key, label, checked, set }) => (
              <label key={key} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => set(e.target.checked)}
                  className="rounded border-border accent-accent"
                />
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>

          <button
            onClick={generate}
            className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-medium text-white hover:bg-accent-light"
          >
            Generate Password
          </button>
        </div>
      </main>
    </div>
  );
}
