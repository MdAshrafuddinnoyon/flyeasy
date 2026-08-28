import React from "react";
import { Wallet, Building2, Smartphone, CreditCard } from "lucide-react";

export default function PaymentsPanel({ paymentMethods }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space flex items-center gap-2"><Wallet size={22} className="text-primary" /> Payment Methods</h1>
        <p className="text-slate-500 mt-1 text-sm">Use any method below to pay for your booking. Share your transaction ID in your booking message.</p>
      </div>
      {paymentMethods.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-float p-10 text-center text-slate-400">No payment methods configured yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentMethods.map((pm) => <PaymentMethodCard key={pm.id} pm={pm} />)}
        </div>
      )}
    </div>
  );
}

function PaymentMethodCard({ pm }) {
  const icons = { bank: Building2, bkash: Smartphone, nagad: Smartphone, rocket: Smartphone, sslcommerz: CreditCard, other: Wallet };
  const Icon = icons[pm.method_type] || Wallet;
  const labels = { bank: "Bank Transfer", bkash: "bKash", nagad: "Nagad", rocket: "Rocket", sslcommerz: "SSL Commerz", other: "Other" };
  return (
    <div className="bg-white rounded-3xl shadow-float p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Icon size={18} className="text-primary" /></div>
        <div className="font-bold text-deep-space">{pm.label || labels[pm.method_type]}</div>
      </div>
      <div className="space-y-1.5 text-sm text-slate-600">
        {pm.account_name && <div className="flex justify-between"><span className="text-slate-400">Name</span><span className="font-medium text-deep-space">{pm.account_name}</span></div>}
        {pm.account_number && <div className="flex justify-between"><span className="text-slate-400">A/C</span><span className="font-medium text-deep-space">{pm.account_number}</span></div>}
        {pm.bank_name && <div className="flex justify-between"><span className="text-slate-400">Bank</span><span className="font-medium text-deep-space text-right">{pm.bank_name}{pm.branch && `, ${pm.branch}`}</span></div>}
        {pm.mobile_number && <div className="flex justify-between"><span className="text-slate-400">Number</span><span className="font-medium text-deep-space">{pm.mobile_number}</span></div>}
        {pm.merchant_id && <div className="flex justify-between"><span className="text-slate-400">Merchant ID</span><span className="font-medium text-deep-space">{pm.merchant_id}</span></div>}
        {pm.instructions && <div className="text-xs text-slate-500 mt-2 pt-2 border-t border-border">{pm.instructions}</div>}
      </div>
    </div>
  );
}

