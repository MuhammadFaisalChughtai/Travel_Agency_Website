"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function UmrahBlogSection({ blogs }: { blogs: any[] }) {
  const [visibleCount, setVisibleCount] = useState(3);
  const umrahBlogs = blogs.filter((post: any) => post.category.includes("Umrah") || post.category.includes("Hajj"));

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, umrahBlogs.length));
  };

  const hasMore = visibleCount < umrahBlogs.length;

  return (
    <section className="py-16 bg-white border-t border-[#eed6c4]/30" id="blog">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/20 border border-[#eed6c4]/40 text-[#6b4f4f] text-[10px] font-extrabold uppercase tracking-widest">
            Spiritual Guides & News
          </span>
          <h2 className="text-2xl md:text-3xl font-heading font-black text-[#483434] tracking-tight">
            Terrific Umrah & Hajj Journals
          </h2>
          <p className="text-xs md:text-sm text-[#f5f0eb]0 font-light max-w-xl mx-auto leading-relaxed">
            Gain deep insights, tips, and official protocols to prepare mentally, physically, and spiritually for your sacred pilgrimage.
          </p>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {umrahBlogs.slice(0, visibleCount).map((post: any) => (
            <article 
              key={post.id} 
              className="bg-white rounded-3xl overflow-hidden border border-[#eed6c4]/25 shadow-[0_10px_35px_rgba(72,52,52,0.03)] hover:shadow-[0_15px_45px_rgba(72,52,52,0.06)] hover:border-[#6b4f4f]/30 transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[#6b4f4f] text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow space-y-4">
                {/* Meta details */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#6b4f4f]/60" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#6b4f4f]/60" />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-heading font-black text-[#483434] leading-snug group-hover:text-[#6b4f4f] transition-colors duration-300">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-[#f5f0eb]0 font-light leading-relaxed flex-grow">
                  {post.excerpt}
                </p>

                {/* Divider Line */}
                <div className="border-t border-[#eed6c4]/30 pt-4">
                  <Link 
                    href={`/v/${post.slug}`} 
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#6b4f4f] group-hover:text-[#483434] transition-colors duration-300 uppercase tracking-widest"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <Button
              onClick={handleLoadMore}
              className="rounded-full gap-2 px-8 py-6 bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] border border-[#eed6c4]/45 font-extrabold uppercase text-xs tracking-wider shadow-md hover:shadow-lg transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              <span>Load More Articles</span>
            </Button>
          </div>
        )}

      </div>
    </section>
  );
}
