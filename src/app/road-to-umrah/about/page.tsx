import { Hero } from "@/components/roadtoumrah/Hero";
import { ShieldCheck, HeartHandshake, Globe, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Road To Umrah",
  description: "Learn more about Road To Umrah. We are a premier travel agency dedicated to providing unforgettable holidays, Umrah & Hajj packages.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Who We Are"
        title={<>About <span className="text-[#d4af37] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">Road To Umrah</span></>}
        description="Your trusted partner in creating unforgettable journeys and sacred pilgrimages across the globe."
        showTrustpilot={true}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="bg-white rounded-3xl shadow-2xl shadow-[#064e3b]/10 border border-[#d4af37]/30 p-8 md:p-12 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black text-[#064e3b] mb-6 font-heading">Our Mission</h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed mb-8">
              At Road To Umrah, our mission is to transform the way you experience the world. Whether you are embarking on a sacred Umrah or Hajj journey, planning a luxury family holiday, or arranging seamless business travel, we are dedicated to providing unparalleled service, complete financial protection, and unforgettable memories.
            </p>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              We believe that travel is more than just reaching a destination; it's about the journey, the culture, and the peace of mind knowing that every detail is handled by experts.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-[#064e3b] font-heading">Why Choose Us?</h2>
          <p className="text-slate-600 font-medium mt-4 max-w-2xl mx-auto">We combine years of industry expertise with a passion for excellence to deliver the best travel experiences.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl shadow-[#064e3b]/10 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#d4af37] border border-[#d4af37] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-[#064e3b]" />
            </div>
            <h3 className="font-black text-[#064e3b] text-xl mb-3 font-heading uppercase tracking-wide">ATOL Protected</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">Your financial security is our priority. Every flight-inclusive holiday is 100% ATOL protected.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl shadow-[#064e3b]/10 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#d4af37] border border-[#d4af37] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HeartHandshake className="w-8 h-8 text-[#064e3b]" />
            </div>
            <h3 className="font-black text-[#064e3b] text-xl mb-3 font-heading uppercase tracking-wide">Expert Guidance</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">Our seasoned travel consultants provide personalized advice tailored specifically to your needs.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl shadow-[#064e3b]/10 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#d4af37] border border-[#d4af37] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Globe className="w-8 h-8 text-[#064e3b]" />
            </div>
            <h3 className="font-black text-[#064e3b] text-xl mb-3 font-heading uppercase tracking-wide">Global Network</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">We partner with the world's leading airlines and hotels to offer you exclusive rates and upgrades.</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl shadow-[#064e3b]/10 text-center hover:-translate-y-1 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#d4af37] border border-[#d4af37] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-[#064e3b]" />
            </div>
            <h3 className="font-black text-[#064e3b] text-xl mb-3 font-heading uppercase tracking-wide">Premium Quality</h3>
            <p className="text-slate-600 font-medium text-sm leading-relaxed">We never compromise on quality. Expect 5-star service from the moment you book until you return.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
