"use client";

import Link from "next/link";
import { signOut } from "@/app/actions/auth";

export default function AppsHeader({ userEmail }: { userEmail: string | null }) {
  return (
    <header className="border-b border-border bg-surface/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-foreground hover:text-accent"
        >
          SS<span className="text-accent">.</span>
        </Link>
        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="hidden text-sm text-muted sm:inline">{userEmail}</span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-accent hover:text-accent min-h-[44px] inline-flex items-center"
            >
              Sign out
            </button>
          </form>
          <Link
            href="/"
            className="rounded-full border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-accent hover:text-accent min-h-[44px] inline-flex items-center"
          >
            Portfolio
          </Link>
        </div>
      </div>
    </header>
  );
}
