import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { TransportEditorForm } from "@/components/admin/TransportEditorForm";
import { deleteTransport } from "./actions";

export default async function AdminTransportPage({
  searchParams,
}: {
  searchParams: { editId?: string };
}) {
  const transports = await prisma?.transportService?.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const transportToEdit = searchParams.editId
    ? transports.find((t: any) => t.id === searchParams.editId)
    : undefined;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900">
          Transport Services Manager
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your transport offerings and prices.
        </p>
      </div>

      {/* Add/Edit Transport Form */}
      <div id="transport-form" className={`rounded-xl border p-8 mb-10 shadow-sm ${transportToEdit ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900">
            {transportToEdit ? `✏️ Editing: ${transportToEdit.vehicleType} — ${transportToEdit.type}` : "Add New Transport Service"}
          </h2>
          {transportToEdit && (
            <a href="/admin/transport" className="text-xs text-slate-500 hover:text-slate-700 font-semibold border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-white transition-colors">
              ✕ Cancel Edit
            </a>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-6">Fields marked * are required.</p>
        <TransportEditorForm initialData={transportToEdit} />
      </div>

      {/* Transports List */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            All Transport Services{" "}
            <span className="text-slate-400 font-normal text-sm">
              ({transports.length})
            </span>
          </h2>
        </div>

        {transports.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No transport services found. Add your first transport service above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Vehicle Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Popular
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {transports.map((transport: any) => (
                  <tr
                    key={transport.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 pl-6 pr-3 text-sm font-semibold text-slate-900">
                      {transport.vehicleType}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                        {transport.type}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm font-bold text-slate-900">
                      £{transport.price}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      {transport.capacity}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-400 font-mono text-xs">
                      {transport.slug ? (
                        <span className="text-slate-500">{transport.slug}</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600">⚠ Missing – Edit to fix</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      {transport.isPopular ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-3 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/transport?editId=${transport.id}`}
                          className="text-blue-500 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteTransport(transport.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
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
