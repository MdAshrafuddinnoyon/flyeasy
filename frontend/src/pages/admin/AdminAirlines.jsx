import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Upload, Loader2, Plane, Download } from "lucide-react";
import { Entities, Utils } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { name: "", code: "", logo_url: "", country: "Bangladesh", active: true, sort_order: 0 };

export default function AdminAirlines() {
  const [airlines, setAirlines] = useState([]);
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
    try { setAirlines(await Entities.airlines.list()); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleExportCSV = () => {
    if (airlines.length === 0) return;
    const headers = ["id", "name", "code", "country", "active", "sort_order"];
    const csvContent = [
      headers.join(","),
      ...airlines.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "airlines_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = airlines.filter((a) => !search || a.name?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (a) => { setEditing({ ...EMPTY, ...a }); setOpen(true); };

  const handleSave = async () => {
    if (!editing.name) { toast({ title: "Name is required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const payload = { ...editing, sort_order: Number(editing.sort_order) || 0 };
      if (editing.id) { await Entities.airlines.update(editing.id, payload); toast({ title: "Airline updated" }); }
      else { await Entities.airlines.create(payload); toast({ title: "Airline created" }); }
      setOpen(false); load();
    } catch (e) { toast({ title: "Error saving", variant: "destructive" }); } finally { setSaving(false); }
  };

  const handleDelete = async (a) => {
    if (!confirm(`Delete "${a.name}"?`)) return;
    try { await Entities.airlines.remove(a.id); toast({ title: "Airline deleted" }); load(); }
    catch (e) { toast({ title: "Error deleting", variant: "destructive" }); }
  };



  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div><h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Airlines</h1><p className="text-slate-500 dark:text-slate-400 mt-1">{airlines.length} airlines total</p></div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90"><Plus size={18} /> Add Airline</Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search airlines..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
          />
        </div>
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
          <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{[...Array(8)].map((_, i) => <div key={i} className="h-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}</div>
      ) : filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentItems.map((a) => (
              <div key={a.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float p-5 text-center relative group">
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(a)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-deep-space dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"><Pencil size={13} /></button>
                  <button onClick={() => handleDelete(a)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"><Trash2 size={13} /></button>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  {a.logo_url ? <img src={a.logo_url} alt={a.name} className="w-full h-full object-contain" /> : <Plane size={24} className="text-primary" />}
                </div>
                <div className="font-semibold text-deep-space dark:text-white text-sm">{a.name}</div>
                {a.code && <div className="text-xs text-slate-500 dark:text-slate-400">{a.code}</div>}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 mb-4">No airlines yet.</p>
          <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add airline</Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Airline" : "New Airline"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4 pt-2">
              <div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Name *</label><input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} /></div>
              <div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Code</label><input value={editing.code} onChange={(e) => setEditing({ ...editing, code: e.target.value })} className={inputCls} placeholder="BG" /></div>
              <div><label className="text-sm font-medium text-deep-space dark:text-slate-300 mb-1.5 block">Country</label><input value={editing.country} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className={inputCls} /></div>
              <div>
                <ImagePicker 
                  label="Logo URL" 
                  value={editing.logo_url || ""} 
                  onChange={(url) => setEditing({...editing, logo_url: url})} 
                />
              </div>
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



