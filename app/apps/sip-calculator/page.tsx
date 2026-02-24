"use client";

import { useState } from "react";
import Link from "next/link";

export default function SIPCalculatorPage() {
  const [monthlyAmount, setMonthlyAmount] = useState("5000");
  const [annualReturn, setAnnualReturn] = useState("12");
  const [years, setYears] = useState("10");

  const p = parseFloat(monthlyAmount) || 0;
  const r = (parseFloat(annualReturn) || 0) / 100 / 12;
  const n = (parseFloat(years) || 0) * 12;

  const maturity =
    r > 0 && n > 0
      ? p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
      : p * n;
  const totalInvested = p * n;
  const wealthGain = maturity - totalInvested;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">SIP Calculator</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          <p className="mb-8 text-muted">
            Calculate potential returns on your Systematic Investment Plan (SIP).
          </p>

          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(e.target.value)}
                min="100"
                step="500"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(e.target.value)}
                min="1"
                max="30"
                step="0.5"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Time Period (Years)
              </label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                min="1"
                max="40"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="mt-10 space-y-4 rounded-xl border border-accent/30 bg-accent/5 p-6">
            <div className="flex justify-between text-foreground">
              <span>Total Invested</span>
              <span className="font-semibold">₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Est. Maturity Amount</span>
              <span className="font-bold text-accent">
                ₹{maturity.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Wealth Gained</span>
              <span className="font-semibold">
                ₹{wealthGain.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
