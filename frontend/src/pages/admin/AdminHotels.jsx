import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, Save, Upload, Loader2, Star, Download } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Entities, Utils } from "@/lib/api";
import { Image as UIImage } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { name: "", location: "", city: "", star_rating: 5, price_per_night: 0, image_url: "", gallery: [], amenities: [], description: "", reviews_count: 0, rating: 4.5, featured: false, available: true };

export default function AdminHotels() {
const [hotels, setHotels] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [editing, setEditing] = useState(null);
const [open, setOpen] = useState(false);
const [saving, setSaving] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 8;
const { toast } = useToast();

const load = async () => {
setLoading(true);
try {
setHotels(await Entities.hotels.list());
} catch (e) { console.error(e); } finally { setLoading(false); }
};

useEffect(() => { load(); }, []);

const handleExportCSV = () => {
  if (hotels.length === 0) return;
  const headers = ["id", "name", "location", "city", "star_rating", "price_per_night", "rating", "reviews_count", "featured", "available"];
  const csvContent = [
    headers.join(","),
    ...hotels.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "hotels_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filtered = hotels.filter((h) => !search || h.name?.toLowerCase().includes(search.toLowerCase()) || h.location?.toLowerCase().includes(search.toLowerCase()));

const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
const openEdit = (h) => { setEditing({ ...EMPTY, ...h }); setOpen(true); };

const handleSave = async () => {
if (!editing.name || !editing.location || !editing.price_per_night || !editing.image_url) {
toast({ title: "Name, location, price and image are required", variant: "destructive" });
return;
}
setSaving(true);
try {
const payload = { ...editing, price_per_night: Number(editing.price_per_night), star_rating: Number(editing.star_rating) || 5, rating: Number(editing.rating) || 0, reviews_count: Number(editing.reviews_count) || 0 };
if (editing.id) {
await Entities.hotels.update(editing.id, payload);
toast({ title: "Hotel updated" });
} else {
await Entities.hotels.create(payload);
toast({ title: "Hotel created" });
}
setOpen(false); load();
} catch (e) { toast({ title: "Error saving", variant: "destructive" }); } finally { setSaving(false); }
};

const handleDelete = async (h) => {
if (!confirm(`Delete "${h.name}"?`)) return;
try { await Entities.hotels.remove(h.id); toast({ title: "Hotel deleted" }); load(); }
catch (e) { toast({ title: "Error deleting", variant: "destructive" }); }
};


const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";

return (
<div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
<div>
<h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Hotels & Resorts</h1>
<p className="text-slate-500 dark:text-slate-400 mt-1">{hotels.length} hotels total</p>
</div>
<Button onClick={openNew} className="bg-primary hover:bg-primary/90"><Plus size={18} /> Add Hotel</Button>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  <div className="relative flex-1 w-full sm:max-w-md">
    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input 
      value={search} 
      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
      placeholder="Search hotels..." 
      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
    />
  </div>
  <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
    <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
  </button>
</div>

{loading ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{[...Array(8)].map((_, i) => <div key={i} className="h-56 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}
</div>
) : filtered.length > 0 ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
{currentItems.map((h) => (
<div key={h.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float overflow-hidden group">
<div className="relative h-36">
{h.image_url ? <UIImage src={h.image_url} alt={h.name} fittingType="fill" className="w-full h-full" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />}
<div className="absolute top-3 right-3 flex gap-1.5">
<button onClick={() => openEdit(h)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-deep-space hover:bg-white dark:hover:bg-slate-800 dark:text-white"><Pencil size={15} /></button>
<button onClick={() => handleDelete(h)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-red-600 hover:bg-white dark:hover:bg-slate-800"><Trash2 size={15} /></button>
</div>
{!h.available && <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Hidden</div>}
</div>
<div className="p-4">
<div className="flex items-center gap-1 mb-1"><Star size={13} className="fill-amber-400 text-amber-400" /><span className="text-xs font-semibold dark:text-white">{h.rating}</span><span className="text-xs text-slate-400">· {h.star_rating}★</span></div>
<h3 className="font-bold text-deep-space dark:text-white text-sm line-clamp-1">{h.name}</h3>
<p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{h.location}</p>
<div className="text-lg font-bold text-deep-space dark:text-white mt-2">৳{h.price_per_night?.toLocaleString()}<span className="text-xs font-normal text-slate-500 dark:text-slate-400">/night</span></div>
</div>
</div>
))}
</div>
) : (
<div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
<p className="text-slate-500 dark:text-slate-400 mb-4">No hotels yet.</p>
<Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add your first hotel</Button>
</div>
)}

{filtered.length > 0 && (
  <div className="mt-8 bg-white dark:bg-slate-900 rounded-3xl shadow-float border border-slate-100 dark:border-slate-800">
    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
  </div>
)}

<Dialog open={open} onOpenChange={setOpen}>
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
<DialogHeader><DialogTitle>{editing?.id ? "Edit Hotel" : "New Hotel"}</DialogTitle></DialogHeader>
{editing && (
<div className="space-y-4 pt-2">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">Name *</label><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">City</label><input value={editing.city} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">Location *</label><input value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">Price/Night (৳) *</label><input type="number" value={editing.price_per_night} onChange={(e) => setEditing({ ...editing, price_per_night: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">Star Rating</label><input type="number" min="1" max="5" value={editing.star_rating} onChange={(e) => setEditing({ ...editing, star_rating: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">Guest Rating</label><input type="number" step="0.1" max="5" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} className={inputCls} /></div>
<div><label className="text-sm font-medium text-deep-space mb-1.5 block">Reviews Count</label><input type="number" value={editing.reviews_count} onChange={(e) => setEditing({ ...editing, reviews_count: e.target.value })} className={inputCls} /></div>
</div>
<div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Description</label><ReactQuill theme="snow" value={editing.description} onChange={(val) => setEditing({ ...editing, description: val })} className="bg-white dark:bg-slate-900 rounded-xl" /></div>
<ImagePicker 
  label="Image *" 
  value={editing.image_url} 
  onChange={(url) => setEditing({ ...editing, image_url: url })} 
/>
<AmenitiesEditor amenities={editing.amenities} onChange={(amenities) => setEditing({ ...editing, amenities })} />
<div className="flex items-center gap-6">
<label className="flex items-center gap-2 text-sm font-medium dark:text-white cursor-pointer"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-[#D35400]" /> Featured</label>
<label className="flex items-center gap-2 text-sm font-medium dark:text-white cursor-pointer"><input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} className="w-4 h-4 accent-[#D35400]" /> Available</label>
</div>
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

function AmenitiesEditor({ amenities, onChange }) {
const [text, setText] = useState("");
const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";
return (
<div>
<label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Amenities</label>
<div className="flex gap-2">
<input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { e.preventDefault(); onChange([...(amenities || []), text.trim()]); setText(""); } }} placeholder="e.g. Free WiFi" className={inputCls} />
<button type="button" onClick={() => { if (text.trim()) { onChange([...(amenities || []), text.trim()]); setText(""); } }} className="px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white"><Plus size={16} /></button>
</div>
<div className="flex flex-wrap gap-2 mt-2">
{(amenities || []).map((a, i) => (
<span key={i} className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-deep-space dark:text-white text-sm px-3 py-1.5 rounded-full">{a}<button onClick={() => onChange(amenities.filter((_, idx) => idx !== i))}><X size={13} /></button></span>
))}
</div>
</div>
);
}



