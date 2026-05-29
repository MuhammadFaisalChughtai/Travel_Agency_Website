"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export function TransportBlogSection({ blogs }: { blogs: any[] }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const sectionBlogs = blogs.filter((post: any) => post.category === "Transport");

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, sectionBlogs.length));
  };

  const hasMore = visibleCount < sectionBlogs.length;

  if (sectionBlogs.length === 0) return null;

  return (
    <section className="py-16 bg-white border-t border-[#DFDE7D]/30" id="blog">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#DFDE7D]/20 border border-[#DFDE7D]/40 text-[#009F75] text-[10px] font-extrabold uppercase tracking-widest">
            Transport Guides & News
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#454E63] tracking-tight">
            Terrific Transport Journals
          </h2>
          <p className="text-xs md:text-sm text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
            Gain deep insights, tips, and guidelines for your local and international transport needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sectionBlogs.slice(0, visibleCount).map((post: any) => (
            <article 
              key={post.id} 
              className="bg-white rounded-3xl overflow-hidden border border-[#DFDE7D]/25 shadow-[0_10px_35px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_45px_rgba(72,52,52,0.06)] hover:border-[#009F75]/30 transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#009F75]/95 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#009F75]/70" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#009F75]/70" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-lg font-heading font-black text-[#454E63] leading-snug group-hover:text-[#009F75] transition-colors duration-300 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 font-light leading-relaxed line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <div className="border-t border-[#DFDE7D]/20 pt-4 mt-auto">
                  <Link 
                    href={`/blog/${post.slug}`} 
                    className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#009F75] group-hover:text-[#454E63] transition-colors duration-300 uppercase tracking-widest"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="mt-12 text-center">
            <button 
              onClick={handleLoadMore}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white border border-[#DFDE7D] text-[#009F75] font-bold text-xs hover:bg-[#fffcf9] hover:border-[#009F75]/50 hover:shadow-md transition-all duration-300 uppercase tracking-widest group"
            >
              Load More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
