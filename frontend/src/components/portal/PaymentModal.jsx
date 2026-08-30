import React, { useState, useEffect } from "react";
import { Building2, Smartphone, Wallet, Copy, Check, MessageCircle } from "lucide-react";
import { Entities, SiteContent } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PaymentModal({ booking, onClose }) {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState("");
  const [waNumber, setWaNumber] = useState("8801700000000");

  useEffect(() => {
    SiteContent.get().then(c => {
      if(c?.contact_whatsapp) setWaNumber(c.contact_whatsapp.replace(/[^0-9]/g, ''));
    }).catch(()=>{});
    if (!booking) return;
    setLoading(true);
    Entities.paymentMethods.list()
      .then(setMethods)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [booking]);

  const copy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 1500);
  };

  const waLink = booking
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Hello FlyEasy, I've made a payment for my booking "${booking.package_title}". Amount: ৳${booking.total_price}. Booking ref: ${booking.id}. Please confirm.`
      )}`
    : "#";

  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet size={20} className="text-primary" /> Complete Your Payment
          </DialogTitle>
        </DialogHeader>
        {booking && (
          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Package</span>
                <span className="font-semibold text-deep-space text-right">{booking.package_title}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="text-slate-500">Amount to pay</span>
                <span className="font-bold text-primary text-lg">৳{Number(booking.total_price).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-deep-space dark:text-white">Choose a payment method:</p>
              {loading ? (
                <div className="text-sm text-slate-400 py-6 text-center">Loading methods…</div>
              ) : methods.length === 0 ? (
                <div className="text-sm text-slate-400 py-6 text-center">No payment methods configured yet.</div>
              ) : (
                methods.map((pm) => (
                  <PaymentMethodItem key={pm.id} pm={pm} copied={copied} onCopy={copy} />
                ))
              )}
            </div>

            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
              After sending the payment, tap the button below to share your <strong>Transaction ID</strong> with us. Our team will confirm your booking shortly.
            </div>

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-[#25D366] text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={18} /> Send Payment Confirmation on WhatsApp
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PaymentMethodItem({ pm, copied, onCopy }) {
  const icons = { bank: Building2, bkash: Smartphone, nagad: Smartphone, rocket: Smartphone, sslcommerz: Wallet, other: Wallet };
  const Icon = icons[pm.method_type] || Wallet;
  const labels = { bank: "Bank Transfer", bkash: "bKash", nagad: "Nagad", rocket: "Rocket", sslcommerz: "SSL Commerz", other: pm.label || "Other" };

  const rows = [];
  if (pm.account_name) rows.push({ label: "Name", value: pm.account_name });
  if (pm.account_number) rows.push({ label: "A/C No", value: pm.account_number });
  if (pm.bank_name) rows.push({ label: "Bank", value: `${pm.bank_name}${pm.branch ? `, ${pm.branch}` : ""}` });
  if (pm.mobile_number) rows.push({ label: "Number", value: pm.mobile_number });

  return (
    <div className="border border-border rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon size={16} className="text-primary" />
        </div>
        <div className="font-bold text-deep-space dark:text-white text-sm">{pm.label || labels[pm.method_type]}</div>
      </div>
      <div className="space-y-1.5 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between items-center gap-2">
            <span className="text-slate-400 text-xs">{r.label}</span>
            <button
              onClick={() => onCopy(r.value, pm.id + r.label)}
              className="flex items-center gap-1.5 font-medium text-deep-space dark:text-white hover:text-primary dark:hover:text-primary transition-colors"
            >
              {r.value}
              {copied === pm.id + r.label ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} className="text-slate-400" />}
            </button>
          </div>
        ))}
        {pm.instructions && <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-border">{pm.instructions}</div>}
      </div>
    </div>
  );
}


