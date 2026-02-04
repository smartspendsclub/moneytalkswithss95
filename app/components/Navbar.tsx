"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tools", href: "/tools" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu when navigation occurs
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-baseline gap-1 text-xl font-semibold tracking-tight"
        >
          <span className="bg-linear-to-r from-emerald-300 via-emerald-400 to-sky-300 bg-clip-text text-transparent">
            MoneyTalks
          </span>
          <span className="text-[13px] font-medium text-emerald-200/80">
            with&nbsp;SS
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  active
                    ? "bg-linear-to-r from-emerald-400 to-emerald-500 text-slate-950 shadow-md shadow-emerald-500/40"
                    : "text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger menu (mobile only) */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-100 shadow-sm hover:border-slate-500 hover:bg-slate-800 sm:hidden"
          aria-label="Toggle Menu"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            {isOpen ? (
              <path
                d="M6 18L18 6M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="border-t border-slate-800 bg-slate-950/95 backdrop-blur sm:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm font-medium">
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-3 py-2 transition ${
                    active
                      ? "bg-linear-to-r from-emerald-400 to-emerald-500 text-slate-950"
                      : "text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
