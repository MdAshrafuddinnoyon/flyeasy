import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Upload, Loader2, Download } from "lucide-react";
import { Entities } from "@/lib/api";
import { Image as UIImage } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { title: "", description: "", image_url: "", coupon_code: "", discount_text: "", link_url: "", active: true, sort_order: 0 };

export default function AdminPromotions() {
const [promos, setPromos] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [editing, setEditing] = useState(null);
const [open, setOpen] = useState(false);
const [saving, setSaving] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 10;
const { toast } = useToast();

const load = async () => {
setLoading(true);
try { setPromos(await Entities.promotions.list()); }
catch (e) { console.error(e); } finally { setLoading(false); }
};

useEffect(() => { load(); }, []);

const handleExportCSV = () => {
  if (promos.length === 0) return;
  const headers = ["id", "title", "description", "coupon_code", "discount_text", "link_url", "active", "sort_order"];
  const csvContent = [
    headers.join(","),
    ...promos.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "promotions_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filtered = promos.filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
const openEdit = (p) => { setEditing({ ...EMPTY, ...p }); setOpen(true); };

const handleSave = async () => {
if (!editing.title || !editing.image_url) { toast({ title: "Title and image are required", variant: "destructive" }); return; }
setSaving(true);
try {
const payload = { ...editing, sort_order: Number(editing.sort_order) || 0 };
if (editing.id) { await Entities.promotions.update(editing.id, payload); toast({ title: "Promotion updated" }); }
else { await Entities.promotions.create(payload); toast({ title: "Promotion created" }); }
setOpen(false); load();
} catch (e) { toast({ title: "Error saving", variant: "destructive" }); } finally { setSaving(false); }
};

const handleDelete = async (p) => {
if (!confirm(`Delete "${p.title}"?`)) return;
try { await Entities.promotions.remove(p.id); toast({ title: "Promotion deleted" }); load(); }
catch (e) { toast({ title: "Error deleting", variant: "destructive" }); }
};



const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";

return (
<div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
<div><h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Promotions</h1><p className="text-slate-500 dark:text-slate-400 mt-1">{promos.length} promotions total</p></div>
<Button onClick={openNew} className="bg-primary hover:bg-primary/90"><Plus size={18} /> Add Promotion</Button>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  <div className="relative flex-1 w-full sm:max-w-md">
    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input 
      value={search} 
      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
      placeholder="Search promotions..." 
      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
    />
  </div>
  <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
    <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
  </button>
</div>

{loading ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="h-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}</div>
) : filtered.length > 0 ? (
<>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{currentItems.map((p) => (
<div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float overflow-hidden group">
<div className="relative h-40">
{p.image_url ? <UIImage src={p.image_url} alt={p.title} fittingType="fill" className="w-full h-full" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />}
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
{!p.active && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Inactive</div>}
<div className="absolute top-3 right-3 flex gap-1.5">
<button onClick={() => openEdit(p)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-deep-space hover:bg-white dark:hover:bg-slate-800 dark:text-white"><Pencil size={15} /></button>
<button onClick={() => handleDelete(p)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-red-600 hover:bg-white dark:hover:bg-slate-800"><Trash2 size={15} /></button>
</div>
<div className="absolute bottom-0 inset-x-0 p-3">
<h3 className="text-white font-bold text-sm line-clamp-1">{p.title}</h3>
{p.coupon_code && <span className="inline-block glass-dark text-white text-xs font-mono px-2 py-0.5 rounded-full mt-1">{p.coupon_code}</span>}
</div>
</div>
</div>
))}
</div>
<div className="mt-8">
  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
</div>
</>
) : (
<div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
<p className="text-slate-500 dark:text-slate-400 mb-4">No promotions yet.</p>
<Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add promotion</Button>
</div>
)}

<Dialog open={open} onOpenChange={setOpen}>
<DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
<DialogHeader><DialogTitle>{editing?.id ? "Edit Promotion" : "New Promotion"}</DialogTitle></DialogHeader>
{editing && (
<div className="space-y-4 pt-2">
<div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Title *</label><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Description</label><textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} className={inputCls} /></div>
<div className="grid grid-cols-2 gap-4">
<div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Coupon Code</label><input value={editing.coupon_code} onChange={(e) => setEditing({ ...editing, coupon_code: e.target.value })} className={inputCls} placeholder="BKASHDOM" /></div>
<div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Sort Order</label><input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: e.target.value })} className={inputCls} /></div>
</div>
<div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Discount Text</label><input value={editing.discount_text} onChange={(e) => setEditing({ ...editing, discount_text: e.target.value })} className={inputCls} placeholder="Up to 15% off" /></div>
<ImagePicker 
  label="Image *" 
  value={editing.image_url} 
  onChange={(url) => setEditing({ ...editing, image_url: url })} 
/>
<label className="flex items-center gap-2 text-sm font-medium dark:text-white cursor-pointer"><input type="checkbox" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4 accent-[#D35400]" /> Active</label>
<div className="flex gap-3 pt-4 border-t">
<Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 flex-1">{saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> {editing.id ? "Update" : "Create"}</>}</Button>
<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
</div>
</div>
)}
</DialogContent>
</Dialog>
</div>
);
}
