import { prisma } from "@/lib/prisma";
import { deleteBlog } from "./actions";
import { BlogEditorForm } from "@/components/admin/BlogEditorForm";
import Link from "next/link";

export default async function AdminBlogsPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold font-heading text-slate-900">Blogs</h1>
          <p className="mt-2 text-sm text-slate-700">
            Manage your blog posts here.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-slate-50 p-6 shadow-sm border border-slate-200 sm:rounded-2xl">
        <h2 className="text-lg font-bold mb-6 font-heading text-slate-900 border-b pb-4">Add New Blog</h2>
        <BlogEditorForm />
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-slate-300">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Title</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Category</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date</th>
                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900 pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {blogs.map((blog: any) => (
                    <tr key={blog.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{blog.title}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{blog.category}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{blog.date}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-right pr-6 flex justify-end gap-3">
                        <Link href={`/admin/blogs/${blog.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">Edit</Link>
                        <form action={async () => {
                          "use server";
                          await deleteBlog(blog.id);
                        }}>
                          <button type="submit" className="text-red-600 hover:text-red-900 font-medium">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-sm text-slate-500">No blogs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
