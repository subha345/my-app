"use client";

import { useState } from "react";
import Link from "next/link";

const CONVERSIONS: Record<
  string,
  { label: string; units: { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] }
> = {
  length: {
    label: "Length",
    units: [
      { name: "Meters", toBase: (v) => v, fromBase: (v) => v },
      { name: "Kilometers", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { name: "Feet", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { name: "Miles", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
      { name: "Inches", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { name: "Kilograms", toBase: (v) => v, fromBase: (v) => v },
      { name: "Grams", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { name: "Pounds", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { name: "Ounces", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    ],
  },
  temp: {
    label: "Temperature",
    units: [
      { name: "Celsius", toBase: (v) => v, fromBase: (v) => v },
      { name: "Fahrenheit", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { name: "Kelvin", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
};

export default function UnitConverterPage() {
  const [category, setCategory] = useState<keyof typeof CONVERSIONS>("length");
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [value, setValue] = useState("1");

  const cat = CONVERSIONS[category];
  const num = parseFloat(value) || 0;
  const base = cat.units[fromUnit].toBase(num);
  const result = cat.units[toUnit].fromBase(base);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Unit Converter</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          <div className="mb-6 flex flex-wrap gap-2">
            {(Object.keys(CONVERSIONS) as (keyof typeof CONVERSIONS)[]).map((k) => (
              <button
                key={k}
                onClick={() => setCategory(k)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  category === k
                    ? "bg-accent text-white"
                    : "border border-border text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {CONVERSIONS[k].label}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm text-muted">From</label>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none sm:w-40"
                >
                  {cat.units.map((u, i) => (
                    <option key={u.name} value={i}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted">To</label>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <input
                  type="text"
                  readOnly
                  value={result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                  className="min-w-0 flex-1 rounded-lg border border-border bg-surface-light px-4 py-3 text-foreground"
                />
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none sm:w-40"
                >
                  {cat.units.map((u, i) => (
                    <option key={u.name} value={i}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
