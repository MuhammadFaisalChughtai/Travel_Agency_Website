import { Hero } from "@/components/ui/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Terrific Travel Ltd",
  description: "Privacy Policy and data protection guidelines for Terrific Travel Ltd.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f5f0eb] min-h-screen pb-24">
      <Hero
        backgroundImage="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        badgeText="Legal"
        title={<>Privacy <span className="text-[#eed6c4] font-black drop-shadow-[0_2px_10px_rgba(238,214,196,0.2)]">Policy</span></>}
        description="How we protect your data and privacy."
        showTrustpilot={false}
      />

      <div className="mx-auto max-w-4xl px-6 lg:px-8 mt-16">
        <div className="bg-[#fff8f0] rounded-3xl shadow-xl shadow-[#483434]/5 border border-[#eed6c4]/60 p-8 md:p-12">
          <article className="prose max-w-none">
            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 tracking-wide uppercase">1. Introduction</h2>
            <p className="text-[#6b4f4f] font-medium leading-relaxed mb-6">
              Terrific Travel Ltd ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">2. The Data We Collect About You</h2>
            <p className="text-[#6b4f4f] font-medium leading-relaxed mb-6">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 text-[#6b4f4f] font-medium leading-relaxed mb-6 space-y-2">
              <li><strong className="text-[#2a1a1a]">Identity Data</strong> includes first name, last name, username or similar identifier, marital status, title, date of birth and gender.</li>
              <li><strong className="text-[#2a1a1a]">Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
              <li><strong className="text-[#2a1a1a]">Financial Data</strong> includes bank account and payment card details (processed securely via our payment providers).</li>
              <li><strong className="text-[#2a1a1a]">Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
            </ul>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">3. How We Use Your Personal Data</h2>
            <p className="text-[#6b4f4f] font-medium leading-relaxed mb-6">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-[#6b4f4f] font-medium leading-relaxed mb-6 space-y-2">
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., booking flights, hotels, or visa processing).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal or regulatory obligation.</li>
            </ul>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">4. Data Security</h2>
            <p className="text-[#6b4f4f] font-medium leading-relaxed mb-6">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2 className="font-heading text-2xl text-[#2a1a1a] font-black mb-4 mt-8 tracking-wide uppercase">5. Your Legal Rights</h2>
            <p className="text-[#6b4f4f] font-medium leading-relaxed mb-6">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 text-[#6b4f4f] font-medium leading-relaxed mb-6 space-y-2">
              <li>Request access to your personal data.</li>
              <li>Request correction of your personal data.</li>
              <li>Request erasure of your personal data.</li>
              <li>Object to processing of your personal data.</li>
              <li>Request restriction of processing your personal data.</li>
              <li>Request transfer of your personal data.</li>
              <li>Right to withdraw consent.</li>
            </ul>

            <p className="text-[#2a1a1a] mt-8 font-bold">
              If you have any questions about this privacy policy, please contact us at inquires@terrifictravel.co.uk.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
