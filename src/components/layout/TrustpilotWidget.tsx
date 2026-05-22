"use client";

export function TrustpilotWidget() {
  return (
    <a
      href="https://uk.trustpilot.com/review/terrifictravel.co.uk"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-start justify-center py-2 cursor-pointer"
    >
      <div className="flex items-center gap-1.5 justify-center mb-1 bg-white/40 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/60 transition-all duration-300">
        <span className="text-xs font-bold text-slate-800 tracking-tight">4.5 Rating</span>
        <div className="flex gap-0.5">
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="w-4 h-4 bg-[#00b67a] text-white flex items-center justify-center text-[10px] font-black rounded-sm shadow-sm select-none"
            >
              ★
            </span>
          ))}
          {/* Half star for 4.5 rating */}
          <span className="w-4 h-4 bg-gradient-to-r from-[#00b67a] to-slate-200 text-white flex items-center justify-center text-[10px] font-black rounded-sm shadow-sm select-none">
            ★
          </span>
        </div>
      </div>
      <p className="text-[9px] text-[#483434]/70 font-bold uppercase tracking-widest pl-1">
        Review us on <span className="text-[#00b67a] font-black group-hover:underline">Trustpilot</span>
      </p>
    </a>
  );
}
