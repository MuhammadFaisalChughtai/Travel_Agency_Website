import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";
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
          <div className="bg-[#fff8f0] rounded-3xl p-8 md:p-10 shadow-xl shadow-[#483434]/5 border border-[#eed6c4]/60">
            <h2 className="text-3xl font-black text-[#2a1a1a] mb-8 font-heading">
              Send us a message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-black tracking-wide uppercase leading-6 text-[#2a1a1a]"
                  >
                    First name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="first-name"
                      id="first-name"
                      className="block w-full rounded-xl border-0 py-3 text-[#2a1a1a] shadow-sm ring-1 ring-inset ring-[#eed6c4]/80 placeholder:text-[#6b4f4f]/50 focus:ring-2 focus:ring-inset focus:ring-[#6b4f4f] sm:text-sm sm:leading-6 px-4 bg-[#f5f0eb]/50"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-black tracking-wide uppercase leading-6 text-[#2a1a1a]"
                  >
                    Last name
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      name="last-name"
                      id="last-name"
                      className="block w-full rounded-xl border-0 py-3 text-[#2a1a1a] shadow-sm ring-1 ring-inset ring-[#eed6c4]/80 placeholder:text-[#6b4f4f]/50 focus:ring-2 focus:ring-inset focus:ring-[#6b4f4f] sm:text-sm sm:leading-6 px-4 bg-[#f5f0eb]/50"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-black tracking-wide uppercase leading-6 text-[#2a1a1a]"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-xl border-0 py-3 text-[#2a1a1a] shadow-sm ring-1 ring-inset ring-[#eed6c4]/80 placeholder:text-[#6b4f4f]/50 focus:ring-2 focus:ring-inset focus:ring-[#6b4f4f] sm:text-sm sm:leading-6 px-4 bg-[#f5f0eb]/50"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-black tracking-wide uppercase leading-6 text-[#2a1a1a]"
                >
                  Phone number
                </label>
                <div className="mt-2">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="block w-full rounded-xl border-0 py-3 text-[#2a1a1a] shadow-sm ring-1 ring-inset ring-[#eed6c4]/80 placeholder:text-[#6b4f4f]/50 focus:ring-2 focus:ring-inset focus:ring-[#6b4f4f] sm:text-sm sm:leading-6 px-4 bg-[#f5f0eb]/50"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-black tracking-wide uppercase leading-6 text-[#2a1a1a]"
                >
                  Message
                </label>
                <div className="mt-2">
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    className="block w-full rounded-xl border-0 py-3 text-[#2a1a1a] shadow-sm ring-1 ring-inset ring-[#eed6c4]/80 placeholder:text-[#6b4f4f]/50 focus:ring-2 focus:ring-inset focus:ring-[#6b4f4f] sm:text-sm sm:leading-6 px-4 bg-[#f5f0eb]/50 resize-none"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-md">
                Send Message
              </Button>
            </form>
          </div>

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
                      +44 1215 291630
                    </a>
                    <br />
                    <a
                      href="https://wa.me/441215291630"
                      className="hover:text-[#483434] transition-colors"
                    >
                      +44 1215 291630 (WhatsApp)
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
                <h4 className="font-black text-xl font-heading tracking-wide">ATOL Protected</h4>
                <p className="text-sm text-[#eed6c4]/80 mt-2 leading-relaxed">
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
