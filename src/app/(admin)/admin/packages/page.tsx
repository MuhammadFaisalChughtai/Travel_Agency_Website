import { prisma } from "@/lib/prisma";
import { deletePackage } from "./actions";
import { PackageEditorForm } from "@/components/admin/PackageEditorForm";

import { Pagination } from "@/components/admin/Pagination";

const PAGE_SIZE = 10;

export default async function AdminPackagesPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || "1") || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [packages, totalCount] = await Promise.all([
    prisma.package.findMany({
      orderBy: [{ type: "asc" }, { stars: "asc" }, { createdAt: "desc" }],
      skip,
      take: PAGE_SIZE,
    }),
    prisma.package.count(),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const typeLabel: Record<string, string> = {
    UMRAH: "Umrah",
    HAJJ: "Hajj",
    HOLIDAY: "Holiday",
  };

  const typeBadgeColor: Record<string, string> = {
    UMRAH: "bg-emerald-100 text-emerald-700",
    HAJJ: "bg-purple-100 text-purple-700",
    HOLIDAY: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900">Packages Manager</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add Umrah (3★ / 4★ / 5★), Hajj, and Holiday packages. Use the rich text editor to add full package details.
        </p>
      </div>

      {/* Add Package Form */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8 mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Add New Package</h2>
        <p className="text-xs text-slate-400 mb-6">Fields marked * are required.</p>
        <PackageEditorForm />
      </div>

      {/* Packages List */}
      <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            All Packages <span className="text-slate-400 font-normal text-sm">({totalCount})</span>
          </h2>
        </div>

        {packages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No packages yet. Add your first package above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Stars</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">From</th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {packages.map((pkg: any) => {
                  let imgSrc = "";
                  try { imgSrc = JSON.parse(pkg.images)[0]; } catch { imgSrc = pkg.images; }

                  return (
                    <tr key={pkg.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {imgSrc && (
                            <img src={imgSrc} alt={pkg.title} className="w-12 h-10 rounded-lg object-cover shrink-0 border border-slate-100" />
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900 line-clamp-1">{pkg.title}</span>
                            {pkg.isSold && (
                              <span className="shrink-0 px-2 py-0.5 bg-red-100 border border-red-200 text-red-700 text-[10px] font-black uppercase rounded">
                                Sold Out
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${typeBadgeColor[pkg.type] || "bg-slate-100 text-slate-600"}`}>
                          {typeLabel[pkg.type] || pkg.type}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-sm text-amber-500 font-bold">
                        {"★".repeat(pkg.stars || 3)}
                        <span className="text-slate-300">{"★".repeat(5 - (pkg.stars || 3))}</span>
                      </td>
                      <td className="px-3 py-4 text-sm text-slate-600">{pkg.duration}</td>
                      <td className="px-3 py-4 text-sm font-bold text-slate-900">£{pkg.price}</td>
                      <td className="px-3 py-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-4">
                          <a
                            href={`/admin/packages/${pkg.id}/edit`}
                            className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                          >
                            Edit
                          </a>
                          <a
                            href={`/v/${pkg.slug}`}
                            target="_blank"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Preview
                          </a>
                          <form action={async () => {
                            "use server";
                            await deletePackage(pkg.id);
                          }}>
                            <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-medium">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/packages" />
          </div>
        )}
      </div>
    </div>
  );
}
