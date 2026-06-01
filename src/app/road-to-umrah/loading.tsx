import { Compass } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl transition-all duration-500 min-h-screen">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-[#d4af37]/20 w-24 h-24 animate-[spin_3s_linear_infinite] m-auto" />
        
        {/* Inner spinning ring */}
        <div className="absolute rounded-full border-[3px] border-transparent border-t-[#d4af37] w-24 h-24 animate-[spin_1s_cubic-bezier(0.5,0,0.5,1)_infinite] m-auto" />
        
        {/* Center icon */}
        <div className="bg-[#064e3b] rounded-full p-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] animate-pulse relative z-10">
          <Compass className="w-8 h-8 text-[#d4af37] animate-[spin_4s_linear_infinite]" />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-12 flex flex-col items-center relative z-10">
        <h3 className="text-xl font-extrabold tracking-[0.2em] text-[#064e3b] uppercase">Road To Umrah</h3>
        <div className="flex items-center gap-1 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
