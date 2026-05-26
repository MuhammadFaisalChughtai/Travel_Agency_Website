import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { VisaEditorForm } from "@/components/admin/VisaEditorForm";
import { deleteVisa } from "./actions";

export default async function AdminVisaPage({
  searchParams,
}: {
  searchParams: { editId?: string };
}) {
  const visas = await prisma?.visaService?.findMany({
    orderBy: { updatedAt: "desc" },
  });

  const visaToEdit = searchParams.editId
    ? visas.find((v: any) => v.id === searchParams.editId)
    : undefined;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900">
          Visa Services Manager
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your visa offerings and prices.
        </p>
      </div>

      {/* Add/Edit Visa Form */}
      <div id="visa-form" className={`rounded-xl border p-8 mb-10 shadow-sm ${visaToEdit ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-bold text-slate-900">
            {visaToEdit ? `✏️ Editing: ${visaToEdit.country} — ${visaToEdit.visaType}` : "Add New Visa Service"}
          </h2>
          {visaToEdit && (
            <a href="/admin/visa" className="text-xs text-slate-500 hover:text-slate-700 font-semibold border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-white transition-colors">
              ✕ Cancel Edit
            </a>
          )}
        </div>
        <p className="text-xs text-slate-400 mb-6">Fields marked * are required.</p>
        <VisaEditorForm initialData={visaToEdit} />
      </div>

      {/* Visas List */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            All Visas{" "}
            <span className="text-slate-400 font-normal text-sm">
              ({visas.length})
            </span>
          </h2>
        </div>

        {visas.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No visa services found. Add your first visa service above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {visas.map((visa: any) => (
                  <tr
                    key={visa.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 pl-6 pr-3 text-sm font-semibold text-slate-900">
                      {visa.country}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                        {visa.visaType}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm font-bold text-slate-900">
                      £{visa.price}
                    </td>
                    <td className="px-3 py-4 text-sm text-slate-600">
                      {visa.processingTime}
                    </td>
                    <td className="px-3 py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/visa?editId=${visa.id}`}
                          className="text-blue-500 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deleteVisa(visa.id);
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
