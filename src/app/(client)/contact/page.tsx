import { MapPin, Phone, Mail, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Hero } from "@/components/ui/Hero";

export default function ContactPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Hero Banner */}
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Get In Touch"
        title={<>Contact <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">Our Experts</span></>}
        description="We are here to help you plan your next journey. Reach out to our experts today."
        showTrustpilot={false}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-slate-900">First name</label>
                  <div className="mt-2">
                    <input type="text" name="first-name" id="first-name" className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-slate-900">Last name</label>
                  <div className="mt-2">
                    <input type="text" name="last-name" id="last-name" className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">Email address</label>
                <div className="mt-2">
                  <input type="email" name="email" id="email" className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900">Phone number</label>
                <div className="mt-2">
                  <input type="tel" name="phone" id="phone" className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium leading-6 text-slate-900">Message</label>
                <div className="mt-2">
                  <textarea name="message" id="message" rows={4} className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 text-md">Send Message</Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 font-heading">Get in Touch</h2>
            <p className="text-slate-600 leading-7">
              Whether you're looking for the perfect family holiday, need assistance with your visa, or are planning your sacred Umrah or Hajj journey, our dedicated team of travel experts is ready to assist you.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Office Location</h3>
                  <p className="text-slate-600">123 Travel Street<br />London, UK SW1A 1AA</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Phone</h3>
                  <p className="text-slate-600">
                    <a href="tel:+441215291630" className="hover:text-primary transition-colors">+44 1215 291630</a>
                    <br />
                    <a href="https://wa.me/441215291630" className="hover:text-primary transition-colors">+44 1215 291630 (WhatsApp)</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Email</h3>
                  <p className="text-slate-600">
                    <a href="mailto:inquires@terrifictravel.co.uk" className="hover:text-primary transition-colors">inquires@terrifictravel.co.uk</a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg mb-1">Working Hours</h3>
                  <p className="text-slate-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 mt-8 flex items-start gap-4 text-white">
              <ShieldCheck className="w-8 h-8 text-secondary flex-shrink-0" />
              <div>
                <h4 className="font-bold font-heading">ATOL Protected</h4>
                <p className="text-sm text-slate-300 mt-1">Book with confidence. We are ATOL protected, ensuring your financial security.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
