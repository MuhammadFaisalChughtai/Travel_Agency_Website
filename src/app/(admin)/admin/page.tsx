import { Package, PlaneTakeoff, CreditCard, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Fetch stats from DB
  const [packagesCount, flightsCount, bookingsCount] = await Promise.all([
    prisma.package.count(),
    prisma.flight.count(),
    prisma.booking.count(),
  ]);

  const stats = [
    { name: 'Total Packages', stat: packagesCount.toString(), icon: Package, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Total Flights', stat: flightsCount.toString(), icon: PlaneTakeoff, color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { name: 'Total Bookings', stat: bookingsCount.toString(), icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { name: 'Total Users', stat: '1', icon: Users, color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 font-heading mb-8">Dashboard Overview</h1>

      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {stats.map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-xl bg-white px-4 pt-5 pb-6 shadow-sm border border-slate-200 sm:px-6 sm:pt-6">
            <dt>
              <div className={`absolute rounded-md ${item.bg} p-3`}>
                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-slate-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-1 sm:pb-2">
              <p className="text-2xl font-semibold text-slate-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Bookings</h2>
            <p className="text-slate-500 text-sm">No recent bookings found.</p>
         </div>
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <a href="/admin/packages" className="block text-primary hover:underline font-medium">Manage Packages &rarr;</a>
              <a href="/admin/flights" className="block text-primary hover:underline font-medium">Manage Flights &rarr;</a>
            </div>
         </div>
      </div>
    </div>
  );
}
