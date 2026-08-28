import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Loader2, Upload } from "lucide-react";
import { Entities, Utils } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImagePicker from "@/components/admin/ImagePicker";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { name: "", image_url: "", type: "partner", active: true, sort_order: 0 };

export default function AdminCerts() {
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
      const data = await Entities.certifications.list();
      setItems(data.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

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
        await Entities.certifications.update(editing.id, editing);
        toast({ title: "Updated" });
      } else {
        await Entities.certifications.create(editing);
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
      await Entities.certifications.remove(i.id);
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
          <h1 className="text-2xl sm:text-3xl font-bold">Partners & Certifications</h1>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add New</Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          value={search} 
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
          placeholder="Search..." 
          className={inputCls + " pl-11"} 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentItems.map((r) => (
          <div key={r.id} className="bg-white border rounded-3xl p-5 group relative text-center">
            <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-deep-space"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(r)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600"><Trash2 size={14} /></button>
            </div>
            {r.image_url ? (
              <img src={r.image_url} alt={r.name} className="h-16 mx-auto mb-3 object-contain" />
            ) : (
              <div className="h-16 bg-slate-100 mx-auto mb-3 flex items-center justify-center text-xs">No Image</div>
            )}
            <div className="font-bold">{r.name}</div>
            <div className="text-sm text-slate-500 capitalize">{r.type}</div>
          </div>
        ))}
      </div>
      
      {filtered.length > 0 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block">Name *</label><input value={editing.name} onChange={e=>setEditing({...editing, name: e.target.value})} className={inputCls} /></div>
                <div>
                  <label className="text-sm mb-1 block">Type</label>
                  <select value={editing.type} onChange={e=>setEditing({...editing, type: e.target.value})} className={inputCls}>
                    <option value="partner">Partner</option>
                    <option value="certification">Certification (A4)</option>
                    <option value="award">Award / Recognition</option>
                  </select>
                </div>
              </div>
              <div>
                <ImagePicker 
                  label="Logo Image" 
                  value={editing.image_url || ""} 
                  onChange={(url) => setEditing({...editing, image_url: url})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block">Sort Order</label><input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing, sort_order: Number(e.target.value)})} className={inputCls} /></div>
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="active" checked={editing.active} onChange={e=>setEditing({...editing, active: e.target.checked})} className="w-4 h-4" />
                  <label htmlFor="active" className="text-sm">Active</label>
                </div>
              </div>
              <div className="flex gap-3 pt-4"><Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving..." : "Save"}</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
