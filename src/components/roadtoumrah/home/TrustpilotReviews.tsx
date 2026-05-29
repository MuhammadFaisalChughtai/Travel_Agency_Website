"use client";

import { useEffect, useState, useRef } from "react";
import { ShieldCheck, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  text: string;
  tag: string;
}

interface TrustpilotData {
  stars: number;
  trustScore: number;
  numberOfReviews: number;
  reviews: Review[];
}

export function TrustpilotReviews() {
  const [data, setData] = useState<TrustpilotData | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load live Trustpilot reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <span
            key={`full-${i}`}
            className="w-5.5 h-5.5 bg-[#00b67a] text-white flex items-center justify-center text-[10px] font-black rounded-sm shadow-sm select-none"
          >
            ★
          </span>
        ))}
        {hasHalfStar && (
          <span
            key="half"
            className="w-5.5 h-5.5 bg-gradient-to-r from-[#00b67a] to-slate-200 text-white flex items-center justify-center text-[10px] font-black rounded-sm shadow-sm select-none"
          >
            ★
          </span>
        )}
        {[...Array(5 - Math.ceil(rating))].map((_, i) => (
          <span
            key={`empty-${i}`}
            className="w-5.5 h-5.5 bg-slate-200 text-slate-400 flex items-center justify-center text-[10px] font-black rounded-sm shadow-sm select-none"
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#F9FAFB]/30 to-white border-t border-[#d4af37]/45">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Trustpilot TrustBox Title */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 mb-2 bg-[#00b67a]/10 px-4 py-1.5 rounded-full border border-[#00b67a]/20">
            <span className="text-[#00b67a] text-[10px] font-extrabold uppercase tracking-[0.2em] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Customer Reviews
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-heading font-black text-[#064e3b] tracking-tight">
            Trusted by Thousands of Happy Customers
          </h2>
          <p className="text-slate-500 text-sm font-light mt-1">
            Flights · Holidays · Umrah · Hajj · Visas · Transport
          </p>
          <div className="h-[2px] w-12 bg-[#064e3b]/30 my-4 rounded-full"></div>

          {/* Dynamic Trustpilot Rating Badge */}
          <a
            href="https://uk.trustpilot.com/review/roadtoumrah.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-wrap items-center justify-center gap-4 mt-2 bg-white px-5 py-3 rounded-2xl border border-[#d4af37]/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-slate-800 font-extrabold text-sm group-hover:text-[#00b67a] transition-colors">
                Excellent {loading ? "4.5" : data?.trustScore}
              </span>
              {renderStars(loading ? 4.5 : data?.trustScore || 4.5)}
            </div>
            <p className="text-xs font-semibold text-slate-500">
              Based on{" "}
              <span className="text-[#00b67a] font-bold">
                {loading ? "29" : data?.numberOfReviews} reviews
              </span>{" "}
              on{" "}
              <span className="text-slate-800 font-black group-hover:underline">
                Trustpilot ★
              </span>
            </p>
          </a>
        </div>

        {/* Reviews Container */}
        {loading ? (
          /* Skeleton Loader */
          <div className="flex gap-6 overflow-hidden pb-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-full sm:w-[350px] shrink-0 bg-white rounded-3xl p-7 border border-[#d4af37]/45 shadow-[0_10px_30px_rgba(72,52,52,0.02)] animate-pulse"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-3 animate-pulse"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-3 w-full bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded-xl w-1/2 animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Reviews Carousel */
          <div className="relative group -mx-2 px-2">
            <button 
              onClick={scrollLeft}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-[#00b67a] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={scrollRight}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-600 hover:text-[#00b67a] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pt-2 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {data?.reviews.slice(0, 9).map((review) => (
                <div
                  key={review.id}
                  className="w-[85vw] sm:w-[360px] shrink-0 snap-center bg-white rounded-3xl p-7 border border-[#d4af37]/45 shadow-[0_10px_30px_rgba(72,52,52,0.02)] hover:shadow-[0_15px_40px_rgba(72,52,52,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                <div>
                  {/* Header: Rating & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 flex items-center justify-center text-[10px] font-black rounded-sm shadow-sm select-none text-white ${
                            i < review.rating ? "bg-[#00b67a]" : "bg-slate-200"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#064e3b] bg-[#d4af37]/20 px-2.5 py-1 rounded-md border border-[#d4af37]/10">
                      {review.tag}
                    </span>
                  </div>

                  {/* Title & Text */}
                  <h3 className="font-heading font-black text-[#064e3b] text-base mb-2.5 line-clamp-1">
                    {review.title ? `“${review.title}”` : "Verified Review"}
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed font-light mb-6 line-clamp-4 min-h-[5rem]">
                    {review.text || "No review description left."}
                  </p>
                </div>

                {/* Author & Verification */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                  <div>
                    <p className="text-xs font-black text-[#064e3b]">
                      {review.author}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className="text-[10px] text-slate-400 font-medium">
                        {review.location}
                      </p>
                      <span className="text-[9px] text-slate-300 font-light">
                        •
                      </span>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#00b67a] text-[10px] font-extrabold uppercase tracking-wider">
                    <CheckCircle className="w-3.5 h-3.5 fill-[#00b67a]/10" />
                    Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </section>
  );
}
