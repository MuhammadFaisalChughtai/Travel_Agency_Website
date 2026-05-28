"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useSiteConfig } from "@/components/SiteProvider";

const navigation = [
  { name: "Home", href: "/", id: "home" },
  { name: "Flights", href: "/flights", id: "flight" },
  { name: "Holiday", href: "/holiday", id: "holiday" },
  { name: "Umrah", href: "/umrah", id: "umrah" },
  { name: "Hajj", href: "/hajj", id: "hajj" },
  { name: "Visa", href: "/visa", id: "visa" },
  { name: "Transport", href: "/transport", id: "transport" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const siteConfig = useSiteConfig();

  const filteredNavigation = navigation.filter(
    (item) => item.id === "home" || siteConfig.allowedTabs.includes(item.id)
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#eed6c4]/40 shadow-sm transition-all duration-300">
        <nav
          className="flex items-center justify-between py-4 px-6 lg:px-8 max-w-7xl mx-auto"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link
              href="/"
              className="-m-1.5 p-1.5 flex items-center gap-2 group"
            >
              <span className="sr-only">Terrific Travel Ltd Ltd</span>
              <Image
                src={siteConfig.logoUrl}
                alt="Terrific Travel Ltd"
                width={150}
                height={50}
                className="w-auto h-12 sm:h-14 group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-[#483434] hover:bg-[#eed6c4]/30 transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-10">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-sm font-bold leading-6 text-[#483434] hover:text-[#6b4f4f] transition-colors duration-300 py-1 group"
              >
                {item.name}
                {/* Sleek animated bottom line hover effect */}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6b4f4f] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button
              asChild
              className="rounded-full gap-2 px-6 py-5 bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] border border-[#eed6c4]/40 hover:border-[#eed6c4] shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-extrabold text-xs tracking-wider uppercase"
            >
              <Link className="flex gap-2 items-center" href="/contact">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Contact Us</span>
              </Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-[60] bg-[#483434]/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 z-[60] w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-[#eed6c4]/40 border-l border-[#eed6c4]/50 shadow-2xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                <span className="sr-only">Terrific Travel Ltd Ltd</span>
                <Image
                  src={siteConfig.logoUrl}
                  alt="Terrific Travel Ltd"
                  width={120}
                  height={50}
                  className="w-auto h-12"
                />
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-xl p-2.5 text-[#483434] hover:bg-[#eed6c4]/30"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-[#eed6c4]/40">
                <div className="space-y-2 py-6">
                  {filteredNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-xl px-3 py-2 text-base font-bold leading-7 text-[#483434] hover:bg-[#eed6c4]/25 hover:text-[#6b4f4f] transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button
                    asChild
                    className="w-full rounded-full gap-2 bg-[#6b4f4f] hover:bg-[#483434] text-[#fff3e4] py-5 border border-[#eed6c4]/45 font-extrabold uppercase text-xs tracking-wider shadow-md transition-colors duration-300"
                  >
                    <Link
                      className="flex gap-3"
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Contact Us</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
