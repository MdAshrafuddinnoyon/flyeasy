import React, { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { SiteContent } from "@/lib/api";

export default function WhatsAppSupport() {
  const [number, setNumber] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    SiteContent.get()
      .then((c) => {
        if (c?.contact_whatsapp) setNumber(c.contact_whatsapp);
      })
      .catch(() => {});
  }, []);

  const clean = number.replace(/[^0-9]/g, "");
  if (!clean) return null;

  const waLink = `https://wa.me/${clean}?text=${encodeURIComponent(
    "Hello FlyEasy, I have a question about my booking/trip."
  )}`;

  return (
    <div className="fixed bottom-[5.5rem] md:bottom-6 right-4 md:right-6 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white rounded-2xl shadow-float-lg p-4 w-[260px] sm:w-72 animate-scale-in border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-white" />
              </div>
              <div className="font-semibold text-sm text-deep-space">FlyEasy Support</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-deep-space p-1" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            Hi there! 👋 Need help with a booking or trip? Chat with us on WhatsApp — we usually reply within minutes.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#25D366] text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <MessageCircle size={16} /> Start Chat
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 shrink-0 rounded-full bg-[#25D366] text-white shadow-float-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="WhatsApp Support"
      >
        <MessageCircle size={26} />
      </button>
    </div>
  );
}
