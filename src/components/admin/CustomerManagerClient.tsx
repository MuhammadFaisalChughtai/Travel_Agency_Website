"use client";

import React, { useState } from "react";
import { addCustomer, bulkImportCustomers, deleteCustomer } from "@/app/(admin)/admin/marketing/customers/actions";
import { Users, Upload, UserPlus, Trash2, Loader2, FileSpreadsheet } from "lucide-react";

export function CustomerManagerClient({ customers }: { customers: any[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const res = await addCustomer({ name, email, phone });
    setLoading(false);
    if (res.success) {
      setMsg("Customer added successfully.");
      setName(""); setEmail(""); setPhone("");
      setShowAddForm(false);
    } else {
      setMsg(res.error || "Error adding customer");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMsg("");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n');
        const newCustomers = [];
        
        // Skip header row usually, but let's just parse aggressively
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const parts = line.split(',');
          if (parts.length >= 2) {
            newCustomers.push({
              name: parts[0].trim(),
              email: parts[1].trim(),
              phone: parts[2] ? parts[2].trim() : undefined
            });
          }
        }

        if (newCustomers.length > 0) {
          const res = await bulkImportCustomers(newCustomers);
          if (res.success) {
            setMsg(`Successfully imported ${res.count} new customers.`);
            setShowImport(false);
          } else {
            setMsg(res.error || "Failed to import");
          }
        } else {
          setMsg("No valid data found in CSV. Make sure format is Name,Email,Phone");
        }
      } catch (err) {
        setMsg("Error processing CSV file");
      }
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <button onClick={() => { setShowAddForm(!showAddForm); setShowImport(false); setMsg(""); }} className="bg-[#6b4f4f] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#5a4242] transition flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add Single Customer
        </button>
        <button onClick={() => { setShowImport(!showImport); setShowAddForm(false); setMsg(""); }} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition flex items-center gap-2">
          <Upload className="w-4 h-4" /> Import CSV
        </button>
      </div>

      {msg && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{msg}</div>}

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-4">Add Customer Manually</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input required type="text" placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2 text-sm w-full" />
            <input required type="email" placeholder="Email Address" value={email} onChange={e=>setEmail(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2 text-sm w-full" />
            <input type="text" placeholder="Phone (Optional)" value={phone} onChange={e=>setPhone(e.target.value)} className="rounded-lg border-slate-300 px-3 py-2 text-sm w-full" />
          </div>
          <button disabled={loading} type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">
            {loading ? "Saving..." : "Save Customer"}
          </button>
        </form>
      )}

      {showImport && (
        <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2">Import from CSV</h3>
          <p className="text-sm text-slate-500 mb-4">Upload a CSV file with columns: <strong>Name, Email, Phone</strong></p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" /> Select CSV File
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={loading} />
            </label>
            {loading && <span className="text-sm text-slate-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span>}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Customer Directory <span className="text-slate-400 font-normal text-sm">({customers.length})</span>
          </h2>
        </div>
        
        {customers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            No customers found. Add your first customer above to start sending newsletters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="py-3 px-6 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Added</th>
                  <th className="py-3 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {customers.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="py-4 px-6 text-sm font-semibold text-slate-900">{c.name}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{c.email}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{c.phone || "—"}</td>
                    <td className="py-4 px-6 text-sm text-slate-600">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={async () => { if(confirm("Are you sure?")) await deleteCustomer(c.id); }} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
