import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Facebook,
  Instagram,
  PhoneCall,
  Compass,
} from "lucide-react";
import Image from "next/image";
import { TrustpilotWidget } from "./TrustpilotWidget";

const logoUrl =
  "https://terrifictravel.co.uk/wp-content/uploads/2025/07/TT-4.svg";

export function Footer() {
  return (
    <footer className="relative bg-[#eed6c4] text-[#483434] border-t border-[#6b4f4f]/25 overflow-hidden">
      {/* Decorative Travel Vectors (Mimics the high-end illustrative style of the reference image) */}
      <div className="absolute top-8 left-4 opacity-5 pointer-events-none hidden lg:block">
        <Compass className="w-24 h-24 text-[#6b4f4f] animate-[spin_60s_linear_infinite]" />
      </div>
      <div className="absolute bottom-12 right-6 opacity-5 pointer-events-none hidden lg:block">
        <svg
          width="120"
          height="120"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#6b4f4f]"
        >
          <path
            d="M10 80C30 50 60 90 90 60"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          <path
            d="M85 55L90 60L83 65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-0 pt-16 sm:pt-20 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12">
          {/* Column 1: Logo & About (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col">
            <Link href="/" className="flex items-center gap-2 self-start">
              <span className="sr-only">Terrific Travel Ltd Ltd</span>
              <Image
                src={logoUrl}
                alt="Terrific Travel Ltd"
                width={180}
                height={70}
                className="w-auto h-16 sm:h-20"
              />
            </Link>

            {/* Circular Social Buttons matching the screenshot */}
            <div className="flex gap-2.5">
              {[
                {
                  href: "https://www.facebook.com/TerrificTravelLTD?locale=nl_NL#",
                  label: "Facebook",
                  svg: (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M9 8H7v3h2v9h4v-9h3.6l.4-3H13V6c0-.5.5-1 1-1h3V1H13c-3 0-4 2-4 4v3z" />
                    </svg>
                  ),
                },
                {
                  href: "https://www.tiktok.com/@terrific.travel5",
                  label: "TikTok",
                  svg: (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.18 1.13 1.2 2.7 1.94 4.41 2.02v3.74c-1.78-.14-3.5-.83-4.83-2.05-.1-.09-.15-.09-.2 0-.3.72-.73 1.37-1.28 1.91-.07.07-.07.13-.03.21 1.25 1.92 1.34 4.4.22 6.42-1.07 1.98-3.18 3.32-5.46 3.51-2.42.22-4.9-.76-6.19-2.82-1.46-2.22-1.3-5.28.38-7.31 1.4-1.72 3.6-2.58 5.79-2.22V11c-1.3-.39-2.75-.02-3.7 1-.99 1-1.25 2.53-.66 3.8.58 1.27 1.9 2.05 3.3 2 1.43-.02 2.68-.96 3.06-2.35.15-.54.19-1.1.18-1.66V0h-.01z" />
                    </svg>
                  ),
                },
                {
                  href: "https://www.instagram.com/terrifictravelltd/",
                  label: "Instagram",
                  svg: (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  href: "https://wa.me/441215291630",
                  label: "WhatsApp",
                  svg: (
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.725-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.966a9.78 9.78 0 0 0-6.953-2.87C6.009 1.97 1.587 6.34 1.583 11.77c-.001 1.693.454 3.342 1.32 4.775l-.99 3.616 3.734-.972zm11.111-6.113c-.307-.154-1.817-.897-2.099-.999-.281-.103-.487-.154-.691.154-.204.307-.79 1-.968 1.205-.178.205-.357.23-.664.077-.307-.154-1.3-.48-2.477-1.53-.915-.817-1.533-1.826-1.712-2.133-.178-.307-.019-.474.135-.627.138-.138.307-.359.461-.538.154-.18.204-.307.307-.513.103-.205.051-.385-.026-.538-.077-.154-.691-1.667-.947-2.283-.25-.6-.525-.513-.717-.525-.184-.009-.395-.011-.607-.011-.212 0-.557.08-.85.399-.293.318-1.121 1.097-1.121 2.678 0 1.582 1.149 3.11 1.305 3.315.156.205 2.26 3.452 5.474 4.838.764.329 1.36.526 1.824.673.768.244 1.467.21 2.02.127.618-.093 1.817-.743 2.072-1.462.256-.718.256-1.334.18-1.462-.078-.128-.282-.204-.589-.358z" />
                    </svg>
                  ),
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white border border-[#483434]/25 text-[#6b4f4f] hover:bg-[#6b4f4f] hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-105"
                  aria-label={social.label}
                >
                  {social.svg}
                </a>
              ))}
            </div>

            <p className="text-xs leading-relaxed text-[#483434]/95 font-medium max-w-xs">
              Terrific Travel Ltd – Committed to making your journeys
              meaningful, safe, and unforgettable.
            </p>
            <TrustpilotWidget />
          </div>

          {/* Column 2: Useful Links (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs md:text-sm font-black tracking-wider uppercase text-[#6b4f4f] font-heading">
                Useful Links
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="h-[1.5px] w-8 bg-[#6b4f4f]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f]"></span>
                <span className="h-[1.5px] w-4 bg-[#6b4f4f]/30"></span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Destinations", href: "/holiday" },
                { label: "Tours", href: "/holiday" },
                { label: "Flight", href: "/flights" },
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold hover:text-[#6b4f4f] flex items-center gap-1 transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3 h-3 text-[#6b4f4f] group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Informative Links (lg:col-span-2.5) */}
          <div className="lg:col-span-2 md:col-span-1 lg:col-span-2.5 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs md:text-sm font-black tracking-wider uppercase text-[#6b4f4f] font-heading">
                Informative Links
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="h-[1.5px] w-8 bg-[#6b4f4f]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f]"></span>
                <span className="h-[1.5px] w-4 bg-[#6b4f4f]/30"></span>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                { label: "How To Perform Umrah?", href: "/v/step-by-step-guide-how-to-perform-umrah" },
                { label: "How To Book Rawada Appointment?", href: "/v/how-to-book-rawdah-appointment-nusuk-app" },
                {
                  label: "Understanding Ihram Rules",
                  href: "/v/understanding-nuances-ihram-rules",
                },
                {
                  label: "Places To Visit in Makkah and Madinah",
                  href: "/v/best-places-visit-makkah-madinah-ziyarat",
                },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold hover:text-[#6b4f4f] flex items-start gap-1 transition-colors duration-200 group leading-snug"
                  >
                    <ChevronRight className="w-3 h-3 text-[#6b4f4f] mt-0.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Umrah & Hajj Packages (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs md:text-sm font-black tracking-wider uppercase text-[#6b4f4f] font-heading">
                Umrah & Hajj Packages
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="h-[1.5px] w-8 bg-[#6b4f4f]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f]"></span>
                <span className="h-[1.5px] w-4 bg-[#6b4f4f]/30"></span>
              </div>
            </div>
            <ul className="space-y-2.5">
              {[
                { label: "Luxury Umrah Packages", href: "/v/7-nights-5-star-umrah" },
                { label: "Premium Umrah Packages", href: "/v/7-nights-4-star-umrah" },
                { label: "Family Umrah Packages", href: "/v/3-star-family-umrah" },
                { label: "Hajj Packages", href: "/v/vip-non-shifting-hajj-package" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-xs font-semibold hover:text-[#6b4f4f] flex items-center gap-1 transition-colors duration-200 group"
                  >
                    <ChevronRight className="w-3 h-3 text-[#6b4f4f] group-hover:translate-x-0.5 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Contact Us (lg:col-span-2.5) */}
          <div className="lg:col-span-2.5 space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xs md:text-sm font-black tracking-wider uppercase text-[#6b4f4f] font-heading">
                Contact Us
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="h-[1.5px] w-8 bg-[#6b4f4f]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#6b4f4f]"></span>
                <span className="h-[1.5px] w-4 bg-[#6b4f4f]/30"></span>
              </div>
            </div>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#6b4f4f] mt-0.5 shrink-0" />
                <span className="text-xs font-semibold leading-relaxed">
                  Office 1, 11 Walford Road, Birmingham, B11 1NP
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                <a
                  href="mailto:inquires@terrifictravel.co.uk"
                  className="text-xs font-semibold hover:underline"
                >
                  inquires@terrifictravel.co.uk
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#6b4f4f] shrink-0" />
                <a
                  href="tel:+441215291630"
                  className="text-xs font-semibold hover:underline"
                >
                  +441215291630
                </a>
              </li>
              <li className="flex items-center gap-4 pt-4 border-t border-[#483434]/15">
                <img 
                  src="/IATA.svg" 
                  alt="IATA Logo" 
                  className="h-8 w-auto object-contain mix-blend-multiply opacity-90"
                />
                <img 
                  src="/ATOL.svg" 
                  alt="ATOL Protected" 
                  className="h-10 w-auto object-contain mix-blend-multiply"
                />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Aligned Copyright Bottom Bar - With Developer Branding Removed */}
      <div className="bg-[#483434] text-[#fff3e4] py-4 text-center border-t border-[#6b4f4f]/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold">
          <p className="text-[#eed6c4]/80">
            Copyright &copy; {new Date().getFullYear()} Terrific Travel Ltd |
            All Rights Reserved By Terrific Travel Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}
