"use client";

import React from 'react';
import Link from 'next/link';
import { foundations } from '../../../lib/content/epm/foundations';

export default function FoundationsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-16">
          <Link href="/blog/epm" className="text-emerald-400 text-sm hover:underline mb-4 inline-block">
            ← Back to Oracle EPM Journal
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            EPM <span className="text-emerald-500">Foundations</span>
          </h1>
          <p className="text-gray-400 mt-4 max-w-2xl text-lg border-l-2 border-gray-800 pl-6">
            Master the core architectural concepts of Oracle Essbase and FCCS. 
            Designed for aspiring Architects.
          </p>
        </div>

        {/* Improved Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {foundations.map((article) => (
            <Link
              href={`/blog/epm/foundations/${article.slug}`}
              key={article.slug}
              className="group relative flex flex-col p-8 rounded-3xl border border-gray-800/50 bg-gray-900/10 hover:bg-gray-900/30 transition-all duration-500 overflow-hidden"
            >
              {/* Corner Glow Effect */}
              <div 
                className="absolute -right-10 -top-10 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: article.color }}
              />

              {/* Category Badge - Glass Style */}
              <div className="mb-6">
                <span 
                  className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border"
                  style={{ 
                    color: article.color, 
                    backgroundColor: `${article.color}10`,
                    borderColor: `${article.color}30` 
                  }}
                >
                  {article.category}
                </span>
              </div>

              {/* Title with matching color */}
              <h2 className="text-2xl font-bold mb-4 group-hover:translate-x-1 transition-transform" style={{ color: article.color }}>
                {article.title}
              </h2>

              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">
                {article.summary}
              </p>

              {/* Interactive Footer */}
              <div className="flex items-center text-[10px] font-black tracking-widest text-gray-500 group-hover:text-white transition-colors">
                READ DEEP DIVE 
                <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}