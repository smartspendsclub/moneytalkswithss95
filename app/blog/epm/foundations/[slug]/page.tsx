"use client";

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { foundations } from "../../../../lib/content/epm/foundations";

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const article = foundations.find((a) => a.slug === slug);

  if (!article) return notFound();

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 selection:bg-emerald-500/30">
      {/* HERO SECTION */}
      <div className="relative border-b border-gray-800 bg-gray-900/10 py-20 px-8 overflow-hidden">
        {/* Background Glow */}
        <div 
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 blur-[120px] rounded-full"
          style={{ backgroundColor: article.color }}
        />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blog/epm/foundations" className="group text-emerald-400 text-sm mb-8 inline-flex items-center gap-2 transition-all">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Foundations
          </Link>
          <div className="flex items-center gap-3 mb-6">
             <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full border"
                   style={{ backgroundColor: `${article.color}10`, color: article.color, borderColor: `${article.color}30` }}>
               {article.category}
             </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* ARTICLE CONTENT */}
      <main className="max-w-4xl mx-auto py-16 px-8">
        <article className="max-w-none">
          <div className="space-y-6 text-lg leading-relaxed text-gray-400">
            <div className="foundation-content">
               {article.content.split('\n').map((line, index) => {
                 const trimmedLine = line.trim();
                 
                 // 1. Handle Headings (###)
                 if (trimmedLine.startsWith('###')) {
                   return (
                     <h3 key={index} 
                         className="text-2xl font-bold mt-16 mb-6 pb-2 border-b border-gray-800/50"
                         style={{ color: article.color }}>
                       {trimmedLine.replace('###', '').trim()}
                     </h3>
                   );
                 }

                 // 2. Handle THE TUTOR BOX (Pro-Tips)
                 if (trimmedLine.toLowerCase().includes("tutor's pro-tip") || trimmedLine.toLowerCase().includes("architect's secret")) {
                    return (
                        <div key={index} className="my-10 p-6 rounded-xl border-l-4 bg-gray-900/40 backdrop-blur-sm"
                             style={{ borderColor: article.color, backgroundColor: `${article.color}05` }}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">💡</span>
                                <span className="font-black uppercase tracking-widest text-xs" style={{ color: article.color }}>
                                    Expert Insight
                                </span>
                            </div>
                            <p className="text-white font-medium italic leading-relaxed">
                                {trimmedLine}
                            </p>
                        </div>
                    );
                 }

                 // 3. Handle Dividers (---)
                 if (trimmedLine === '---') {
                   return <hr key={index} className="my-16 border-gray-800 opacity-20" />;
                 }

                 // 4. Handle Bold Text (Manual replacement for **text**)
                 if (trimmedLine.includes('**')) {
                    const parts = trimmedLine.split(/(\*\*.*?\*\*)/g);
                    return (
                        <p key={index} className="mb-4">
                            {parts.map((part, i) => 
                                part.startsWith('**') && part.endsWith('**') 
                                ? <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong> 
                                : part
                            )}
                        </p>
                    );
                 }

                 // 5. Handle Image Placeholders
                 if (trimmedLine.includes('[Image of')) {
                    return (
                        <div key={index} className="my-12 flex flex-col items-center group">
                            <div className="w-full aspect-video border border-gray-800 rounded-2xl flex items-center justify-center bg-gray-900/20 group-hover:bg-gray-900/40 transition-colors">
                                <span className="text-gray-600 text-sm font-mono tracking-tighter uppercase">{trimmedLine}</span>
                            </div>
                            <p className="mt-4 text-xs text-gray-500 italic">Visualizing the concept of {article.title}</p>
                        </div>
                    );
                 }

                 // Default Paragraph
                 if (trimmedLine === "") return <div key={index} className="h-4" />;
                 return <p key={index} className="mb-4">{trimmedLine}</p>;
               })}
            </div>
          </div>
        </article>

        {/* RE-USABLE FOOTER */}
        <div className="mt-32 p-10 rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-transparent flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-2xl mb-2">Ready for the next lesson?</h4>
            <p className="text-gray-500">Continue your journey toward becoming an EPM Architect.</p>
          </div>
          <Link href="/blog/epm/foundations" className="whitespace-nowrap px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
            Back to Catalog
          </Link>
        </div>
      </main>
    </div>
  );
}