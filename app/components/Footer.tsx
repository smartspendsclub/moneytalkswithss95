export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} MoneyTalks with SS. All rights reserved.</p>
        <p className="max-w-xl text-[11px] leading-relaxed">
          Disclaimer: All content and tools on this website are for educational purposes only
          and do not constitute investment, tax or legal advice.
        </p>
      </div>
    </footer>
  );
}
