'use client';

export default function HomePage() {
  return (
    <section className="space-y-10 md:space-y-12 pt-6 md:pt-10">
      {/* HERO · PLANNING CONSOLE */}
      <div className="rounded-3xl border border-emerald-400/25 bg-linear-to-br from-slate-950 via-slate-950 to-slate-900 p-5 shadow-[0_0_40px_rgba(16,185,129,0.15)] md:p-7">
        <div className="grid gap-8 md:grid-cols-[3fr,2.4fr] md:items-center">
          {/* LEFT: INTRO + CTAS */}
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/8 px-3 py-1 text-[11px] font-medium text-emerald-100 shadow-inner shadow-emerald-500/40">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
              MoneyTalks with SS · Financial Planning
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -inset-x-10 -top-5 h-24 bg-radial from-emerald-500/25 via-transparent to-transparent blur-3xl" />
              <h1 className="relative text-3xl font-semibold tracking-[-0.015em] text-slate-50 sm:text-4xl lg:text-[2.7rem]">
                A calm place to plan
                <span className="block text-emerald-200">
                  your money, your goals, your future.
                </span>
              </h1>

            </div>

            {/* Emotional bridge */}
            <p className="max-w-xl text-sm text-slate-300 sm:text-[15px]">
              Understand where your money stands today — and what it can quietly
              become over time, with clarity and confidence.
            </p>

            {/* Tighter intro */}
            <p className="max-w-xl text-sm text-slate-300 sm:text-[15px]">
              I&apos;m{" "}
              <span className="font-medium text-slate-100">
                Sai Srinivas Guduru
              </span>
              , a CFP aspirant. I focus on SIPs, long-term investing and
              goal-based planning — without commissions, product pushing or
              noise.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <a
                href="/tools/sip"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
              >
                <span>Start planning with SIP</span>
                <span className="text-[11px] font-normal text-emerald-950/80 group-hover:text-emerald-950">
                  (simple · long-term · realistic)
                </span>
              </a>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-500/60 bg-slate-900/60 px-5 py-2 text-sm font-medium text-slate-100 backdrop-blur transition hover:border-slate-300 hover:bg-slate-900"
              >
                <span className="text-base">💬</span>
                <span>Ask a planning question</span>
              </a>
            </div>

            {/* Micro trust */}
            <p className="text-[11px] text-slate-400">
              No commissions · No product selling · Education-first planning
            </p>

            {/* STATUS STRIP */}
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="inline-flex w-full items-center gap-3 rounded-full bg-slate-900/80 px-4 py-2.5 text-[11px] text-slate-300 shadow-inner shadow-black/40 ring-1 ring-slate-700/60">
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                </span>
                <div className="flex flex-1 flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase text-slate-500">
                      Focus
                    </span>
                    <span className="text-[11px] text-slate-100">
                      SIPs · Long-term planning · Realistic numbers
                    </span>
                  </div>
                  <span className="hidden h-5 w-px bg-slate-700 md:block" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase text-slate-500">
                      Style
                    </span>
                    <span className="text-[11px] text-slate-100">
                      Jargon-free explanations, clean tools
                    </span>
                  </div>
                  <span className="hidden h-5 w-px bg-slate-700 md:block" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase text-slate-500">
                      Intent
                    </span>
                    <span className="text-[11px] text-slate-100">
                      Education only – you stay in control
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: SNAPSHOT / TRACKS */}
          <div className="rounded-3xl border border-slate-700/70 bg-linear-to-br from-slate-900/80 via-slate-950 to-slate-900/90 p-5 shadow-xl shadow-slate-950/60 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                  Planning overview
                </p>
                <p className="mt-1 text-sm font-medium text-slate-100">
                  What can you plan here?
                </p>
              </div>
              <span className="rounded-full bg-slate-900/80 px-2 py-1 text-[10px] text-slate-400 ring-1 ring-slate-700/70">
                No apps · No sales · Just numbers
              </span>
            </div>

            <div className="mt-4 grid gap-3 text-xs text-slate-200">
              {/* Investment journeys track */}
              <a
                href="/tools/sip"
                className="group flex items-center justify-between rounded-2xl bg-slate-900/70 px-3 py-2.5 ring-1 ring-slate-700/70 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:ring-emerald-400/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Investment journeys
                  </p>
                  <p className="mt-1 text-sm font-semibold text-emerald-300">
                    SIPs and long-term wealth
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Compare SIP vs lumpsum and see how compounding works.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg">📈</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-200 ring-1 ring-emerald-500/50">
                    Open SIP tools
                  </span>
                </div>
              </a>

              {/* Retirement track */}
              <a
                href="/tools/retirement"
                className="group flex items-center justify-between rounded-2xl bg-slate-900/70 px-3 py-2.5 ring-1 ring-slate-700/70 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:ring-sky-400/70 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Retirement thinking
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">
                    Corpus, inflation &amp; monthly need
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Estimate the lump sum and inflation-adjusted income.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg">🧓</span>
                  <span className="rounded-full bg-sky-500/15 px-2 py-1 text-[10px] font-medium text-sky-200 ring-1 ring-sky-500/50">
                    Open retirement tools
                  </span>
                </div>
              </a>

              {/* Life goals track */}
              <a
                href="/tools/goals"
                className="group flex items-center justify-between rounded-2xl bg-slate-900/70 px-3 py-2.5 ring-1 ring-slate-700/70 transition hover:-translate-y-0.5 hover:bg-slate-900 hover:ring-purple-400/70 hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Life goals
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-100">
                    Education, house, travel &amp; freedom
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    Map each goal to a realistic number and investment path.
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-lg">🎯</span>
                  <span className="rounded-full bg-purple-500/15 px-2 py-1 text-[10px] font-medium text-purple-200 ring-1 ring-purple-500/50">
                    Open goal planner
                  </span>
                </div>
              </a>
            </div>

            <p className="mt-4 text-[11px] text-slate-400">
              No sales. No apps to install. Just calm conversations around
              numbers and decisions that actually matter to you.
            </p>
          </div>
        </div>
      </div>

      {/* PLANNING LENSES */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Planning lenses
          </h2>
          <p className="text-[11px] text-slate-400">
            The same way a financial planner would break down your situation.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Investment lens */}
          <div className="group flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-slate-950/60 p-4 transition hover:-translate-y-1 hover:border-emerald-400 hover:bg-slate-950 hover:shadow-[0_0_35px_rgba(16,185,129,0.35)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Investment Planning
                </p>
                <p className="mt-2 text-[13px] text-slate-300">
                  SIP vs lumpsum, asset allocation, and how much to invest
                  monthly to stay on track.
                </p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-100">
                📈
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2 text-[11px]">
                <a
                  href="/tools/sip"
                  className="rounded-full bg-slate-900/80 px-3 py-1 text-emerald-200 ring-1 ring-emerald-500/60 hover:bg-emerald-500/20"
                >
                  SIP calculator
                </a>
                <a
                  href="/tools/lumpsum"
                  className="rounded-full bg-slate-900/80 px-3 py-1 text-emerald-200 ring-1 ring-emerald-500/60 hover:bg-emerald-500/20"
                >
                  Lumpsum calculator
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/tools/sip";
                }}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 shadow shadow-emerald-500/40 group-hover:bg-emerald-400"
              >
                Start with SIP
              </button>
            </div>
          </div>

          {/* Retirement lens */}
          <div className="group flex flex-col justify-between rounded-2xl border border-sky-500/30 bg-slate-950/60 p-4 transition hover:-translate-y-1 hover:border-sky-400 hover:bg-slate-950 hover:shadow-[0_0_35px_rgba(56,189,248,0.35)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Retirement Planning
                </p>
                <p className="mt-2 text-[13px] text-slate-300">
                  Estimate your retirement expenses, required corpus and how
                  early you need to start.
                </p>
              </div>
              <span className="rounded-full bg-sky-500/20 px-2 py-1 text-xs text-sky-100">
                🧓
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2 text-[11px]">
                <a
                  href="/tools/retirement"
                  className="rounded-full bg-slate-900/80 px-3 py-1 text-sky-200 ring-1 ring-sky-500/60 hover:bg-sky-500/20"
                >
                  Corpus planner
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/tools/retirement";
                }}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 shadow shadow-sky-500/40 group-hover:bg-sky-400"
              >
                Start retirement plan
              </button>
            </div>
          </div>

          {/* Goal-based lens */}
          <div className="group flex flex-col justify-between rounded-2xl border border-purple-500/30 bg-slate-950/60 p-4 transition hover:-translate-y-1 hover:border-purple-400 hover:bg-slate-950 hover:shadow-[0_0_35px_rgba(168,85,247,0.35)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-200">
                  Goal-Based Planning
                </p>
                <p className="mt-2 text-[13px] text-slate-300">
                  Map each goal – home, education, travel, freedom – to a
                  number and a realistic plan.
                </p>
              </div>
              <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-100">
                🎯
              </span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-2 text-[11px]">
                <a
                  href="/tools/goals"
                  className="rounded-full bg-slate-900/80 px-3 py-1 text-purple-200 ring-1 ring-purple-500/60 hover:bg-purple-500/20"
                >
                  Goal planner
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/tools/goals";
                }}
                className="mt-1 inline-flex items-center justify-center rounded-full bg-purple-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 shadow shadow-purple-500/40 group-hover:bg-purple-400"
              >
                Start goal plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SCENARIOS */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quick scenarios
          </h2>
          <p className="text-[11px] text-slate-400">
            Run a ready-made example in under 30 seconds.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[11px]">
          <a
            href="/tools/sip?monthly=10000&years=15&return=12"
            className="rounded-full bg-slate-900/80 px-3 py-1.5 text-slate-100 ring-1 ring-emerald-500/50 hover:bg-emerald-500/20"
          >
            SIP ₹10,000 · 15 years · 12% p.a.
          </a>
          <a
            href="/tools/lumpsum?amount=500000&years=10&rate=12"
            className="rounded-full bg-slate-900/80 px-3 py-1.5 text-slate-100 ring-1 ring-sky-500/50 hover:bg-sky-500/20"
          >
            Lumpsum ₹5,00,000 · 10 years · 12% p.a.
          </a>
          <a
            href="/tools/goals?goalType=education&cost=2000000&years=10"
            className="rounded-full bg-slate-900/80 px-3 py-1.5 text-slate-100 ring-1 ring-purple-500/50 hover:bg-purple-500/20"
          >
            Child education in 10 years
          </a>
          <a
            href="/tools/retirement?expense=60000&yearsTo=20&yearsAfter=25"
            className="rounded-full bg-slate-900/80 px-3 py-1.5 text-slate-100 ring-1 ring-amber-500/50 hover:bg-amber-500/20"
          >
            Retirement with ₹60,000/month
          </a>
        </div>
      </section>

      {/* SAVED / FUTURE PLANS (placeholder for now) */}
      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Saved &amp; recent plans
          </h2>
          <p className="text-[11px] text-slate-400">
            Later, this will keep your favourite combinations in one place.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4 text-[11px] text-slate-300">
          <p className="font-medium text-slate-100">
            You don&apos;t have any saved plans yet.
          </p>
          <p className="mt-1 text-slate-400">
            Start with a SIP, lumpsum, retirement or goal planner. In the
            future, you&apos;ll be able to pin and revisit your favourite
            scenarios from here.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="/tools/sip"
              className="rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-medium text-slate-950 shadow shadow-emerald-500/40 hover:bg-emerald-400"
            >
              Create a SIP plan
            </a>
            <a
              href="/tools/goals"
              className="rounded-full border border-slate-600 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-slate-300 hover:bg-slate-950"
            >
              Create a goal plan
            </a>
          </div>
        </div>
      </section>
    </section>
  );
}