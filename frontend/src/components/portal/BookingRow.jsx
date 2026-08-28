import React from "react";
import { Calendar, Users, MapPin, Plane, Compass, Download } from "lucide-react";
import { generateBookingPDF } from "@/lib/pdfGenerator";

export default function BookingRow({ b, onPay }) {
  const statusMap = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-sky-100 text-sky-700",
  };
  const Icon = b.item_type === "Hotel" ? MapPin : b.item_type === "Guide" ? Compass : Plane;
  const canPay = Number(b.total_price) > 0 && b.status === "pending";

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 border border-border">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-primary" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-sm text-deep-space truncate">{b.package_title || "Booking"}</div>
          <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
            <span className="capitalize">{(b.item_type || "package").toLowerCase()}</span>
            {b.travel_date && (
              <span className="flex items-center gap-0.5">
                <Calendar size={11} /> {new Date(b.travel_date).toLocaleDateString()}
              </span>
            )}
            {b.number_of_travelers > 0 && (
              <span className="flex items-center gap-0.5">
                <Users size={11} /> {b.number_of_travelers}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {b.total_price > 0 && (
          <span className="text-sm font-semibold text-deep-space hidden sm:inline">
            ৳{b.total_price.toLocaleString()}
          </span>
        )}
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusMap[b.status] || "bg-slate-100 text-slate-600"}`}>
          {b.status}
        </span>
        {canPay && onPay && (
          <button
            onClick={() => onPay(b)}
            className="text-xs font-semibold bg-primary text-white px-3 py-1.5 rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            Pay Now
          </button>
        )}
        <button
          onClick={() => generateBookingPDF(b, { name: b.customer_name, email: b.customer_email, phone: b.customer_phone }, b.item_type || 'Package').catch(console.error)}
          title="Download Ticket (PDF)"
          className="p-1.5 rounded-full text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors shrink-0"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}

