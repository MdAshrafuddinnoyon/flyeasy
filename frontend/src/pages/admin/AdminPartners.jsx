import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { name: "", logo_url: "", active: true, sort_order: 0 };

export default function AdminPartners() {
  const [items, setItems] = useState([]);
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
      const data = await Entities.partners.list();
      setItems(data.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ["id", "name", "active", "sort_order"];
    const csvContent = [
      headers.join(","),
      ...items.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "partners_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = items.filter((i) => !search || i.name?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (i) => { setEditing({ ...EMPTY, ...i }); setOpen(true); };

  const handleSave = async () => {
    if (!editing.name) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        await Entities.partners.update(editing.id, editing);
        toast({ title: "Updated" });
      } else {
        await Entities.partners.create(editing);
        toast({ title: "Created" });
      }
      setOpen(false);
      load();
    } catch (e) {
      toast({ title: "Error saving", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (i) => {
    if (!confirm(`Delete ${i.name}?`)) return;
    try {
      await Entities.partners.remove(i.id);
      toast({ title: "Deleted" });
      load();
    } catch (e) {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Partners</h1>
          <p className="text-slate-500">Manage partnership logos shown on the homepage.</p>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add New Partner</Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search partners..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
          />
        </div>
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
          <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 mb-4">No partners found.</p>
          <Button onClick={openNew} variant="outline">Add your first partner</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentItems.map((r) => (
              <div key={r.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 group relative text-center shadow-sm">
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-deep-space dark:text-white"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(r)} className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600"><Trash2 size={14} /></button>
                </div>
                {r.logo_url ? (
                  <img src={r.logo_url} alt={r.name} className="h-16 mx-auto mb-3 object-contain" />
                ) : (
                  <div className="h-16 bg-slate-100 dark:bg-slate-800 rounded-xl mx-auto mb-3 flex items-center justify-center text-xs text-slate-400">No Image</div>
                )}
                <div className="font-bold text-deep-space dark:text-white">{r.name}</div>
                {!r.active && <div className="text-xs text-red-500 mt-1">Inactive</div>}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit Partner" : "New Partner"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4 pt-2">
              <div><label className="text-sm mb-1 block">Name *</label><input value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})} className={inputCls} /></div>
              
              <div>
                <ImagePicker 
                  label="Logo Image" 
                  value={editing.logo_url || ""} 
                  onChange={(url) => setEditing({...editing, logo_url: url})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block">Sort Order</label><input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing, sort_order: Number(e.target.value)})} className={inputCls} /></div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="active" checked={editing.active} onChange={e=>setEditing({...editing, active: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="active" className="text-sm">Active (Show on site)</label>
                </div>
              </div>
              <div className="flex gap-3 pt-4"><Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving..." : "Save Partner"}</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
