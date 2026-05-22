import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Hero } from "@/components/ui/Hero";

export const metadata = {
  title: "Travel Blogs & Guides | Terrific Travel Ltd",
  description:
    "Read our latest insights, travel hacks, destination guides, and spiritual preparation for Umrah & Hajj.",
};

export default async function BlogIndexPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Group blogs by category
  const categories = Array.from(new Set(blogs.map((b: any) => b.category)));

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Hero */}
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1512453979436-5a50c8115191?auto=format&fit=crop&w=2000&q=80"
        badgeText="Official Blog"
        title={
          <>
            Terrific{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Journals
            </span>
          </>
        }
        description="Expert insights, spiritual guidance, and the ultimate hacks for navigating the globe."
        showTrustpilot={false}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 space-y-24">
        {categories.map((category) => {
          const categoryBlogs = blogs.filter(
            (b: any) => b.category === category,
          );

          return (
            <section key={category}>
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4 mb-10">
                <h2 className="text-3xl font-heading font-black text-slate-900">
                  {category}
                </h2>
                <span className="text-sm font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">
                  {categoryBlogs.length} Articles
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryBlogs.map((post: any) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#6b4f4f]/30 transition-all duration-300 flex flex-col group hover:-translate-y-1"
                  >
                    <div className="relative h-52 w-full overflow-hidden">
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

                    <div className="p-6 flex flex-col flex-grow space-y-4">
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

                      <h3 className="text-lg font-heading font-black text-slate-900 leading-snug group-hover:text-[#6b4f4f] transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-sm text-slate-500 font-light leading-relaxed flex-grow">
                        {post.excerpt}
                      </p>

                      <div className="border-t border-slate-100 pt-4">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#6b4f4f] group-hover:text-slate-900 transition-colors duration-300 uppercase tracking-widest"
                        >
                          <span>Read Article</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
