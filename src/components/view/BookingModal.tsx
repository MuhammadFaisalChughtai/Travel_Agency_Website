"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { TransportBookingForm } from "@/components/transport/TransportBookingForm";
import { VisaBookingForm } from "@/components/visa/VisaBookingForm";
import { UmrahBookingForm } from "@/components/umrah/UmrahBookingForm";
import { HolidaysBookingForm } from "@/components/holiday/HolidaysBookingForm";
import { FlightBookingForm } from "@/components/flights/FlightBookingForm";

interface BookingModalProps {
  type: string;
  id: string;
  title: string;
  isSold?: boolean;
}

export function BookingModal({ type, id, title, isSold }: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const labels: Record<string, string> = {
    transport: "Book This Transport",
    visa: "Apply for This Visa",
    package: "Book This Package",
    flight: "Book This Flight",
    holiday: "Book This Holiday",
  };

  const buttonLabel = isSold ? "Sold Out" : (labels[type] ?? "Book Now");

  const modalTitle: Record<string, string> = {
    transport: "Book Your Transfer — Free Quote",
    visa: "Request Your Visa — Free Quote",
    package: "Book Your Package — Free Quote",
    flight: "Book Your Flight — Free Quote",
    holiday: "Book Your Holiday — Free Quote",
  };

  const modalSubtitle: Record<string, string> = {
    transport: "Fill in your journey details and we'll confirm within 24 hours.",
    visa: "Our visa specialists will get back to you within 24 hours.",
    package: "Our team will prepare a personalised quote for you.",
    flight: "Submit your details and we'll finalise your reservation.",
    holiday: "Fill in your preferences and we'll send a free quote.",
  };

  return (
    <>
      {/* Trigger Button */}
      {isSold ? (
        <span className="flex items-center justify-center w-full h-12 rounded-2xl bg-slate-700/50 text-slate-400 font-heading font-black text-xs uppercase tracking-[0.15em] border border-slate-600/30 cursor-not-allowed select-none">
          Sold Out
        </span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-full h-12 rounded-2xl bg-gradient-to-r from-[#eed6c4] to-[#f5e6d8] hover:from-[#fff3e4] hover:to-[#eed6c4] text-[#382626] font-heading font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 shadow-lg hover:shadow-[#eed6c4]/15 hover:-translate-y-0.5 cursor-pointer"
        >
          {buttonLabel}
        </button>
      )}

      {/* Backdrop */}
      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          {/* Modal Panel */}
          <div
            className="relative bg-white w-full sm:max-w-3xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#382626] to-[#6b4f4f] px-6 py-5 flex items-start justify-between rounded-t-3xl">
              <div>
                <h2 className="text-white font-heading font-black text-lg tracking-tight">
                  {modalTitle[type] ?? "Book Now"}
                </h2>
                <p className="text-[#eed6c4]/80 text-xs mt-0.5">
                  {modalSubtitle[type] ?? "Our team will get back to you shortly."}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="ml-4 mt-0.5 shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Form Body */}
            <div className="pb-6 px-2 sm:px-4">
              {type === "transport" && (
                <TransportBookingForm isHome={false} isModal={true} packageId={id} packageTitle={title} />
              )}
              {type === "visa" && (
                <VisaBookingForm isHome={false} isModal={true} packageId={id} packageTitle={title} />
              )}
              {type === "flight" && <FlightBookingForm isHome={false} isModal={true} />}
              {type === "holiday" && <HolidaysBookingForm isHome={false} isModal={true} />}
              {(type === "package" || type === "umrah" || type === "hajj") && (
                <UmrahBookingForm isHome={false} isModal={true} />
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
