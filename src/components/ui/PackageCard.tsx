import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Plane, Bus, Building2, FileText } from "lucide-react";
import { Button } from "./Button";

interface PackageCardProps {
  id: string;
  slug?: string;
  title: string;
  destination: string;
  duration: string;
  price: number;
  imageUrl: string;
  type: string;
  isSold?: boolean;
}

export function PackageCard({
  id,
  slug,
  title,
  destination,
  duration,
  price,
  imageUrl,
  type,
  isSold = false,
}: PackageCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="aspect-[4/3] w-full bg-slate-100 relative overflow-hidden">
        {/* Placeholder image logic, since we don't have actual DB images yet */}
        <div
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 ${isSold ? 'grayscale opacity-60' : ''}`}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-primary rounded-full shadow-sm">
            {type}
          </span>
          {isSold && (
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              Sold Out
            </span>
          )}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold font-heading text-slate-900 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-4 text-slate-600 text-sm mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{destination}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{duration}</span>
          </div>
        </div>
        {/* Inclusion Pill Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          {[
            { icon: <Plane className="w-3 h-3" />, label: "Flights" },
            { icon: <Bus className="w-3 h-3" />, label: "Transport" },
            { icon: <Building2 className="w-3 h-3" />, label: "Hotel" },
            { icon: <FileText className="w-3 h-3" />, label: "Visa" },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-wider"
            >
              {icon}
              {label}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-500 font-medium">From</p>
            <p className="text-2xl font-bold text-primary">£{price}</p>
          </div>
          <Button asChild variant={isSold ? "secondary" : "outline"} className="rounded-full">
            <Link href={`/v/${slug || id}`}>
              {isSold ? "Enquire" : "View Details"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
