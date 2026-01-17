"use client";

import Link from "next/link";
import { architectureModules } from "@content/epm/architecture";

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* HEADER */}
        <div className="mb-20">
          <Link
            href="/blog/epm"
            className="text-sky-400 text-sm hover:underline"
          >
            ← Back to Journal
          </Link>

          <h1 className="text-5xl md:text-6xl font-black mt-6 tracking-tight">
            Application <span className="text-sky-400">Architecture</span>
          </h1>

          <p className="text-gray-400 mt-6 max-w-3xl text-lg border-l-2 border-gray-800 pl-6">
            Enterprise-grade blueprints for designing Oracle EPM systems.
            Each module below opens a full deep-dive knowledge path.
          </p>
        </div>

        {/* MODULE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {architectureModules.map((module) => (
            <Link
              key={module.id}
              href={`/blog/epm/architecture/${module.id}`}
              className="group relative p-10 rounded-3xl border border-gray-800/60 bg-gray-900/10 hover:bg-gray-900/30 transition-all duration-500 overflow-hidden"
            >
              {/* Glow */}
              <div
                className="absolute -top-16 -right-16 w-40 h-40 blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: module.colorHex }}
              />

              <span className="text-[10px] tracking-[0.3em] font-black uppercase text-gray-500">
                {module.tag}
              </span>

              <h2
                className="text-2xl font-extrabold mt-4 mb-4 group-hover:translate-x-1 transition-transform"
                style={{ color: module.colorHex }}
              >
                {module.title}
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-10">
                {module.description}
              </p>

              <div className="text-[10px] font-black tracking-widest text-gray-500 group-hover:text-white">
                ENTER MODULE →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
