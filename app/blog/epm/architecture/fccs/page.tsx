import Link from "next/link";
import { fccsArticles, categoryColorMap } from "@content/epm/fccs";

export default function FCCSCatalogPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#020617] to-[#020617]/90 text-white px-8 py-20">
      <div className="max-w-6xl mx-auto">

        <Link href="/blog/epm/architecture" className="text-sky-400 text-sm hover:underline">
          ← Back to Architecture
        </Link>

        <h1 className="text-5xl font-black mt-8 mb-14">
          FCCS <span className="text-sky-400">Architecture Library</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {fccsArticles.map((a) => {
            // Get the color based on the category
            const accentColor = categoryColorMap[a.category] || "#38bdf8";
            
            return (
              <Link
                key={a.slug} // Slug is now guaranteed unique
                href={`/blog/epm/architecture/fccs/${a.slug}`}
                className="group relative p-10 rounded-3xl border border-gray-800/60 bg-gray-900/10 hover:bg-gray-900/40 transition-all duration-500 overflow-hidden"
              >
                {/* Dynamic Glow Effect */}
                <div
                  className="absolute -top-20 -right-20 w-52 h-52 blur-[90px] opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: accentColor }}
                />

                <span className="text-[11px] tracking-[0.35em] font-black uppercase text-gray-500">
                  {a.category}
                </span>

                <h2 className="text-2xl font-extrabold mt-4 mb-4 group-hover:translate-x-1 transition-transform" style={{ color: accentColor }}>
                  {a.title}
                </h2>

                <p className="text-gray-400 text-sm leading-relaxed mb-8">
                  {a.summary}
                </p>

                <div className="text-[11px] font-black tracking-widest text-gray-500 group-hover:text-white">
                  READ ARTICLE →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}