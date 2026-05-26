import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

async function createTransport(formData: FormData) {
  "use server";
  
  const featuresString = formData.get("features")?.toString() || "";
  const featuresArray = featuresString.split("\n").map(f => f.trim()).filter(f => f);

  await prisma.transportService.create({
    data: {
      type: formData.get("type") as string,
      vehicleType: formData.get("vehicleType") as string,
      price: parseFloat(formData.get("price") as string),
      capacity: formData.get("capacity") as string,
      description: formData.get("description") as string,
      features: JSON.stringify(featuresArray),
      image: formData.get("image") as string,
      isPopular: formData.get("isPopular") === "on",
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    }
  });

  redirect("/admin/transport");
}

export default function NewTransportPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold font-heading text-slate-900 mb-6">Add New Transport Service</h1>
      <form action={createTransport} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Vehicle Title / Category</label>
            <input required name="vehicleType" type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" placeholder="e.g. Premium GMC / SUV" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Service Type</label>
            <input required name="type" type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" placeholder="e.g. VIP Transfer" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Price (£)</label>
            <input required name="price" type="number" step="0.01" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Capacity</label>
            <input required name="capacity" type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" placeholder="e.g. Up to 7 Guests" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Image URL</label>
          <input name="image" type="url" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" placeholder="https://..." />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
            <input name="isPopular" type="checkbox" className="rounded border-slate-300 text-primary focus:ring-primary" />
            Mark as "Most Popular"
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" placeholder="Short description of the vehicle and service..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Features (One per line)</label>
          <textarea name="features" rows={4} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" placeholder="VIP service & leather interior&#10;Spacious luggage capacity" />
        </div>
        <div className="border-t border-slate-200 pt-6">
          <h3 className="text-lg font-medium text-slate-900 mb-4">SEO Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Meta Title</label>
              <input name="metaTitle" type="text" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Meta Description</label>
              <textarea name="metaDescription" rows={2} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border" />
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <button type="submit" className="bg-[#6b4f4f] text-white px-4 py-2 rounded-md hover:bg-[#483434] text-sm font-semibold transition-colors">
            Save Transport Service
          </button>
        </div>
      </form>
    </div>
  );
}
