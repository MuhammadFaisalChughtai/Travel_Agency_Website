import { prisma } from "@/lib/prisma";

import { Pagination } from "@/components/admin/Pagination";

const PAGE_SIZE = 10;

export default async function AdminEnquiriesPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || "1") || 1;
  const skip = (page - 1) * PAGE_SIZE;

  const [enquiries, totalEnquiries] = await Promise.all([
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
    }),
    prisma.enquiry.count(),
  ]);

  const totalPages = Math.ceil(totalEnquiries / PAGE_SIZE);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold font-heading text-slate-900">Enquiries</h1>
          <p className="mt-2 text-sm text-slate-700">
            A list of all customer enquiries from the website including flight requests, package queries, and general messages.
          </p>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-slate-300">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Customer</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Type</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {enquiries.map((enquiry: any) => (
                    <tr key={enquiry.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-500 sm:pl-6">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">
                        {enquiry.name}
                        <div className="text-xs text-slate-500 font-normal">{enquiry.email}</div>
                        <div className="text-xs text-slate-500 font-normal">{enquiry.phone}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        {enquiry.type}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${enquiry.status === 'PENDING' ? 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'}`}>
                          {enquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {enquiries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                        No enquiries found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <Pagination currentPage={page} totalPages={totalPages} basePath="/admin/enquiries" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
