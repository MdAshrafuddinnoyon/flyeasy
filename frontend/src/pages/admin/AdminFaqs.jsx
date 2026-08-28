import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { question: "", answer: "", category: "General", active: true, sort_order: 0 };

export default function AdminFaqs() {
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
      const data = await Entities.faqs.list();
      setItems(data.sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => !search || i.question?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (i) => { setEditing({ ...EMPTY, ...i }); setOpen(true); };

  const handleSave = async () => {
    if (!editing.question || !editing.answer) {
      toast({ title: "Question and answer are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        await Entities.faqs.update(editing.id, editing);
        toast({ title: "Updated" });
      } else {
        await Entities.faqs.create(editing);
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
    if (!confirm(`Delete FAQ?`)) return;
    try {
      await Entities.faqs.remove(i.id);
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
          <h1 className="text-2xl sm:text-3xl font-bold">FAQs</h1>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Add FAQ</Button>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {currentItems.map((r) => (
          <div key={r.id} className="bg-white border rounded-3xl p-5 relative">
            <div className="absolute top-4 right-4 flex gap-1.5">
              <button onClick={() => openEdit(r)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-deep-space"><Pencil size={14} /></button>
              <button onClick={() => handleDelete(r)} className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600"><Trash2 size={14} /></button>
            </div>
            <div className="font-bold text-lg mb-2 pr-20">{r.question}</div>
            <div className="text-sm text-slate-500 line-clamp-2 mb-2">{r.answer}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-slate-100 px-2 py-1 rounded">{r.category}</span>
              {!r.active && <span className="bg-red-100 text-red-600 px-2 py-1 rounded">Hidden</span>}
            </div>
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
          <DialogHeader><DialogTitle>{editing?.id ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4 pt-2">
              <div><label className="text-sm mb-1 block">Question *</label><input value={editing.question} onChange={e=>setEditing({...editing, question: e.target.value})} className={inputCls} /></div>
              <div><label className="text-sm mb-1 block">Answer *</label><textarea rows={4} value={editing.answer} onChange={e=>setEditing({...editing, answer: e.target.value})} className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm mb-1 block">Category</label><input value={editing.category} onChange={e=>setEditing({...editing, category: e.target.value})} className={inputCls} /></div>
                <div><label className="text-sm mb-1 block">Sort Order</label><input type="number" value={editing.sort_order} onChange={e=>setEditing({...editing, sort_order: Number(e.target.value)})} className={inputCls} /></div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="active" checked={editing.active} onChange={e=>setEditing({...editing, active: e.target.checked})} className="w-4 h-4" />
                <label htmlFor="active" className="text-sm">Active</label>
              </div>
              <div className="flex gap-3 pt-4"><Button onClick={handleSave} disabled={saving} className="flex-1">{saving ? "Saving..." : "Save"}</Button></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
