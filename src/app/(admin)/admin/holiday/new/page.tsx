"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function NewPackagePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Convert comma separated string to JSON array
    const servicesString = formData.get("includedServices") as string;
    const servicesArray = servicesString.split(",").map(s => s.trim()).filter(Boolean);

    const payload = {
      title: formData.get("title"),
      type: formData.get("type"),
      destination: formData.get("destination"),
      duration: formData.get("duration"),
      price: formData.get("price"),
      description: formData.get("description"),
      travelDates: formData.get("travelDates"),
      includedServices: JSON.stringify(servicesArray),
      images: JSON.stringify([formData.get("imageUrl")]),
      availability: true,
    };

    try {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/packages");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to create package");
      }
    } catch (error) {
      console.error(error);
      alert("Error creating package");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-slate-900 sm:truncate sm:text-3xl sm:tracking-tight font-heading">
            Create New Package
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-slate-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900">Package Title</label>
              <div className="mt-2">
                <input type="text" name="title" id="title" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="type" className="block text-sm font-medium leading-6 text-slate-900">Type</label>
              <div className="mt-2">
                <select id="type" name="type" className="block w-full rounded-md border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3">
                  <option value="HOLIDAY">Holiday</option>
                  <option value="UMRAH">Umrah</option>
                  <option value="Cruise_Umrah">Cruise Umrah</option>
                  <option value="HAJJ">Hajj</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="destination" className="block text-sm font-medium leading-6 text-slate-900">Destination</label>
              <div className="mt-2">
                <input type="text" name="destination" id="destination" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="duration" className="block text-sm font-medium leading-6 text-slate-900">Duration</label>
              <div className="mt-2">
                <input type="text" name="duration" id="duration" placeholder="e.g. 7 Days, 6 Nights" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-medium leading-6 text-slate-900">Price (£)</label>
              <div className="mt-2">
                <input type="number" step="0.01" name="price" id="price" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="travelDates" className="block text-sm font-medium leading-6 text-slate-900">Travel Dates</label>
              <div className="mt-2">
                <input type="text" name="travelDates" id="travelDates" placeholder="e.g. Oct 2026 - Mar 2027" required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="imageUrl" className="block text-sm font-medium leading-6 text-slate-900">Image URL</label>
              <div className="mt-2">
                <input type="url" name="imageUrl" id="imageUrl" placeholder="https://..." required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900">Description</label>
              <div className="mt-2">
                <textarea id="description" name="description" rows={4} required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="includedServices" className="block text-sm font-medium leading-6 text-slate-900">Included Services (Comma separated)</label>
              <div className="mt-2">
                <textarea id="includedServices" name="includedServices" rows={3} placeholder="Flights, 5-Star Hotel, Breakfast..." required className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 px-3" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-x-6 border-t border-slate-900/10 px-4 py-4 sm:px-8">
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Package"}
          </Button>
        </div>
      </form>
    </div>
  );
}
