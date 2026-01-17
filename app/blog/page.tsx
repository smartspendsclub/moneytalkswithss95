import Link from "next/link";

export default function BlogHome() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-14">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-50">MoneyTalks Journal</h1>
          <p className="text-slate-400 max-w-3xl text-sm">
            A dual-track knowledge notebook — mastering Oracle EPM architecture
            and building calm, psychology-driven financial planning thinking.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Oracle EPM */}
          <Link href="/blog/epm">
            <article className="group rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-900/40 to-slate-950 p-6 hover:-translate-y-1 transition">
              <span className="text-[11px] uppercase text-sky-300 tracking-widest">Oracle EPM Journal</span>
              <h2 className="mt-2 text-xl font-semibold text-slate-50">
                Architect-grade Oracle EPM Mastery
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Essbase, FCCS, EDMCS, hierarchy design, calc failures, metadata
                automation and real-world problem solving.
              </p>
              <p className="mt-4 text-sky-300 text-xs">Explore Oracle EPM Journal →</p>
            </article>
          </Link>

          {/* Financial Planning */}
          <Link href="/blog/financial-planning">
            <article className="group rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/40 to-slate-950 p-6 hover:-translate-y-1 transition">
              <span className="text-[11px] uppercase text-emerald-300 tracking-widest">Financial Planning Journal</span>
              <h2 className="mt-2 text-xl font-semibold text-slate-50">
                Calm Thinking About Money — Not Products
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                SIP behaviour, FIRE realism, net-worth psychology and
                long-term wealth frameworks.
              </p>
              <p className="mt-4 text-emerald-300 text-xs">Explore Financial Journal →</p>
            </article>
          </Link>
        </div>
      </div>
    </main>
  );
}
