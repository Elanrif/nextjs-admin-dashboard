"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Support", href: "#support" },
  { label: "Pages", href: "#pages" },
  { label: "API", href: "/features" },
  { label: "Dashboard", href: "/dashboard" },
];

export default function MainHeader() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const activeItem = navItems.find((item) => isActiveLink(item.href));

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/80 dark:border-slate-800/80 dark:bg-slate-950/90 dark:supports-backdrop-filter:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-3 text-2xl font-bold hover:cursor-pointer" onClick={() => router.push("/")}>
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full bg-indigo-500" />
            <span className="h-7 w-2 rounded-full bg-indigo-400" />
            <span className="h-4 w-4 rounded-full bg-indigo-500" />
          </div>
          <span>El-Anrif</span>
        </div>

        <nav className="hidden items-center gap-4 text-sm font-medium text-slate-500 md:flex dark:text-slate-400">
          {navItems.map((item) => {
            const isActive = activeItem?.label === item.label;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${
                  isActive
                    ? "font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggleButton />
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          >
            <span className="text-xl leading-none">
              {mobileMenuOpen ? "✕" : "☰"}
            </span>
          </button>
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50 sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="hidden rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-500 sm:inline-flex"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-slate-200/80 px-4 py-4 dark:border-slate-800/80 sm:px-6 md:hidden">
          <div className="mx-auto max-w-7xl rounded-3xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="grid gap-2">
              {navItems.map((item) => {
                const isActive = activeItem?.label === item.label;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800 "
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
