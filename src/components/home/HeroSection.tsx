"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UmrahBookingForm } from "../umrah/UmrahBookingForm";
import { FlightBookingForm } from "../flights/FlightBookingForm";
import { VisaBookingForm } from "../visa/VisaBookingForm";
import { HolidaysBookingForm } from "../holiday/HolidaysBookingForm";
import { TransportBookingForm } from "../transport/TransportBookingForm";

const CAROUSEL_SLIDES = [
  {
    id: "flights",
    title: "Global Flight Deals",
    subtitle:
      "Seamless connections and exclusive fares to take you wherever your heart desires.",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    id: "holidays",
    title: "Premium Holiday Packages",
    subtitle:
      "Discover pristine beaches, bustling cities, and serene landscapes crafted just for you.",
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
  {
    id: "honeymoon",
    title: "Romantic Honeymoons",
    subtitle:
      "Begin your forever in the world's most romantic and breathtaking destinations.",
    image:
      "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },

  {
    id: "umrah",
    title: "Spiritual Umrah Journeys",
    subtitle:
      "Experience profound tranquility with our meticulously planned spiritual packages.",
    image:
      "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  },
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "flight" | "umrah" | "holidays" | "visa" | "transport"
  >("flight");

  // Auto-play interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % CAROUSEL_SLIDES.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveIndex((current) => (current + 1) % CAROUSEL_SLIDES.length);
  };

  const handlePrev = () => {
    setActiveIndex((current) =>
      current === 0 ? CAROUSEL_SLIDES.length - 1 : current - 1,
    );
  };

  const currentSlide = CAROUSEL_SLIDES[activeIndex];

  return (
    <div className="relative min-h-[90vh] sm:min-h-[95vh] flex flex-col items-center justify-start overflow-hidden bg-slate-100 group pt-32 pb-16">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.85, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${currentSlide.image}')` }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

      {/* Manual Navigation Arrows (Visible on Hover) */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Dynamic Text Content */}
        <div className="min-h-[120px] sm:min-h-[140px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={`title-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 font-heading"
            >
              <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                {currentSlide.title}
              </span>
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`subtitle-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base sm:text-lg text-white font-medium mb-8 max-w-2xl text-balance drop-shadow-md"
            >
              {currentSlide.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Dynamic Forms with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-5xl relative z-30 flex flex-col items-center mt-4"
        >
          {/* Tab Navigation */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl sm:rounded-full mb-4 border border-white/20 shadow-lg w-full max-w-3xl">
            <button
              onClick={() => setActiveTab("flight")}
              className={`px-1 py-2.5 sm:px-8 sm:py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
                activeTab === "flight"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Find Flight
            </button>
            <button
              onClick={() => setActiveTab("umrah")}
              className={`px-1 py-2.5 sm:px-8 sm:py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
                activeTab === "umrah"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Umrah Packages
            </button>
            <button
              onClick={() => setActiveTab("holidays")}
              className={`px-1 py-2.5 sm:px-8 sm:py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
                activeTab === "holidays"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Holiday Packages
            </button>
            <button
              onClick={() => setActiveTab("visa")}
              className={`px-1 py-2.5 sm:px-8 sm:py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
                activeTab === "visa"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Visa Inquiry
            </button>
            {/* <button
              onClick={() => setActiveTab("transport")}
              className={`px-1 py-2.5 sm:px-8 sm:py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 w-full sm:w-auto ${
                activeTab === "transport"
                  ? "bg-white text-slate-900 shadow-md"
                  : "text-white hover:bg-white/20"
              }`}
            >
              Transport
            </button> */}
          </div>

          <div className="hero__transparent w-full transition-all duration-500 overflow-hidden">
            {activeTab === "flight" && (
              <div className="w-full animate-in fade-in zoom-in-95 duration-300 relative z-30 rounded-3xl pb-8">
                <FlightBookingForm isHome={true} />
              </div>
            )}

            {activeTab === "umrah" && (
              <div className="w-full animate-in fade-in zoom-in-95 duration-300 relative z-30 rounded-3xl pb-8">
                <UmrahBookingForm isHome={true} />
              </div>
            )}

            {activeTab === "holidays" && (
              <div className="w-full animate-in fade-in zoom-in-95 duration-300 relative z-30 rounded-3xl pb-8">
                <HolidaysBookingForm isHome={true} />
              </div>
            )}
            {activeTab === "visa" && (
              <div className="w-full animate-in fade-in zoom-in-95 duration-300 relative z-30 rounded-3xl pb-8">
                <VisaBookingForm isHome={true} />
              </div>
            )}
            {/* {activeTab === "transport" && (
                <div className="w-full animate-in fade-in zoom-in-95 duration-300 relative z-30 rounded-3xl pb-8">
                  <TransportBookingForm isHome={true} />
                </div>
              )} */}
          </div>
        </motion.div>

        {/* Carousel Indicators */}
        <div className="mt-12 flex gap-3 z-20">
          {CAROUSEL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === activeIndex
                  ? "w-10 bg-secondary"
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
