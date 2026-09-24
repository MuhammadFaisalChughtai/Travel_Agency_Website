import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { Hero } from "@/components/ui/Hero";
import { ContactForm } from "@/components/contact/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Terrific Travel Ltd",
  description:
    "Get in touch with Terrific Travel Ltd for Umrah, Hajj, holidays, flights, and visa assistance. Call us, WhatsApp us, or visit our London office.",
  openGraph: {
    title: "Contact Us | Terrific Travel Ltd",
    description:
      "Get in touch with Terrific Travel Ltd for Umrah, Hajj, holidays, flights, and visa assistance. Call us, WhatsApp us, or visit our London office.",
    url: "https://terrifictravel.co.uk/contact",
  },
  twitter: {
    title: "Contact Us | Terrific Travel Ltd",
    description:
      "Get in touch with Terrific Travel Ltd for Umrah, Hajj, holidays, flights, and visa assistance. Call us, WhatsApp us, or visit our London office.",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#f5f0eb] min-h-screen pb-24">
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Get In Touch"
        title={
          <>
            Contact{" "}
            <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
              Our Experts
            </span>
          </>
        }
        description="We are here to help you plan your next journey. Reach out to our experts today."
        showTrustpilot={false}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Info */}
          <div className="space-y-10">
            <h2 className="text-3xl font-black text-[#2a1a1a] mb-6 font-heading">
              Get in Touch
            </h2>
            <p className="text-[#6b4f4f] leading-relaxed text-lg">
              Whether you're looking for the perfect family holiday, need
              assistance with your visa, or are planning your sacred Umrah or
              Hajj journey, our dedicated team of travel experts is ready to
              assist you.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#eed6c4] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#eed6c4]">
                  <MapPin className="w-6 h-6 text-[#483434]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Office Location
                  </h3>
                  <p className="text-[#6b4f4f] font-medium leading-relaxed">
                    <a 
                      target="_blank" 
                      rel="nofollow noreferrer" 
                      href="https://www.google.com/maps/place/Office+1,+11+Walford+Rd,+Sparkbrook,+Birmingham+B11+1NP,+UK/@52.4588429,-1.8714984,17z/data=!3m1!4b1!4m6!3m5!1s0x4870bb8e7a1aaaab:0x86292dcc415d08e6!8m2!3d52.4588429!4d-1.8689235!16s%2Fg%2F11xfdxrvnv?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D"
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      Office 1, 11 Walford Road, Birmingham, B11 1NP
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#eed6c4] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#eed6c4]">
                  <Phone className="w-6 h-6 text-[#483434]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Phone
                  </h3>
                  <p className="text-[#6b4f4f] font-medium leading-relaxed">
                    <a
                      href="tel:+441215291630"
                      className="hover:text-[#483434] transition-colors"
                    >
                      +44 1215 291630 (Office)
                    </a>
                    <br />
                    <a
                      href="https://wa.me/447888461474"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#483434] transition-colors font-semibold"
                    >
                      07888 461474 (WhatsApp)
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#eed6c4] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#eed6c4]">
                  <Mail className="w-6 h-6 text-[#483434]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Email
                  </h3>
                  <p className="text-[#6b4f4f] font-medium leading-relaxed">
                    <a
                      href="mailto:inquires@terrifictravel.co.uk"
                      className="hover:text-[#483434] transition-colors"
                    >
                      inquires@terrifictravel.co.uk
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#eed6c4] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#eed6c4]">
                  <Clock className="w-6 h-6 text-[#483434]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Working Hours
                  </h3>
                  <p className="text-[#6b4f4f] font-medium leading-relaxed">
                    Monday - Friday: 10:00 AM - 07:00 PM
                    <br />
                    Saturday: 10:00 AM - 05:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#2a1a1a] to-[#483434] rounded-3xl p-8 mt-12 flex items-start gap-6 text-white shadow-xl">
              <ShieldCheck className="w-10 h-10 text-[#eed6c4] flex-shrink-0" />
              <div>
                <h4 className="font-black text-xl font-heading tracking-wide">ATOL & IATA Protected Travel</h4>
                <p className="text-sm text-[#eed6c4]/80 mt-2 leading-relaxed">
                  Book your pilgrimage and holidays with complete peace of mind. Terrific Travel Ltd is fully accredited with ATOL protection and IATA flight licensing, ensuring 100% financial security and 24/7 passenger assistance for all bookings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Frequently Asked Questions & Travel Assistance Section ─── */}
        <div className="mt-20 border-t border-[#eed6c4]/40 pt-16 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#eed6c4]/30 text-[#483434] text-[10px] font-black uppercase tracking-[0.2em]">
              Support & Guidelines
            </span>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-[#2a1a1a]">
              Frequently Asked Contact Questions
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Find instant answers regarding response times, custom itineraries, visa documentation, and emergency support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-[#eed6c4]/40 shadow-xs space-y-2">
              <h3 className="font-heading font-black text-[#483434] text-base">How fast do you respond to quotes?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our travel consultants review online quote requests continuously. You will receive a tailored itinerary with transparent pricing within 24 hours of submission.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#eed6c4]/40 shadow-xs space-y-2">
              <h3 className="font-heading font-black text-[#483434] text-base">Can I visit your office in person?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Yes! We welcome walk-in customers and scheduled appointments at our Birmingham branch on Walford Road. Meet our team to discuss customized Umrah packages or complex multi-city flights.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#eed6c4]/40 shadow-xs space-y-2">
              <h3 className="font-heading font-black text-[#483434] text-base">What emergency support is available?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For travellers currently abroad, our 24/7 WhatsApp hotline (+44 7888 461474 / 07888 461474) offers instant assistance for flight delays, hotel check-in queries, or transport coordination in Makkah and Madinah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
