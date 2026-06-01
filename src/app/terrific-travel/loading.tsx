import { Plane } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl transition-all duration-500 min-h-screen">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-[#eed6c4]/40 w-24 h-24 animate-[spin_3s_linear_infinite] m-auto" />
        
        {/* Inner spinning ring */}
        <div className="absolute rounded-full border-[3px] border-transparent border-t-[#6b4f4f] w-24 h-24 animate-[spin_1s_cubic-bezier(0.5,0,0.5,1)_infinite] m-auto" />
        
        {/* Center icon */}
        <div className="bg-[#fff3e4] rounded-full p-4 shadow-[0_0_20px_rgba(107,79,79,0.2)] animate-pulse relative z-10">
          <Plane className="w-8 h-8 text-[#6b4f4f] -rotate-45" />
        </div>
      </div>
      
      {/* Loading Text */}
      <div className="mt-12 flex flex-col items-center relative z-10">
        <h3 className="text-xl font-extrabold tracking-[0.2em] text-[#483434] uppercase">Terrific Travel</h3>
        <div className="flex items-center gap-1 mt-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f] animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f] animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f] animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
