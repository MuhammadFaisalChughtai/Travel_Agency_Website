import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PackageEditorForm } from "@/components/admin/PackageEditorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const pkg = await prisma.package.findUnique({ where: { id: params.id } });
  if (!pkg) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Packages
        </Link>
        <h1 className="text-2xl font-bold font-heading text-slate-900">Edit Package</h1>
        <p className="mt-1 text-sm text-slate-500">Update the package details below.</p>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-200 p-8">
        <PackageEditorForm initialData={pkg} />
      </div>
    </div>
  );
}
