import { prisma } from "@/lib/prisma";
import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const blog = await prisma.blog.findUnique({
    where: { id: params.id }
  });

  if (!blog) {
    return notFound();
  }

  return (
    <div>
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <Link href="/admin/blogs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
          </Link>
          <h1 className="text-2xl font-bold font-heading text-slate-900">Edit Blog</h1>
          <p className="mt-2 text-sm text-slate-700">
            Update your blog post details below.
          </p>
        </div>
      </div>

      <div className="mt-4 bg-slate-50 p-6 shadow-sm border border-slate-200 sm:rounded-2xl">
        <BlogEditorForm initialData={blog} />
      </div>
    </div>
  );
}
