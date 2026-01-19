export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-400">
        
        {/* Top section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="max-w-md space-y-2">
            <p className="text-sm font-medium text-slate-100">
              MoneyTalks with SS
            </p>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Calm, education-first financial planning tools — built to help you think
              clearly about money, goals and long-term decisions.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-[11px]">
            <a href="/" className="hover:text-slate-200">
              Home
            </a>
            <a href="/tools" className="hover:text-slate-200">
              Tools
            </a>
            <a href="/about" className="hover:text-slate-200">
              About
            </a>
            <a href="/contact" className="hover:text-slate-200">
              Contact
            </a>
            <a href="/privacy" className="hover:text-slate-200">
              Privacy
            </a>
            <a href="/terms" className="hover:text-slate-200">
              Terms
            </a>
          </nav>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/10" />

        {/* Bottom section */}
        <div className="space-y-2 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} MoneyTalks with SS. All rights reserved.
          </p>
          <p className="max-w-4xl leading-relaxed">
            Disclaimer: All content and tools on this website are for educational purposes
            only and do not constitute investment, tax or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
