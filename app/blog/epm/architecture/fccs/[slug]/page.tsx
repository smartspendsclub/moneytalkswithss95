// app/blog/epm/architecture/fccs/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { fccsArticles, categoryColorMap } from "@content/epm/fccs";

export default async function FCCSArticlePage({ params }: { params: any }) {
  const { slug } = await params; // Fixes potential async params issue
  const article = fccsArticles.find((a) => a.slug === slug);

  if (!article) return notFound();

  const accentColor = categoryColorMap[article.category] || "#38bdf8";

  return (
    <div className="min-h-screen bg-[#020617] text-gray-300">
      {/* Decorative background glow based on category color */}
      <div 
        className="fixed top-0 right-0 w-[600px] h-[600px] blur-[150px] opacity-[0.07] pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="max-w-4xl mx-auto px-8 py-20 relative z-10">
        
        <Link
          href="/blog/epm/architecture/fccs"
          className="inline-flex items-center text-sky-400 text-sm mb-12 hover:text-white transition-colors tracking-wide"
        >
          <span className="mr-2">←</span> BACK TO FCCS LIBRARY
        </Link>

        {/* Premium Header */}
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <span 
              className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ 
                color: accentColor, 
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}10` 
              }}
            >
              {article.category}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-8 tracking-tight">
            {article.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-3xl font-medium">
            {article.summary}
          </p>
        </header>

        {/* Styled Article Content */}
        <article
          className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
            prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6
            prose-h3:text-xl prose-h3:text-sky-400 prose-h3:mt-10
            prose-p:text-gray-400 prose-p:leading-[1.8] prose-p:mb-8
            prose-strong:text-white prose-strong:font-bold
            prose-ul:my-8 prose-li:mb-3 prose-li:text-gray-400
            prose-hr:border-gray-800 prose-hr:my-16"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Bottom Call to Action */}
        <div className="mt-32 pt-12 border-t border-gray-800/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-[0.3em] font-bold mb-4">Architecture Series</p>
              <h3 className="text-white text-2xl font-black">Ready to explore more?</h3>
            </div>
            <Link
              href="/blog/epm/architecture/fccs"
              className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:bg-sky-400 transition-colors"
            >
              View Full Library
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}