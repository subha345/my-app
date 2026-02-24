"use client";

import { useState } from "react";
import Link from "next/link";

export default function TipCalculatorPage() {
  const [bill, setBill] = useState("100");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("2");

  const b = parseFloat(bill) || 0;
  const tip = b * ((parseFloat(tipPercent) || 0) / 100);
  const total = b + tip;
  const p = Math.max(1, parseInt(people, 10) || 1);
  const perPerson = total / p;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Tip Calculator</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Bill Amount (₹)
              </label>
              <input
                type="number"
                value={bill}
                onChange={(e) => setBill(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Tip (%)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(String(pct))}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                      tipPercent === String(pct)
                        ? "bg-accent text-white"
                        : "border border-border text-muted hover:border-accent hover:text-accent"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={tipPercent}
                onChange={(e) => setTipPercent(e.target.value)}
                min="0"
                max="100"
                className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Split between (people)
              </label>
              <input
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                min="1"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-xl border border-accent/30 bg-accent/5 p-6">
            <div className="flex justify-between text-foreground">
              <span>Tip</span>
              <span className="font-semibold">₹{tip.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Total</span>
              <span className="font-semibold">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-accent">
              <span>Per person</span>
              <span className="font-bold">₹{perPerson.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
