"use client";

import { useState } from "react";
import Link from "next/link";

export default function BMICalculatorPage() {
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");

  const h = parseFloat(heightCm) / 100;
  const w = parseFloat(weightKg);
  const bmi = h > 0 && w > 0 ? w / (h * h) : 0;

  const category =
    bmi < 18.5
      ? { label: "Underweight", color: "text-blue-400" }
      : bmi < 25
        ? { label: "Normal", color: "text-green-400" }
        : bmi < 30
          ? { label: "Overweight", color: "text-yellow-400" }
          : { label: "Obese", color: "text-red-400" };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">BMI Calculator</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-surface p-4 sm:p-8">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Height (cm)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                min="50"
                max="250"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                min="20"
                max="300"
                step="0.1"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {bmi > 0 && (
            <div className="mt-8 rounded-xl border border-accent/30 bg-accent/5 p-6 text-center">
              <p className="text-sm text-muted">Your BMI</p>
              <p className="text-4xl font-bold text-accent">
                {bmi.toFixed(1)}
              </p>
              <p className={`mt-2 font-medium ${category.color}`}>
                {category.label}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
