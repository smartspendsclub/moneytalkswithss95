export default function ContactPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Ask Sai a money question
        </h1>
        <p className="max-w-2xl text-sm text-slate-300">
          Confused about SIP amounts, retirement numbers, or how to plan for a specific
          goal? Share your situation in simple language – I&apos;ll reply with educational
          guidance and how I&apos;d think about it as a planner.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-[3fr,2fr]">
        {/* Simple contact box */}
        <div className="rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 text-sm text-slate-200">
          <p className="text-[13px] text-slate-200">
            📧 Email:{' '}
            <a
              href="mailto:smartspendsclub@gmail.com"
              className="font-medium text-emerald-300 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-200 hover:decoration-emerald-300"
            >
              smartspendsclub@gmail.com
            </a>
          </p>
          <p className="mt-3 text-xs text-slate-300">
            You can write about:
          </p>
          <ul className="mt-2 space-y-1 text-xs text-slate-300">
            <li>• How much to invest via SIP for a specific goal</li>
            <li>• How to estimate a realistic retirement number</li>
            <li>• How to prioritise between multiple goals</li>
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            Please avoid sharing account numbers, PAN, Aadhaar or any sensitive banking
            details. Describe amounts and situations in approximate terms instead.
          </p>
        </div>

        {/* Expectations / disclaimer */}
        <div className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-4 text-[11px] text-slate-300">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
            What you can expect
          </p>
          <ul className="space-y-1.5">
            <li>• A calm, structured way to look at your question</li>
            <li>• A focus on numbers, time horizons and trade-offs</li>
            <li>• No product pitches, no urgency, no pressure</li>
          </ul>

          <p className="mt-3 text-[11px] uppercase tracking-[0.16em] text-slate-400">
            Important note
          </p>
          <p>
            I am currently a CFP aspirant. All communication from this site is for
            educational purposes only and should not be treated as personalised financial,
            investment, tax or legal advice.
          </p>
        </div>
      </div>
    </section>
  );
}
