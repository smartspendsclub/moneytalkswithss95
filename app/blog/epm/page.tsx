import Link from "next/link";

const sections = [
  { 
    slug: "foundations", 
    title: "EPM Foundations", 
    tag: "START HERE", 
    color: "emerald",
    desc: "Essbase basics, FCCS logic, dimensions, metadata, calc rules." 
  },
  { 
    slug: "interview-prep", 
    title: "Interview Preparation", 
    tag: "CAREER", 
    color: "fuchsia",
    desc: "Foundation, Intermediate, and Advanced questions to ace your next technical EPM interview." 
  },
  { 
    slug: "architecture", 
    title: "Application Architecture", 
    tag: "DESIGN", 
    color: "sky",
    desc: "Hierarchy strategy, performance design, environment flows." 
  },
  { 
    slug: "problems", 
    title: "Real Project Problems", 
    tag: "FIELD", 
    color: "amber",
    desc: "Broken calc rules, EDMCS sync failures, SmartView chaos." 
  },
  { 
    slug: "architect-lens", 
    title: "Architect Lens", 
    tag: "STRATEGY", 
    color: "violet",
    desc: "Why systems fail, automation thinking, scaling FCCS." 
  },
  { 
    slug: "updates", 
    title: "Monthly Oracle EPM Updates", 
    tag: "UPDATES", 
    color: "rose",
    desc: "FCCS, PBCS, Essbase & EDMCS monthly behaviour changes." 
  },
];

export default function EpmJournal() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <header>
          <Link href="/blog" className="text-xs text-slate-400 hover:text-sky-300">
            ← Back to Journal
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-slate-50">
            Oracle EPM Mastery Journal
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-400">
            Built from real project experience — not certification memory.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link key={s.slug} href={`/blog/epm/${s.slug}`}>
              <article className="h-full rounded-3xl border border-slate-700/60 bg-slate-950/60 p-5 hover:border-sky-500/50 transition flex flex-col justify-between group">
                <div>
                  <span className={`text-[11px] uppercase tracking-widest font-bold text-${s.color}-400`}>
                    {s.tag}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-slate-50 group-hover:text-sky-300 transition">
                    {s.title}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <p className={`mt-4 text-xs text-${s.color}-300 font-medium`}>
                  Explore →
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}