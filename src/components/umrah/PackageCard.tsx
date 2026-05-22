import Image from "next/image";
import Link from "next/link";
import { Star, Plane, Bus, FileText, Building2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PackageCardProps {
  title: string;
  image: string;
  stars: number;
  price: string;
  detailsUrl: string;
  isSold?: boolean;
}

export function PackageCard({ title, image, stars, price, detailsUrl, isSold = false }: PackageCardProps) {
  return (
    <div className="min-w-[280px] md:min-w-[300px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_10px_30px_rgba(72,52,52,0.04)] hover:shadow-[0_25px_50px_rgba(72,52,52,0.12)] hover:-translate-y-1.5 transition-all duration-500 border border-[#eed6c4]/40 hover:border-[#6b4f4f]/30 flex flex-col group relative overflow-hidden">
      {/* Dynamic Luxury Tag */}
      {isSold ? (
        <div className="absolute top-4 left-4 z-10 bg-red-600/90 text-[#fff3e4] px-3 py-1 rounded-full border border-red-500/35 shadow-sm flex items-center gap-1 backdrop-blur-sm">
          <span className="text-[8px] uppercase font-black tracking-widest leading-none">Sold Out</span>
        </div>
      ) : (
        <div className="absolute top-4 left-4 z-10 bg-[#eed6c4] px-3 py-1 rounded-full border border-white/20 shadow-sm flex items-center gap-1">
          <Star className="w-2.5 h-2.5 fill-[#6b4f4f] stroke-none" />
          <span className="text-[8px] uppercase text-[#6b4f4f] font-black tracking-widest leading-none">Featured</span>
        </div>
      )}

      <div className="relative h-44 w-full overflow-hidden bg-slate-200">
        <Image
          src={image}
          alt={title}
          fill
          className={`object-cover group-hover:scale-110 transition-transform duration-700 ${isSold ? 'grayscale opacity-60' : ''}`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Soft luxury shadow filter */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#6b4f4f]/35 via-transparent to-transparent" />
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Category Stars */}
        <div className="flex gap-0.5 mb-2 justify-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < stars ? 'text-[#6b4f4f] fill-[#6b4f4f]' : 'text-[#eed6c4]/40 fill-[#eed6c4]/20'}`}
            />
          ))}
        </div>

        <h4 className="font-heading font-black text-[#483434] text-base md:text-lg mb-2 text-center group-hover:text-[#6b4f4f] transition-colors duration-300 line-clamp-1">{title}</h4>

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
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#fff3e4] border border-[#eed6c4]/60 text-[#6b4f4f] text-[9px] font-black uppercase tracking-wider shadow-[0_1px_4px_rgba(107,79,79,0.06)]"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>

        {/* Modern Price Display */}
        <div className="flex items-center justify-between mt-auto pt-3 mb-4 border-t border-[#eed6c4]/40">
          <span className="text-[9px] text-[#6b4f4f]/70 font-black uppercase tracking-widest">{isSold ? "Fully Booked" : "All-Inclusive Deal"}</span>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 block leading-none font-bold">From</span>
            <span className="text-xl font-black text-[#483434] tracking-tight">{price}</span>
          </div>
        </div>

        {/* Parallel Modern Actions (Saves space and looks extremely high-end) */}
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 w-11 p-0 border-[#eed6c4] text-[#6b4f4f] hover:bg-[#fff3e4] hover:text-[#6b4f4f] hover:border-[#6b4f4f]/40 flex items-center justify-center rounded-2xl shrink-0 transition-all duration-300" asChild>
            <a href="tel:+441215291630" aria-label="Call Now">
              <PhoneCall className="w-4 h-4" />
            </a>
          </Button>
          <Button className={`flex-1 h-11 text-xs rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-extrabold tracking-widest uppercase border ${isSold ? 'bg-slate-500 hover:bg-slate-600 text-white border-slate-400/40' : 'bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] border-[#eed6c4]/30'}`} asChild>
            <Link href={detailsUrl}>
              {isSold ? "Enquire" : "View Details"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
