import { Hero } from "@/components/roadtoumrah/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Road To Umrah",
  description: "Terms and conditions for booking with Road To Umrah.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-[#f5f0eb] min-h-screen pb-24">
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Legal"
        title={<>Terms and <span className="text-[#d4af37] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">Conditions</span></>}
        description="Please read these terms and conditions carefully before booking."
        showTrustpilot={false}
      />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
        <div className="bg-[#fff8f0] rounded-3xl shadow-xl shadow-[#064e3b]/5 border border-[#d4af37]/60 p-8 md:p-12">
          <article className="prose max-w-none">
            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 tracking-wide uppercase">1. Booking Contract</h2>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              When you make a booking with Road To Umrah, you guarantee that you have the authority to accept and do accept on behalf of your party the terms of these booking conditions. A contract will exist as soon as we issue our confirmation invoice. This contract is made on the terms of these booking conditions, which are governed by English Law, and the jurisdiction of the English Courts.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">2. Financial Protection (ATOL)</h2>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              We provide full financial protection for our package holidays and flights. When you buy an ATOL protected flight or flight inclusive holiday from us you will receive an ATOL Certificate. This lists what is financially protected, where you can get information on what this means for you and who to contact if things go wrong.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">3. Prices and Payment</h2>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              We reserve the right to alter the prices of any of the holidays shown on our website. You will be advised of the current price of the holiday that you wish to book before your contract is confirmed. A deposit is required at the time of booking. The balance of the price of your travel arrangements must be paid by the date specified on your confirmation invoice.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">4. Cancellations and Changes by You</h2>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              If you or any member of your party wishes to cancel your travel arrangements, the lead name on the booking must notify us in writing. Since we incur costs in cancelling your travel arrangements, you will have to pay cancellation charges as detailed in your booking confirmation.
            </p>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              If you wish to change any part of your booking after our confirmation invoice has been issued, we will do our best to make the change, but it may not always be possible. Any request for changes must be made in writing by the lead passenger.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">5. Passports, Visas, and Health</h2>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              It is your responsibility to check and fulfill the passport, visa, health and immigration requirements applicable to your itinerary. We can only provide general information about this. You must check requirements for your own specific circumstances with the relevant Embassies and/or Consulates and your own doctor as applicable.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">6. Travel Insurance</h2>
            <p className="text-[#064e3b] font-medium leading-relaxed mb-6">
              Adequate travel insurance is a condition of your contract with us. You must be satisfied that your insurance fully covers all your personal requirements including pre-existing medical conditions, cancellation charges, medical expenses and repatriation in the event of accident or illness.
            </p>

            <p className="text-[#2a1a1a] mt-8 font-bold">
              If you require further clarification regarding these Terms and Conditions, please contact us at inquires@roadtoumrah.co.uk.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
