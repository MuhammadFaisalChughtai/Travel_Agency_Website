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
            <span className="text-[#D4AF37] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">
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
            <p className="text-[#B8860B] leading-relaxed text-lg">
              Whether you're looking for the perfect family holiday, need
              assistance with your visa, or are planning your sacred Umrah or
              Hajj journey, our dedicated team of travel experts is ready to
              assist you.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D4AF37]">
                  <MapPin className="w-6 h-6 text-[#1A472A]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Office Location
                  </h3>
                  <p className="text-[#B8860B] font-medium leading-relaxed">
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
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D4AF37]">
                  <Phone className="w-6 h-6 text-[#1A472A]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Phone
                  </h3>
                  <p className="text-[#B8860B] font-medium leading-relaxed">
                    <a
                      href="tel:+441215291630"
                      className="hover:text-[#1A472A] transition-colors"
                    >
                      +44 1215 291630
                    </a>
                    <br />
                    <a
                      href="https://wa.me/441215291630"
                      className="hover:text-[#1A472A] transition-colors"
                    >
                      +44 1215 291630 (WhatsApp)
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D4AF37]">
                  <Mail className="w-6 h-6 text-[#1A472A]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Email
                  </h3>
                  <p className="text-[#B8860B] font-medium leading-relaxed">
                    <a
                      href="mailto:inquires@terrifictravel.co.uk"
                      className="hover:text-[#1A472A] transition-colors"
                    >
                      inquires@terrifictravel.co.uk
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-14 h-14 bg-[#D4AF37] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-[#D4AF37]">
                  <Clock className="w-6 h-6 text-[#1A472A]" />
                </div>
                <div>
                  <h3 className="font-black text-[#2a1a1a] text-lg mb-1 tracking-wide font-heading uppercase">
                    Working Hours
                  </h3>
                  <p className="text-[#B8860B] font-medium leading-relaxed">
                    Monday - Friday: 10:00 AM - 07:00 PM
                    <br />
                    Saturday: 10:00 AM - 05:00 PM
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#2a1a1a] to-[#1A472A] rounded-3xl p-8 mt-12 flex items-start gap-6 text-white shadow-xl">
              <ShieldCheck className="w-10 h-10 text-[#D4AF37] flex-shrink-0" />
              <div>
                <h4 className="font-black text-xl font-heading tracking-wide">ATOL Protected</h4>
                <p className="text-sm text-[#D4AF37]/80 mt-2 leading-relaxed">
                  Book with confidence. We are ATOL protected, ensuring your
                  financial security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
