import { prisma } from "@/lib/prisma";
import { CustomerManagerClient } from "@/components/admin/CustomerManagerClient";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading text-slate-900">
          Customer Database
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your customer leads for email marketing campaigns.
        </p>
      </div>
      
      <CustomerManagerClient customers={customers} />
    </div>
  );
}
