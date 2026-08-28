import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Power, Pencil, Building2, Smartphone, CreditCard, Wallet, Save, X, Search, Download } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/admin/Pagination";

const TYPES = [
{ value: "bank", label: "Bank Transfer", icon: Building2 },
{ value: "bkash", label: "bKash", icon: Smartphone },
{ value: "nagad", label: "Nagad", icon: Smartphone },
{ value: "rocket", label: "Rocket", icon: Smartphone },
{ value: "sslcommerz", label: "SSL Commerz", icon: CreditCard },
{ value: "other", label: "Other", icon: Wallet },
];

const EMPTY = { method_type: "bank", label: "", account_name: "", account_number: "", bank_name: "", branch: "", routing_number: "", mobile_number: "", merchant_id: "", store_id: "", instructions: "", active: true, sort_order: 0 };

export default function AdminPayment() {
const { toast } = useToast();
const [items, setItems] = useState([]);
const [loading, setLoading] = useState(true);
const [editing, setEditing] = useState(null);
const [saving, setSaving] = useState(false);
const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 10;

const load = async () => {
try { setItems(await Entities.paymentMethods.list()); }
catch (e) { console.error(e); }
finally { setLoading(false); }
};
useEffect(() => { load(); }, []);

const filtered = items.filter((pm) => 
  !search || 
  pm.label?.toLowerCase().includes(search.toLowerCase()) || 
  pm.bank_name?.toLowerCase().includes(search.toLowerCase())
);

const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

const handleExportCSV = () => {
  if (items.length === 0) return;
  const headers = ["id", "method_type", "label", "account_name", "account_number", "bank_name", "branch", "routing_number", "mobile_number", "merchant_id", "store_id", "active"];
  const csvContent = [
    headers.join(","),
    ...items.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "payment_methods_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const openNew = () => setEditing({ ...EMPTY });
const openEdit = (pm) => setEditing({ ...pm });
const close = () => setEditing(null);
const set = (k, v) => setEditing({ ...editing, [k]: v });

const save = async (e) => {
e.preventDefault();
if (!editing.label) { toast({ title: "Label is required", variant: "destructive" }); return; }
setSaving(true);
try {
if (editing.id) await Entities.paymentMethods.update(editing.id, editing);
else await Entities.paymentMethods.create(editing);
toast({ title: "Payment method saved." });
setEditing(null);
load();
} catch (err) { toast({ title: "Save failed.", variant: "destructive" }); }
finally { setSaving(false); }
};

const toggle = async (pm) => { await Entities.paymentMethods.update(pm.id, { active: !pm.active }); load(); };
const remove = async (pm) => { if (confirm("Delete this payment method?")) { await Entities.paymentMethods.remove(pm.id); load(); } };

return (
<div>
<div className="mb-8 flex items-center justify-between gap-4">
<div>
<h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Payment Methods</h1>
<p className="text-slate-500 dark:text-slate-400 mt-1">Configure bank accounts, mobile banking & SSL Commerz — shared with clients.</p>
</div>
<button onClick={openNew} className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 whitespace-nowrap">
<Plus size={16} /> Add Method
</button>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  <div className="relative flex-1 w-full sm:max-w-md">
    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input 
      value={search} 
      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
      placeholder="Search payment methods..." 
      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
    />
  </div>
  <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
    <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
  </button>
</div>

{loading ? <div className="text-slate-400"><Loader2 className="animate-spin inline" /></div> : items.length === 0 ? (
<p className="text-slate-400">No payment methods yet. Click "Add Method" to add bank details, bKash, Nagad or SSL Commerz.</p>
) : (
<>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{currentItems.map((pm) => {
const t = TYPES.find((x) => x.value === pm.method_type) || TYPES[5];
const Icon = t.icon;
return (
<div className="bg-white dark:bg-slate-900 rounded-2xl shadow-float p-5 border border-slate-100 dark:border-slate-800">
<div className="flex items-start justify-between mb-3">
<div className="flex items-center gap-2">
<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon size={18} className="text-primary" /></div>
<div>
<div className="font-semibold text-deep-space dark:text-white text-sm">{pm.label}</div>
<div className="text-xs text-slate-500 dark:text-slate-400">{t.label}</div>
</div>
</div>
{!pm.active && <span className="text-xs text-slate-400">Inactive</span>}
</div>
<div className="space-y-1 text-xs text-slate-600 dark:text-slate-300 mb-3">
{pm.account_name && <div><span className="text-slate-400">Name:</span> {pm.account_name}</div>}
{pm.account_number && <div><span className="text-slate-400">A/C:</span> {pm.account_number}</div>}
{pm.bank_name && <div><span className="text-slate-400">Bank:</span> {pm.bank_name}</div>}
{pm.mobile_number && <div><span className="text-slate-400">Number:</span> {pm.mobile_number}</div>}
{pm.merchant_id && <div><span className="text-slate-400">Merchant:</span> {pm.merchant_id}</div>}
</div>
<div className="flex items-center gap-1 pt-3 border-t border-border dark:border-slate-800">
<button onClick={() => openEdit(pm)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Edit"><Pencil size={15} className="text-slate-600 dark:text-slate-400" /></button>
<button onClick={() => toggle(pm)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={pm.active ? "Deactivate" : "Activate"}><Power size={15} className={pm.active ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-600"} /></button>
<button onClick={() => remove(pm)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete"><Trash2 size={15} className="text-red-500" /></button>
</div>
</div>
);
})}
</div>
<div className="mt-8">
  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
</div>
</>
)}

{editing && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={close}>
<form onClick={(e) => e.stopPropagation()} onSubmit={save} className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 border border-slate-100 dark:border-slate-800">
<div className="flex items-center justify-between mb-4">
<h2 className="font-bold text-deep-space dark:text-white text-lg">{editing.id ? "Edit Method" : "New Payment Method"}</h2>
<button type="button" onClick={close} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"><X size={18} /></button>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
<div className="sm:col-span-2">
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Type</label>
<select value={editing.method_type} onChange={(e) => set("method_type", e.target.value)} className="input">
{TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
</select>
</div>
<div className="sm:col-span-2">
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Label *</label>
<input value={editing.label} onChange={(e) => set("label", e.target.value)} className="input" placeholder="e.g. DBBL Current Account" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Account Name</label>
<input value={editing.account_name} onChange={(e) => set("account_name", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Account Number</label>
<input value={editing.account_number} onChange={(e) => set("account_number", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Bank Name</label>
<input value={editing.bank_name} onChange={(e) => set("bank_name", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Branch</label>
<input value={editing.branch} onChange={(e) => set("branch", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Routing Number</label>
<input value={editing.routing_number} onChange={(e) => set("routing_number", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Mobile Number (bKash/Nagad)</label>
<input value={editing.mobile_number} onChange={(e) => set("mobile_number", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Merchant ID (SSL)</label>
<input value={editing.merchant_id} onChange={(e) => set("merchant_id", e.target.value)} className="input" />
</div>
<div>
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Store ID (SSL)</label>
<input value={editing.store_id} onChange={(e) => set("store_id", e.target.value)} className="input" />
</div>
<div className="sm:col-span-2">
<label className="block text-sm font-medium text-deep-space dark:text-slate-300 mb-1">Instructions</label>
<textarea rows={2} value={editing.instructions} onChange={(e) => set("instructions", e.target.value)} className="input" />
</div>
<label className="flex items-center gap-2 text-sm text-deep-space dark:text-slate-300 sm:col-span-2">
<input type="checkbox" checked={editing.active} onChange={(e) => set("active", e.target.checked)} className="accent-primary" /> Active (visible to clients)
</label>
</div>
<div className="flex gap-2 mt-5">
<button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl disabled:opacity-60"><Save size={16} /> {saving ? "Saving…" : "Save"}</button>
<button type="button" onClick={close} className="px-5 py-3 rounded-xl border border-border dark:border-slate-700 dark:text-slate-300 font-medium">Cancel</button>
</div>
</form>
</div>
)}
</div>
);
}


