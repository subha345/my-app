"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const WORK_MIN = 25;
const BREAK_MIN = 5;

export default function PomodoroPage() {
  const [mode, setMode] = useState<"work" | "break">("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_MIN * 60);
  const [isRunning, setIsRunning] = useState(false);

  const reset = useCallback((m: "work" | "break") => {
    setMode(m);
    setSecondsLeft((m === "work" ? WORK_MIN : BREAK_MIN) * 60);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setIsRunning(false);
          const next = mode === "work" ? "break" : "work";
          setMode(next);
          setSecondsLeft((next === "work" ? WORK_MIN : BREAK_MIN) * 60);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, mode]);

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/apps" className="min-h-[44px] inline-flex items-center text-sm font-medium text-muted hover:text-accent">
            ← Back
          </Link>
          <h1 className="text-lg font-bold text-foreground sm:text-xl">Pomodoro Timer</h1>
          <div className="w-14 sm:w-20" />
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 flex gap-2">
          <button
            onClick={() => reset("work")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mode === "work"
                ? "bg-accent text-white"
                : "border border-border text-muted hover:border-accent hover:text-accent"
            }`}
          >
            Work
          </button>
          <button
            onClick={() => reset("break")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              mode === "break"
                ? "bg-green-500 text-white"
                : "border border-border text-muted hover:border-green-500 hover:text-green-400"
            }`}
          >
            Break
          </button>
        </div>

        <div className="mb-10 flex h-56 w-56 sm:h-64 sm:w-64 items-center justify-center rounded-full border-4 border-accent/50 bg-surface">
          <span className="font-mono text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
            {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="rounded-full bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-light"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => reset(mode)}
            className="rounded-full border border-border px-8 py-3 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}
