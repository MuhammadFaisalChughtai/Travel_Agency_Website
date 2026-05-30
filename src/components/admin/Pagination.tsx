"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3">
      <div className="flex flex-1 justify-between sm:hidden">
        {currentPage > 1 ? (
          <Link
            href={`${basePath}?page=${currentPage - 1}`}
            className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#f5f0eb]"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
            Previous
          </span>
        )}
        {currentPage < totalPages ? (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#f5f0eb]"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400">
            Next
          </span>
        )}
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {currentPage > 1 ? (
              <Link
                href={`${basePath}?page=${currentPage - 1}`}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-[#f5f0eb] focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-300 ring-1 ring-inset ring-slate-300 bg-[#f5f0eb]">
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </span>
            )}

            {/* Simple page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <Link
                  key={page}
                  href={`${basePath}?page=${page}`}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                    page === currentPage
                      ? "z-10 bg-slate-900 text-white focus-visible:outline-slate-600"
                      : "text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-[#f5f0eb]"
                  }`}
                >
                  {page}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link
                href={`${basePath}?page=${currentPage + 1}`}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-[#f5f0eb] focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-300 ring-1 ring-inset ring-slate-300 bg-[#f5f0eb]">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
