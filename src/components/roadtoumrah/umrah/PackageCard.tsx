import Image from "next/image";
import Link from "next/link";
import { Star, Plane, Bus, FileText, Building2, PhoneCall } from "lucide-react";

interface PackageCardProps {
  title: string;
  image: string;
  stars: number;
  price: string;
  detailsUrl: string;
  isSold?: boolean;
  travelDates?: string;
}

export function PackageCard({
  title,
  image,
  stars,
  price,
  detailsUrl,
  isSold = false,
  travelDates,
}: PackageCardProps) {
  const waMsg = encodeURIComponent(`Hello, I am interested in booking or enquiring about: "${title}". Could you please provide more details?`);
  const waUrl = `https://wa.me/447888461474?text=${waMsg}`;

  return (
    <div className="w-full sm:max-w-[360px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_rgba(72,52,52,0.04)] hover:shadow-[0_25px_50px_rgba(72,52,52,0.12)] hover:-translate-y-1.5 transition-all duration-500 border border-[#d4af37]/40 hover:border-[#064e3b]/30 flex flex-col group relative overflow-hidden h-full">
      {/* Dynamic Luxury Tag */}
      {isSold ? (
        <div className="absolute top-4 left-4 z-10 bg-red-600/90 text-[#F9FAFB] px-3 py-1 rounded-full border border-red-500/35 shadow-sm flex items-center gap-1 backdrop-blur-sm">
          <span className="text-[8px] uppercase font-black tracking-widest leading-none">
            Sold Out
          </span>
        </div>
      ) : (
        <div className="absolute top-4 left-4 z-10 bg-[#d4af37] px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-[#064e3b] stroke-none" />
          <span className="text-[8px] uppercase text-[#064e3b] font-black tracking-widest leading-none">
            Featured
          </span>
        </div>
      )}

      <div className="relative h-44 w-full overflow-hidden bg-slate-200 shrink-0">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover group-hover:scale-110 transition-transform duration-700 ${isSold ? "grayscale opacity-60" : ""}`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Soft luxury shadow filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#064e3b]/35 via-transparent to-transparent" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Category Stars */}
        <div className="flex gap-0.5 mb-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < stars ? "text-[#064e3b] fill-[#064e3b]" : "text-[#d4af37]/40 fill-[#d4af37]/20"}`}
            />
          ))}
        </div>

        <h4 className="font-heading font-black text-[#064e3b] text-base md:text-lg mb-2 text-center group-hover:text-[#064e3b] transition-colors duration-300 line-clamp-1">
          {title}
        </h4>

        {/* Travel Dates */}
        <div className="mb-3">
          <div className="bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-xl p-2 text-center">
            <span className="text-[9px] text-[#064e3b]/80 font-bold block mb-0.5 uppercase tracking-wider">Travel Dates</span>
            <span className="text-xs text-[#064e3b] font-black line-clamp-1 block text-center" title={travelDates || "Flexible departures throughout 2026/27"}>
              {travelDates || "Flexible departures throughout 2026/27"}
            </span>
          </div>
        </div>

        {/* Inclusion Pill Badges */}
        <div className="mb-4 flex items-center justify-center gap-1.5 flex-wrap">
          {[
            { icon: <Plane className="w-3 h-3" />, label: "Flights" },
            { icon: <Bus className="w-3 h-3" />, label: "Transport" },
            { icon: <Building2 className="w-3 h-3" />, label: "Hotel" },
            { icon: <FileText className="w-3 h-3" />, label: "Visa" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F9FAFB] border border-[#d4af37]/60 text-[#064e3b] text-[9px] font-black uppercase tracking-wider shadow-[0_1px_4px_rgba(107,79,79,0.06)]"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>

        {/* Modern Price Display */}
        <div className="flex items-center justify-between mt-auto pt-3 mb-4 border-t border-[#d4af37]/40">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] text-[#064e3b]/70 font-black uppercase tracking-widest">
              {isSold ? "Fully Booked" : "All-Inclusive Deal"}
            </span>
            <div className="flex flex-col border border-[#064e3b]/20 rounded overflow-hidden font-black uppercase shadow-sm shrink-0 w-max">
              <div className="bg-[#d4af37]/80 text-[#064e3b] px-1.5 py-[2px] text-[8px] text-center tracking-tight leading-none">Book Now,</div>
              <div className="bg-[#064e3b]/90 text-[#d4af37] px-1.5 py-[2px] text-[8px] text-center tracking-wider leading-none">Pay Later</div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block leading-none font-bold">
              From
            </span>
            <span className="text-xl font-black text-[#064e3b] tracking-tight">
              {price}
            </span>
          </div>
        </div>

        {/* Action Buttons: Phone Call, WhatsApp Logo, and View Details */}
        <div className="flex gap-2 items-center">
          <a
            href="tel:+441215291630"
            aria-label="Call Now"
            className="h-11 w-11 p-0 border border-[#d4af37] text-[#064e3b] hover:bg-[#F9FAFB] hover:text-[#064e3b] hover:border-[#064e3b]/40 flex items-center justify-center rounded-2xl shrink-0 transition-all duration-300"
          >
            <PhoneCall className="w-4 h-4" />
          </a>

          {/* WhatsApp Direct Chat Button with Official Logo */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="h-11 w-11 p-0 bg-[#25d366]/10 border border-[#25d366]/40 text-[#25d366] hover:bg-[#25d366] hover:text-white hover:border-[#25d366] flex items-center justify-center rounded-2xl shrink-0 transition-all duration-300 group/wa"
          >
            <svg className="w-5 h-5 fill-current transition-transform duration-300 group-hover/wa:scale-110" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
            </svg>
          </a>

          <Link href={detailsUrl} className="flex-1 flex">
            <button
              className={`w-full h-11 text-xs rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-extrabold tracking-widest uppercase border ${isSold ? "bg-slate-500 hover:bg-slate-600 text-white border-slate-400/40" : "bg-[#064e3b] hover:bg-[#064e3b] text-[#F9FAFB] border-[#d4af37]/30"}`}
            >
              {isSold ? "Enquire" : "View Details"}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
