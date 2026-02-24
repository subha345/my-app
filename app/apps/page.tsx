import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AppsHeader from "./AppsHeader";

const APPS = [
  {
    slug: "splitease",
    name: "SplitEase",
    description: "Split expenses between friends. Add friends, log transactions, edit anytime.",
    icon: "💰",
    href: "/apps/splitease",
  },
  {
    slug: "sip-calculator",
    name: "SIP Calculator",
    description: "Calculate returns on Systematic Investment Plan (SIP) investments.",
    icon: "📈",
    href: "/apps/sip-calculator",
  },
  {
    slug: "resume-templates",
    name: "Resume Templates",
    description: "Download professional resume templates in DOCX format.",
    icon: "📄",
    href: "/apps/resume-templates",
  },
  {
    slug: "unit-converter",
    name: "Unit Converter",
    description: "Convert length, weight, temperature, and more.",
    icon: "📐",
    href: "/apps/unit-converter",
  },
  {
    slug: "pomodoro",
    name: "Pomodoro Timer",
    description: "Focus timer with work/break cycles for productivity.",
    icon: "🍅",
    href: "/apps/pomodoro",
  },
  {
    slug: "qr-generator",
    name: "QR Code Generator",
    description: "Generate QR codes for URLs or text.",
    icon: "📱",
    href: "/apps/qr-generator",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Calculate your Body Mass Index and health category.",
    icon: "⚖️",
    href: "/apps/bmi-calculator",
  },
  {
    slug: "password-generator",
    name: "Password Generator",
    description: "Generate secure random passwords.",
    icon: "🔐",
    href: "/apps/password-generator",
  },
  {
    slug: "todo",
    name: "Todo List",
    description: "Simple task manager to track your to-dos.",
    icon: "✅",
    href: "/apps/todo",
  },
  {
    slug: "tip-calculator",
    name: "Tip Calculator",
    description: "Split bill with tip percentage and number of people.",
    icon: "🧾",
    href: "/apps/tip-calculator",
  },
];

export default async function AppsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <AppsHeader userEmail={user?.email ?? null} />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-14 text-center">
          <p className="mb-2 font-mono text-sm tracking-wider text-accent">
            Mini Apps
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Handy Tools & Utilities
          </h1>
          <p className="mx-auto max-w-xl text-muted">
            A collection of useful mini applications — calculators, converters,
            and productivity tools.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {APPS.map((app) => (
            <Link
              key={app.slug}
              href={app.href}
              className="group card-lift flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-2xl transition-colors group-hover:bg-accent/30">
                {app.icon}
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground group-hover:text-accent">
                {app.name}
              </h2>
              <p className="flex-1 text-sm leading-relaxed text-muted">
                {app.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
                Open app
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
