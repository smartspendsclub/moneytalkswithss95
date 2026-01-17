"use client";
import { useState } from "react";
import Link from "next/link";
import { interviewPrep } from "../../../lib/content/epm/interview-prep";

export default function InterviewPrepPage() {
  const [activeTab, setActiveTab] = useState<"Foundation" | "Intermediate" | "Advanced">("Foundation");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredQuestions = interviewPrep.filter(q => q.difficulty === activeTab);

  const difficultyColors = {
    Foundation: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    Intermediate: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    Advanced: "text-rose-400 border-rose-500/30 bg-rose-500/10"
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <Link href="/blog/epm" className="text-xs text-slate-400 hover:text-fuchsia-400">
            ← Back to Mastery Journal
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-slate-50 font-serif">
            EPM Technical Interview Prep
          </h1>
          <p className="mt-2 text-slate-400">
            Categorized questions from real-world Oracle EPM implementations.
          </p>
        </header>

        {/* Difficulty Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-800 pb-4">
          {(["Foundation", "Intermediate", "Advanced"] as const).map((level) => (
            <button
              key={level}
              onClick={() => { setActiveTab(level); setOpenQuestion(null); }}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest transition ${
                activeTab === level 
                ? "bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20" 
                : "text-slate-500 hover:text-slate-300 bg-slate-900"
              }`}
            >
              {level.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => (
            <article 
              key={q.id} 
              className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden"
            >
              <button
                onClick={() => setOpenQuestion(openQuestion === q.id ? null : q.id)}
                className="w-full text-left p-6 flex justify-between items-center group"
              >
                <div className="flex-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold mb-2 inline-block ${difficultyColors[activeTab]}`}>
                    {q.module || "General"}
                  </span>
                  <h3 className="text-slate-200 font-medium group-hover:text-fuchsia-300 transition">
                    {q.question}
                  </h3>
                </div>
                <span className="ml-4 text-slate-500 group-hover:text-fuchsia-400">
                  {openQuestion === q.id ? "−" : "+"}
                </span>
              </button>

              {openQuestion === q.id && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                      {q.answer}
                    </p>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}