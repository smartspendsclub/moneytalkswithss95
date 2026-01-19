export default function AboutPage() {
  return (
    <section className="space-y-8 pt-8 md:pt-12">
      <header className="space-y-3">
        <p className="max-w-2xl text-sm text-slate-300">
          Money can feel overwhelming. This space is meant to make it feel calmer.
        </p>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50">
            Meet Sai
          </h1>
          <p className="text-sm text-slate-400">
            Behind MoneyTalks with SS
          </p>
        </div>

        <p className="max-w-2xl text-base leading-relaxed text-slate-300">
          I&apos;m{" "}
          <span className="font-medium text-slate-100">
            Sai Srinivas Guduru
          </span>
          , currently preparing for the CFP qualification. This space is my way of
          practising how a financial planner thinks – out in the open, with real tools
          you can use.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[3fr,2fr]">
        <div className="space-y-5 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-6 text-sm leading-relaxed text-slate-200">
          <p>
            I enjoy breaking complex financial ideas into calm, step-by-step decisions:
            how much to invest, for how long, and what that could realistically mean for
            your life. I don&apos;t sell products, I don&apos;t manage money — I focus on
            clarity.
          </p>

          <p>
            MoneyTalks with SS is a long-term project. As I move through my CFP journey,
            I&apos;ll keep adding new calculators, frameworks and guides that reflect how
            a professional planner analyses situations — but in language anyone can use.
          </p>

          <p>
            You&apos;re always welcome to ask questions, challenge assumptions or suggest
            tools you wish existed. This site will evolve with the questions you bring.
          </p>

          <p className="pt-3 text-slate-300">
            — <span className="font-medium text-slate-100">Sai</span>
            <br />
            <span className="text-xs text-slate-400">
              Creator, MoneyTalks with SS
            </span>
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-700/70 bg-slate-950/70 p-5 text-xs text-slate-300">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
              What I care about
            </p>
            <ul className="mt-3 space-y-2">
              <li>– Transparent assumptions in every calculation</li>
              <li>– Simple language, especially for beginners</li>
              <li>– Helping you ask better questions about money</li>
            </ul>
          </div>

          <div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-slate-400">
              What this site is not
            </p>
            <ul className="mt-3 space-y-2">
              <li>– Not a place to buy products</li>
              <li>– Not a substitute for personalised advice</li>
              <li>– Not here to scare or rush you into decisions</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
