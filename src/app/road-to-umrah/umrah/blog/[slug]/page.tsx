import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Tag, BookOpen } from "lucide-react";
import { getBlogBySlug, blogPostsData } from "@/lib/blogData";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export async function generateStaticParams() {
  return blogPostsData.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogBySlug(params.slug);
  if (!post) return { title: "Article Not Found | Road To Umrah" };
  return {
    title: `${post.title} | Road To Umrah Journals`,
    description: post.excerpt,
  };
}

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getBlogBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = blogPostsData
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero Banner */}
        <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/90 via-[#064e3b]/40 to-transparent" />

          {/* Breadcrumb + Meta */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-20 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-2 text-[#d4af37]/80 text-xs font-bold uppercase tracking-widest mb-4">
              <Link
                href="/umrah"
                className="hover:text-[#d4af37] transition-colors"
              >
                Umrah
              </Link>
              <span>/</span>
              <span>Journals</span>
              <span>/</span>
              <span className="text-[#d4af37]">{post.category}</span>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064e3b] text-white text-[9px] font-black uppercase tracking-wider mb-4">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-4 drop-shadow-md">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-[#d4af37]/90 text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Article Content */}
            <main className="lg:col-span-8">
              {/* Back Link */}
              <Link
                href="/umrah"
                className="inline-flex items-center gap-2 text-[#064e3b] text-xs font-extrabold uppercase tracking-widest mb-8 hover:text-[#064e3b] transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform duration-300" />
                Back to Umrah Journals
              </Link>

              {/* Article excerpt as lead */}
              <p className="text-lg font-medium text-[#064e3b] leading-relaxed mb-8 border-l-4 border-[#064e3b] pl-5 bg-[#d4af37]/10 py-4 pr-4 rounded-r-2xl">
                {post.excerpt}
              </p>

              {/* Full Article Content */}
              <div
                className="prose-article"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Divider */}
              <div className="mt-12 pt-8 border-t border-[#d4af37]/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#064e3b] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-[#064e3b] uppercase tracking-widest">
                      Road To Umrah Journals
                    </p>
                    <p className="text-xs text-slate-400 font-light mt-0.5">
                      UK-based IATA & ATOL accredited travel agency specialising
                      in Umrah & Hajj.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-10 p-6 rounded-3xl bg-[#064e3b] text-white flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="flex-grow">
                  <p className="text-xs font-black uppercase tracking-widest text-[#d4af37] mb-1">
                    Ready to Begin Your Journey?
                  </p>
                  <h3 className="text-xl font-heading font-black leading-tight">
                    Book Your Umrah Package with Road To Umrah
                  </h3>
                </div>
                <Link
                  href="/umrah"
                  className="shrink-0 px-6 py-3 rounded-full bg-[#064e3b] hover:bg-[#d4af37] hover:text-[#064e3b] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 whitespace-nowrap"
                >
                  View Packages
                </Link>
              </div>
            </main>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-24 space-y-8">
                {/* Article info card */}
                <div className="rounded-3xl border border-[#d4af37]/30 bg-[#d4af37]/10 p-6 space-y-4">
                  <h3 className="text-sm font-heading font-black text-[#064e3b] uppercase tracking-widest">
                    Article Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Tag className="w-4 h-4 text-[#064e3b]" />
                      <span className="font-medium">{post.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="w-4 h-4 text-[#064e3b]" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-4 h-4 text-[#064e3b]" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Related Articles */}
                <div>
                  <h3 className="text-sm font-heading font-black text-[#064e3b] uppercase tracking-widest mb-5">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.id}
                        href={`/umrah/blog/${related.slug}`}
                        className="group flex gap-3 items-start rounded-2xl p-3 border border-[#d4af37]/20 hover:border-[#064e3b]/40 hover:bg-[#d4af37]/10 transition-all duration-300"
                      >
                        <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-grow min-w-0">
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#064e3b]">
                            {related.category}
                          </span>
                          <p className="text-xs font-bold text-[#064e3b] leading-snug mt-0.5 group-hover:text-[#064e3b] transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <p className="text-[9px] text-slate-400 mt-1">
                            {related.readTime}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Contact */}
                <div className="rounded-3xl bg-[#064e3b] text-white p-6 space-y-3">
                  <h3 className="text-sm font-heading font-black uppercase tracking-widest text-[#d4af37]">
                    Need Help Planning?
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Our expert Umrah advisors are ready to assist you with
                    tailored packages and guidance.
                  </p>
                  <a
                    href="https://wa.me/441215291630"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-5 py-3 rounded-full bg-white text-[#064e3b] text-xs font-extrabold uppercase tracking-widest hover:bg-[#d4af37] transition-colors duration-300 mt-2"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      <Footer />

      {/* Inline styles for article prose */}
      <style>{`
        .prose-article h2 {
          font-size: 1.35rem;
          font-weight: 900;
          color: #064e3b;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }
        .prose-article h3 {
          font-size: 1.1rem;
          font-weight: 800;
          color: #064e3b;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose-article p {
          color: #374151;
          line-height: 1.8;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }
        .prose-article ul,
        .prose-article ol {
          padding-left: 1.4rem;
          margin-bottom: 1rem;
          color: #374151;
          font-size: 0.95rem;
          line-height: 1.9;
        }
        .prose-article li {
          margin-bottom: 0.35rem;
        }
        .prose-article strong {
          color: #064e3b;
          font-weight: 700;
        }
        .prose-article em {
          color: #064e3b;
          font-style: italic;
        }
      `}</style>
    </>
  );
}
