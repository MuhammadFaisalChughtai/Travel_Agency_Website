import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border border-gray-100">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="text-sm font-semibold text-gray-700">Loading Dashboard...</span>
      </div>
    </div>
  );
}
