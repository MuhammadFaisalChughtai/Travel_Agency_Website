import { prisma } from "@/lib/prisma";
import { deleteFlight } from "./actions";
import { createTrendingFlight, deleteTrendingFlight } from "./trendingActions";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Plane, ArrowRight, RefreshCw, Trash2 } from "lucide-react";
import { FlightEditorForm } from "@/components/admin/FlightEditorForm";
import { Pagination } from "@/components/admin/Pagination";

const PAGE_SIZE = 10;

export default async function AdminFlightsPage({ searchParams }: { searchParams: { editId?: string; page?: string } }) {
  const page = parseInt(searchParams.page || "1") || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [flights, totalFlights] = await Promise.all([
    prisma.flight.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.flight.count(),
  ]);

  const totalPages = Math.ceil(totalFlights / PAGE_SIZE);

  const trendingFlights = await (prisma as any).trendingFlight.findMany({
    orderBy: { createdAt: "desc" },
  });

  const flightToEdit = searchParams.editId 
    ? await prisma.flight.findUnique({ where: { id: searchParams.editId } }) 
    : undefined;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Flights Manager</h1>
        <p className="mt-1 text-sm text-slate-500">Manage flight deals and trending destinations shown on the flights page.</p>
      </div>

      {/* ── Trending Flights ── */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8 mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Trending Flight Routes</h2>
        <p className="text-xs text-slate-400 mb-6">These appear as destination cards on the public flights page with a Load More button.</p>

        {/* Add Trending Flight */}
        <div className="mb-8 p-6 border border-slate-100 bg-slate-50/50 rounded-lg">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Add Trending Destination</h3>
          <form action={createTrendingFlight} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Destination *</label>
              <input
                required
                name="destination"
                type="text"
                placeholder="e.g. Dubai, UAE"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Price from (£) *</label>
              <input
                required
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 350"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Image URL *</label>
              <input
                required
                name="image"
                type="text"
                placeholder="https://..."
                className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tag (optional)</label>
              <div className="flex gap-2">
                <input
                  name="tag"
                  type="text"
                  placeholder="e.g. Most Popular"
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Trending List */}
        {trendingFlights.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">No trending destinations yet. Add your first one above.</div>
        ) : (
          <div className="max-h-[500px] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trendingFlights.map((tf: any) => (
                <div key={tf.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-52 shrink-0">
                  {tf.image && (
                    <div className="absolute inset-0">
                      <Image src={tf.image} alt={tf.destination} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    </div>
                  )}
                  {tf.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2 py-0.5 rounded-full bg-amber-400 text-[8px] font-black uppercase tracking-wider text-amber-900">{tf.tag}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <p className="text-white font-black text-sm font-heading">{tf.destination}</p>
                    <p className="text-[#eed6c4] text-xs font-medium">From £{tf.price}</p>
                  </div>
                  <form action={async () => {
                    "use server";
                    await deleteTrendingFlight(tf.id);
                  }} className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="submit" className="w-7 h-7 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold hover:bg-red-600">✕</button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Flight Editor Form ── */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8 mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-1">
          {flightToEdit ? "Edit Flight Deal" : "Add New Flight Deal"}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Fields marked * are required.
        </p>
        <FlightEditorForm key={flightToEdit?.id || "new"} initialData={flightToEdit} currentPage={page} />
      </div>

      {/* ── Regular Flight Deals ── */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Flight Deals <span className="text-slate-400 font-normal text-sm">({totalFlights})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Airline</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {flights.map((flight: any) => (
                <tr key={flight.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 pl-6 pr-3 text-sm font-semibold text-slate-900">
                    <div className="flex flex-col">
                      <span>{flight.airline}</span>
                      {flight.airlineCode && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{flight.airlineCode}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span>{flight.departure}</span>
                      <span className="text-xs text-slate-400">({flight.departureCode || "LHR"})</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span>{flight.destination}</span>
                      <span className="text-xs text-slate-400">({flight.destinationCode || "DXB"})</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    {flight.isReturn ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <RefreshCw className="w-3 h-3" />
                        Return
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 text-xs font-bold border border-slate-200">
                        <ArrowRight className="w-3 h-3" />
                        One Way
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-xs text-slate-500">
                    <div className="space-y-1">
                      <div>
                        <span className="font-bold text-slate-700">Outbound:</span>{" "}
                        {flight.isTransit ? (
                          <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Transit ({flight.transitAirport})</span>
                        ) : (
                          <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Direct</span>
                        )}
                        <span className="ml-1 text-slate-400">| {flight.duration}</span>
                      </div>
                      {flight.isReturn && (
                        <div>
                          <span className="font-bold text-slate-700">Return:</span>{" "}
                          {flight.returnIsTransit ? (
                            <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Transit ({flight.returnTransitAirport})</span>
                          ) : (
                            <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Direct</span>
                          )}
                          <span className="ml-1 text-slate-400">| {flight.returnDuration}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm font-bold text-slate-900">£{flight.price}</td>
                  <td className="px-3 py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-4">
                      <Link href={`/admin/flights?editId=${flight.id}&page=${page}`} className="text-blue-500 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteFlight(flight.id);
                      }}>
                        <button type="submit" className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1 ml-auto">
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {flights.length === 0 && (
                <tr><td colSpan={6} className="py-10 text-center text-sm text-slate-400">No flights added yet.</td></tr>
              )}
            </tbody>
          </table>
          <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/flights" />
        </div>
      </div>
    </div>
  );
}
