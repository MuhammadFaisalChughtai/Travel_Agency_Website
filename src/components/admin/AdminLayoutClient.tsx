"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlaneTakeoff,
  CreditCard,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Mail,
  BookOpen,
  FileCheck,
  Car,
  Megaphone,
} from "lucide-react";
import { SessionProvider, signOut } from "next-auth/react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Packages", href: "/admin/packages", icon: Package },
  { name: "Flights", href: "/admin/flights", icon: PlaneTakeoff },
  { name: "Visa", href: "/admin/visa", icon: FileCheck },
  { name: "Transport", href: "/admin/transport", icon: Car },
  { name: "Enquiries", href: "/admin/enquiries", icon: Mail },
  { name: "Marketing", href: "/admin/marketing", icon: Megaphone },
  { name: "Blogs", href: "/admin/blogs", icon: BookOpen },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
];

function AdminSidebar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: `/login` });
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 px-4 py-3 sm:px-6">
        <span className="text-white font-bold text-lg font-heading">
          Admin Portal
        </span>
        <button
          type="button"
          className="text-slate-200"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/80"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-900 pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex flex-shrink-0 items-center px-4 mb-8">
              <span className="text-white font-bold text-xl font-heading">
                Admin Portal
              </span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-shrink-0 bg-slate-800 p-4">
              <button
                onClick={handleSignOut}
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white w-full"
              >
                <LogOut className="mr-4 h-6 w-6 text-slate-400 group-hover:text-slate-300" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-slate-900">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4 mb-8">
              <span className="text-white font-bold text-xl font-heading">
                Admin Portal
              </span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex flex-shrink-0 bg-slate-800 p-4">
            <button
              onClick={handleSignOut}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white w-full"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-300" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-100 flex">
        <AdminSidebar />
        <main className="flex-1 lg:pl-64">
          <div className="py-6 sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}
