"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export function VisaBlogSection({ blogs }: { blogs: any[] }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const sectionBlogs = blogs.filter((post: any) => post.category === "Visa");

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, sectionBlogs.length));
  };

  const hasMore = visibleCount < sectionBlogs.length;

  if (sectionBlogs.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-[#d4af37]/30" id="blog">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#064e3b] text-[10px] font-extrabold uppercase tracking-widest">
            Visa Guides & News
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#064e3b] tracking-tight">
            Terrific Visa Journals
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
            Gain deep insights, tips, and official protocols to successfully
            apply for your travel visa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectionBlogs.slice(0, visibleCount).map((post: any) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#d4af37]/25 shadow-[0_10px_35px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_45px_rgba(72,52,52,0.06)] hover:border-[#064e3b]/30 transition-all duration-300 flex flex-col group hover:-translate-y-1 relative"
            >
              <a href={`/v/${post.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">Read Article</span>
              </a>
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#064e3b]/95 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#064e3b]/70" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#064e3b]/70" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-black text-[#064e3b] leading-snug group-hover:text-[#064e3b] transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="border-t border-[#d4af37]/20 pt-4 mt-auto">
                  <a
                    href={`/v/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#064e3b] group-hover:text-[#064e3b] transition-colors duration-300 uppercase tracking-widest relative z-20"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border border-[#d4af37] text-[#064e3b] font-bold text-xs hover:bg-[#fffcf9] hover:border-[#064e3b]/50 hover:shadow-md transition-all duration-300 uppercase tracking-widest group"
            >
              Load More{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
