import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, Star, Save, Upload, Loader2, Download } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Entities, Utils } from "@/lib/api";
import { Image as UIImage } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import MediaManagerModal from "@/components/admin/MediaManagerModal";
import Pagination from "@/components/admin/Pagination";

const EMPTY = {
title: "",
slug: "",
destination: "",
country: "Bangladesh",
short_description: "",
description: "",
price: 0,
original_price: 0,
duration_days: 3,
image_url: "",
gallery: [],
itinerary: [],
inclusions: [],
exclusions: [],
category: "Beach",
featured: false,
rating: 4.5,
reviews_count: 0,
available: true,
max_travelers: 10,
};

const CATEGORIES = ["Beach", "Mountain", "City", "Adventure", "Honeymoon", "Family", "International"];

export default function AdminPackages() {
const [packages, setPackages] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [editing, setEditing] = useState(null);
const [open, setOpen] = useState(false);
const [saving, setSaving] = useState(false);
const [galleryModalOpen, setGalleryModalOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const ITEMS_PER_PAGE = 10;
const { toast } = useToast();

const load = async () => {
setLoading(true);
try {
const data = await Entities.packages.list();
setPackages(data);
} catch (e) {
console.error(e);
} finally {
setLoading(false);
}
};

useEffect(() => { load(); }, []);

const handleExportCSV = () => {
  if (packages.length === 0) return;
  const headers = ["id", "title", "slug", "destination", "country", "category", "price", "duration_days", "rating", "reviews_count", "featured", "available"];
  const csvContent = [
    headers.join(","),
    ...packages.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
  ].join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "packages_export.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filtered = packages.filter((p) => !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.destination?.toLowerCase().includes(search.toLowerCase()));

const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
const openEdit = (pkg) => { setEditing({ ...EMPTY, ...pkg }); setOpen(true); };

const handleSave = async () => {
if (!editing.title || !editing.destination || !editing.price || !editing.image_url) {
toast({ title: "Title, destination, price and image are required", variant: "destructive" });
return;
}
setSaving(true);
try {
const payload = { ...editing, price: Number(editing.price), original_price: Number(editing.original_price) || 0, duration_days: Number(editing.duration_days) || 1, rating: Number(editing.rating) || 0, reviews_count: Number(editing.reviews_count) || 0, max_travelers: Number(editing.max_travelers) || 1 };
if (editing.id) {
await Entities.packages.update(editing.id, payload);
toast({ title: "Package updated" });
} else {
await Entities.packages.create(payload);
toast({ title: "Package created" });
}
setOpen(false);
load();
} catch (e) {
toast({ title: "Error saving package", variant: "destructive" });
console.error(e);
} finally {
setSaving(false);
}
};

const handleDelete = async (pkg) => {
if (!confirm(`Delete "${pkg.title}"? This cannot be undone.`)) return;
try {
await Entities.packages.remove(pkg.id);
toast({ title: "Package deleted" });
load();
} catch (e) {
toast({ title: "Error deleting", variant: "destructive" });
}
};



return (
<div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
<div>
<h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Holiday Packages</h1>
<p className="text-slate-500 dark:text-slate-400 mt-1">{packages.length} packages total</p>
</div>
<Button onClick={openNew} className="bg-primary hover:bg-primary/90">
<Plus size={18} /> Add Package
</Button>
</div>

<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
  <div className="relative flex-1 w-full sm:max-w-md">
    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
    <input 
      value={search} 
      onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
      placeholder="Search packages..." 
      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
    />
  </div>
  <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
    <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
  </button>
</div>

{loading ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}
</div>
) : filtered.length > 0 ? (
<>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{currentItems.map((pkg) => (
<div key={pkg.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float overflow-hidden group">
<div className="relative h-40">
{pkg.image_url ? <UIImage src={pkg.image_url} alt={pkg.title} fittingType="fill" className="w-full h-full" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-800" />}
<div className="absolute top-3 left-3 flex gap-2">
{!!pkg.featured && <span className="bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">Featured</span>}
{!pkg.available && <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Hidden</span>}
</div>
<div className="absolute top-3 right-3 flex gap-1.5">
<button onClick={() => openEdit(pkg)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-deep-space hover:bg-white dark:hover:bg-slate-800 dark:text-white">
<Pencil size={15} />
</button>
<button onClick={() => handleDelete(pkg)} className="w-9 h-9 rounded-full glass flex items-center justify-center text-red-600 hover:bg-white dark:hover:bg-slate-800">
<Trash2 size={15} />
</button>
</div>
</div>
<div className="p-4">
<div className="flex items-center gap-1 mb-1">
<Star size={13} className="fill-amber-400 text-amber-400" />
<span className="text-xs font-semibold text-deep-space dark:text-white">{pkg.rating || 0}</span>
<span className="text-xs text-slate-400">· {pkg.category}</span>
</div>
<h3 className="font-bold text-deep-space dark:text-white text-sm line-clamp-1">{pkg.title}</h3>
<p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{pkg.destination}</p>
<div className="flex items-center justify-between mt-3 pt-3 border-t border-border dark:border-slate-800">
<div className="text-lg font-bold text-deep-space dark:text-white">৳{pkg.price?.toLocaleString()}</div>
<span className="text-xs text-slate-500 dark:text-slate-400">{pkg.duration_days}D</span>
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
<p className="text-slate-500 dark:text-slate-400 mb-4">No packages yet.</p>
<Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add your first package</Button>
</div>
)}

<Dialog open={open} onOpenChange={setOpen}>
<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
<DialogHeader>
<DialogTitle>{editing?.id ? "Edit Package" : "New Package"}</DialogTitle>
</DialogHeader>
{editing && (
<div className="space-y-5 pt-2">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<Field label="Title *"><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} /></Field>
<Field label="Destination *"><input value={editing.destination} onChange={(e) => setEditing({ ...editing, destination: e.target.value })} className={inputCls} /></Field>
<Field label="Country"><input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className={inputCls} /></Field>
<Field label="Category">
<select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inputCls}>
{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
</select>
</Field>
<Field label="Price (৳) *"><input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} className={inputCls} /></Field>
<Field label="Original Price (৳)"><input type="number" value={editing.original_price} onChange={(e) => setEditing({ ...editing, original_price: e.target.value })} className={inputCls} /></Field>
<Field label="Duration (days)"><input type="number" value={editing.duration_days} onChange={(e) => setEditing({ ...editing, duration_days: e.target.value })} className={inputCls} /></Field>
<Field label="Max Travelers"><input type="number" value={editing.max_travelers} onChange={(e) => setEditing({ ...editing, max_travelers: e.target.value })} className={inputCls} /></Field>
<Field label="Rating (0-5)"><input type="number" step="0.1" max="5" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} className={inputCls} /></Field>
<Field label="Reviews Count"><input type="number" value={editing.reviews_count} onChange={(e) => setEditing({ ...editing, reviews_count: e.target.value })} className={inputCls} /></Field>
</div>

<Field label="Short Description"><textarea rows="2" value={editing.short_description} onChange={(e) => setEditing({ ...editing, short_description: e.target.value })} className={inputCls} placeholder="One-line summary" /></Field>
<Field label="Full Description"><ReactQuill theme="snow" value={editing.description} onChange={(val) => setEditing({ ...editing, description: val })} className="bg-white dark:bg-slate-900 rounded-xl" /></Field>

<ImagePicker 
  label="Main Image URL *" 
  value={editing.image_url} 
  onChange={(url) => setEditing({ ...editing, image_url: url })} 
/>

<Field label="Gallery Images">
<div className="flex flex-wrap gap-2 mb-2">
{(editing.gallery || []).map((g, i) => (
<div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
<img src={g} alt="" className="w-full h-full object-cover" />
<button onClick={() => setEditing({ ...editing, gallery: editing.gallery.filter((_, idx) => idx !== i) })} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"><X size={16} /></button>
</div>
))}
<button type="button" onClick={() => setGalleryModalOpen(true)} className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary flex items-center justify-center cursor-pointer text-slate-400 hover:text-primary">
<Plus size={20} />
</button>
</div>
<MediaManagerModal 
  open={galleryModalOpen} 
  onOpenChange={setGalleryModalOpen} 
  onSelect={(url) => setEditing({ ...editing, gallery: [...(editing.gallery || []), url] })} 
/>
</Field>

<ListEditor label="Inclusions" items={editing.inclusions} onChange={(inclusions) => setEditing({ ...editing, inclusions })} placeholder="e.g. All meals included" />
<ListEditor label="Exclusions" items={editing.exclusions} onChange={(exclusions) => setEditing({ ...editing, exclusions })} placeholder="e.g. Personal expenses" />

<ItineraryEditor itinerary={editing.itinerary} onChange={(itinerary) => setEditing({ ...editing, itinerary })} />

<div className="flex items-center gap-6">
<label className="flex items-center gap-2 text-sm font-medium text-deep-space dark:text-white cursor-pointer">
<input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-[#D35400]" />
Featured
</label>
<label className="flex items-center gap-2 text-sm font-medium text-deep-space dark:text-white cursor-pointer">
<input type="checkbox" checked={editing.available} onChange={(e) => setEditing({ ...editing, available: e.target.checked })} className="w-4 h-4 accent-[#D35400]" />
Available
</label>
</div>

<div className="flex gap-3 pt-4 border-t">
<Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 flex-1">
{saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> {editing.id ? "Update" : "Create"} Package</>}
</Button>
<Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
</div>
</div>
)}
</DialogContent>
</Dialog>
</div>
);
}

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";

function Field({ label, children }) {
return (
<div>
<label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">{label}</label>
{children}
</div>
);
}

function ListEditor({ label, items, onChange, placeholder }) {
const [text, setText] = useState("");
return (
<Field label={label}>
<div className="flex gap-2">
<input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { e.preventDefault(); onChange([...(items || []), text.trim()]); setText(""); } }} placeholder={placeholder} className={inputCls} />
<button type="button" onClick={() => { if (text.trim()) { onChange([...(items || []), text.trim()]); setText(""); } }} className="px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white"><Plus size={16} /></button>
</div>
<div className="flex flex-wrap gap-2 mt-2">
{(items || []).map((item, i) => (
<span key={i} className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-deep-space dark:text-white text-sm px-3 py-1.5 rounded-full">
{item}
<button onClick={() => onChange(items.filter((_, idx) => idx !== i))}><X size={13} /></button>
</span>
))}
</div>
</Field>
);
}

function ItineraryEditor({ itinerary, onChange }) {
const items = itinerary || [];
const add = () => onChange([...items, { day: items.length + 1, title: "", description: "" }]);
const update = (i, field, val) => onChange(items.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
const remove = (i) => onChange(items.filter((_, idx) => idx !== i));

return (
<Field label="Itinerary">
<div className="space-y-3">
{items.map((it, i) => (
<div key={i} className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
<div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold shrink-0">{it.day || i + 1}</div>
<div className="flex-1 space-y-2">
<input value={it.title} onChange={(e) => update(i, "title", e.target.value)} placeholder="Day title" className={inputCls} />
<textarea value={it.description} onChange={(e) => update(i, "description", e.target.value)} placeholder="Description" rows={2} className={inputCls} />
</div>
<button onClick={() => remove(i)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-lg"><Trash2 size={16} /></button>
</div>
))}
<button type="button" onClick={add} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-primary text-slate-500 dark:text-slate-400 hover:text-primary text-sm font-medium flex items-center justify-center gap-2">
<Plus size={16} /> Add Day
</button>
</div>
</Field>
);
}



