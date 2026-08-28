import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Loader2, Star, Download } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { name: "", trip: "", text: "", rating: 5, active: true, avatar_url: "", video_url: "" };

export default function AdminTestimonials() {
  const [reviews, setReviews] = useState([]);
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
    try {
      const data = await Entities.testimonials.list();
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleExportCSV = () => {
    if (reviews.length === 0) return;
    const headers = ["id", "name", "trip", "text", "rating", "active"];
    const csvContent = [
      headers.join(","),
      ...reviews.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "testimonials_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = reviews.filter((r) => 
    !search || 
    r.name?.toLowerCase().includes(search.toLowerCase()) || 
    r.text?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (r) => { setEditing({ ...EMPTY, ...r }); setOpen(true); };

  const handleSave = async () => {
    if (!editing.name || !editing.text) {
      toast({ title: "Name and review text are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = { ...editing, rating: Number(editing.rating) || 5 };
      if (editing.id) {
        await Entities.testimonials.update(editing.id, payload);
        toast({ title: "Review updated" });
      } else {
        await Entities.testimonials.create(payload);
        toast({ title: "Review created" });
      }
      setOpen(false);
      load();
    } catch (e) {
      toast({ title: "Error saving review", variant: "destructive" });
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (r) => {
    if (!confirm(`Delete review from "${r.name}"?`)) return;
    try {
      await Entities.testimonials.remove(r.id);
      toast({ title: "Review deleted" });
      load();
    } catch (e) {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Homepage Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{reviews.length} reviews total</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90">
          <Plus size={18} /> Add Review
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search reviews..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
          />
        </div>
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
          <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentItems.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float p-5 group relative">
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-deep-space hover:bg-slate-200 dark:hover:bg-slate-700 dark:text-white">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(r)} className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40">
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-deep-space dark:text-white">{Number(r.rating || 5).toFixed(1)}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: Math.round(r.rating || 5) }).map((_, j) => (
                      <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {!r.active && <span className="ml-auto text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-md uppercase">Hidden</span>}
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">"{r.text}"</p>
                
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {r.avatar_url ? (
                    <img src={r.avatar_url} alt={r.name} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-xs">
                      {r.name?.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xs text-deep-space dark:text-white">{r.name}</div>
                    <div className="text-[10px] text-slate-500">{r.trip || "Traveler"}</div>
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
          <p className="text-slate-500 dark:text-slate-400 mb-4">No reviews found.</p>
          <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add Review</Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Review" : "New Review"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-deep-space mb-1.5 block">Reviewer Name *</label>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="text-sm mb-1 block">Role / Company (or Trip)</label>
                  <input value={editing.trip || ""} onChange={e => setEditing({...editing, trip: e.target.value})} className={inputCls} placeholder="e.g. COO, blackstar.com" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-deep-space mb-1.5 block">Review Text *</label>
                <textarea rows={4} value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-deep-space mb-1.5 block">Rating (1-5)</label>
                  <input type="number" min="1" max="5" step="0.5" value={editing.rating} onChange={(e) => setEditing({ ...editing, rating: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className="text-sm font-medium text-deep-space mb-1.5 block">Video URL (Optional)</label>
                  <input value={editing.video_url || ""} onChange={(e) => setEditing({ ...editing, video_url: e.target.value })} className={inputCls} placeholder="MP4 or YouTube URL" />
                </div>
              </div>
              <div>
                  <ImagePicker 
                    label="Avatar URL (Optional)" 
                    value={editing.avatar_url || ""} 
                    onChange={(url) => setEditing({ ...editing, avatar_url: url })} 
                  />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="active" checked={editing.active} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4 accent-primary" />
                <label htmlFor="active" className="text-sm font-medium cursor-pointer">Visible on Homepage</label>
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 flex-1">
                  {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Review</>}
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
