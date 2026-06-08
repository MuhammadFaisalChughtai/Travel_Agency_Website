import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Mail, PlusCircle, UploadCloud } from "lucide-react";

export default async function MarketingDashboardPage() {
  const customerCount = await prisma.customer.count();
  const newsletterCount = await prisma.newsletter.count();
  
  const recentNewsletters = await prisma.newsletter.findMany({
    orderBy: { sentAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900">
            Email Marketing
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage customers and send personalized newsletters.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/marketing/customers"
            className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
          >
            <Users className="w-4 h-4" />
            Manage Customers
          </Link>
          <Link
            href="/admin/marketing/newsletter"
            className="flex items-center gap-2 bg-[#6b4f4f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5a4242] transition shadow-sm"
          >
            <Mail className="w-4 h-4" />
            Compose Newsletter
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Customers</p>
            <h3 className="text-3xl font-bold text-slate-900">{customerCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Newsletters Sent</p>
            <h3 className="text-3xl font-bold text-slate-900">{newsletterCount}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Recent Campaigns</h2>
        </div>
        
        {recentNewsletters.length === 0 ? (
          <div className="p-10 text-center">
            <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No newsletters sent yet.</p>
            <Link href="/admin/marketing/newsletter" className="text-[#6b4f4f] font-semibold text-sm hover:underline mt-2 inline-block">
              Create your first campaign &rarr;
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase">Subject</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase">Sent Date</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase">Recipients</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {recentNewsletters.map((newsletter: any) => (
                  <tr key={newsletter.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">{newsletter.subject}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{new Date(newsletter.sentAt).toLocaleString()}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{newsletter.recipientCount} customers</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
