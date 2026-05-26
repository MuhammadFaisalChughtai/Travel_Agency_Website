"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export function HomeBlogSection({
  blogsByCategory,
}: {
  blogsByCategory: Record<string, any[]>;
}) {
  const uniqueBlogs = React.useMemo(() => {
    const map = new Map();
    Object.values(blogsByCategory).forEach((arr) =>
      arr.forEach((b) => map.set(b.id, b)),
    );
    return Array.from(map.values());
  }, [blogsByCategory]);

  const [displayBlogs, setDisplayBlogs] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const shuffled = [...uniqueBlogs].sort(() => Math.random() - 0.5);
    setDisplayBlogs(shuffled);
    setIsMounted(true);
  }, [uniqueBlogs]);

  if (uniqueBlogs.length === 0) return null;

  const currentBlogs = (isMounted ? displayBlogs : uniqueBlogs).slice(
    0,
    visibleCount,
  );
  const hasMore = visibleCount < uniqueBlogs.length;

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12 flex flex-col items-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em]">
            Travel Journals
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#483434] tracking-tight">
            Latest Insights & Guides
          </h2>
          <p className="text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover expert tips, destination guides, and spiritual preparation
            protocols tailored just for you.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentBlogs.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#6b4f4f]/30 transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[#6b4f4f] text-[9px] font-black uppercase tracking-widest shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow space-y-4">
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#6b4f4f]" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#6b4f4f]" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-black text-slate-900 leading-snug group-hover:text-[#6b4f4f] transition-colors duration-300">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 font-light leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                <div className="border-t border-slate-100 pt-5">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#6b4f4f] group-hover:text-slate-900 transition-colors duration-300 uppercase tracking-widest"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 px-4 py-2 flex-1 h-11 text-xs rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-extrabold tracking-widest uppercase border bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] border-[#eed6c4]/30"
            >
              Load More <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
