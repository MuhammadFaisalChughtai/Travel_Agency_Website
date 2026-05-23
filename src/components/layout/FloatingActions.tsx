"use client";

import { useState, useEffect } from "react";

export function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    // Show after 1.5s delay for smooth entry
    const t = setTimeout(() => setVisible(true), 1500);
    // Stop pulse animation after 6s
    const p = setTimeout(() => setPulse(false), 6000);
    return () => { clearTimeout(t); clearTimeout(p); };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-[998] flex flex-col items-start gap-3 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/441215291630?text=Hello%2C%20I%20am%20interested%20in%20your%20travel%20packages.%20Could%20you%20please%20help%20me%3F"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-3 cursor-pointer"
      >
        {/* Tooltip */}
        <span className="absolute left-16 whitespace-nowrap bg-[#382626] text-[#fff3e4] text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 pointer-events-none">
          Chat with us on WhatsApp
          <span className="absolute left-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#382626]" />
        </span>

        {/* Pulse ring */}
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-[#25d366] animate-ping opacity-40" />
        )}

        {/* Button */}
        <div className="relative w-14 h-14 rounded-full bg-[#25d366] hover:bg-[#20c05c] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_28px_rgba(37,211,102,0.6)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
          <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
          </svg>
        </div>
      </a>
    </div>
  );
}
