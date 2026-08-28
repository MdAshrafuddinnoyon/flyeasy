import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Loader2, Code, Layout as LayoutIcon } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Pagination from "@/components/admin/Pagination";

const EMPTY = { title: "", slug: "", content: "", status: "published" };

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState("visual");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await Entities.pages.list();
      setPages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = pages.filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (p) => { setEditing({ ...EMPTY, ...p }); setOpen(true); };

  const handleSave = async () => {
    if (!editing.title || !editing.slug) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        await Entities.pages.update(editing.id, editing);
        toast({ title: "Page updated" });
      } else {
        await Entities.pages.create(editing);
        toast({ title: "Page created" });
      }
      setOpen(false);
      load();
    } catch (e) {
      toast({ title: "Error saving page", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await Entities.pages.remove(p.id);
      toast({ title: "Page deleted" });
      load();
    } catch (e) {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Custom Pages</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage dynamic pages like Terms & Conditions</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90"><Plus size={18} /> Add Page</Button>
      </div>

      <div className="relative mb-6 max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search pages..." className={inputCls + " pl-11"} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="space-y-3">
            {currentItems.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-bold text-deep-space dark:text-white text-lg">{p.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                    <span>/p/{p.slug}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-deep-space dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(p)} className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 size={18} /></button>
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
          <p className="text-slate-500 dark:text-slate-400 mb-4">No custom pages yet.</p>
          <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Create your first page</Button>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Page" : "New Page"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-deep-space dark:text-white mb-2 block">Page Title *</label>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} placeholder="e.g. Terms & Conditions" />
                </div>
                <div>
                  <label className="text-sm font-medium text-deep-space dark:text-white mb-2 block">URL Slug *</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-r-0 border-border dark:border-slate-800 rounded-l-xl text-sm text-slate-500">/p/</span>
                    <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls + " rounded-l-none"} placeholder="terms-and-conditions" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-deep-space dark:text-white">Page Content (HTML/CSS Supported)</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button onClick={() => setEditorMode('visual')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${editorMode === 'visual' ? 'bg-white dark:bg-slate-700 shadow text-deep-space dark:text-white' : 'text-slate-500 hover:text-deep-space dark:hover:text-white'}`}>
                      <LayoutIcon size={14} /> Visual
                    </button>
                    <button onClick={() => setEditorMode('raw')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${editorMode === 'raw' ? 'bg-white dark:bg-slate-700 shadow text-deep-space dark:text-white' : 'text-slate-500 hover:text-deep-space dark:hover:text-white'}`}>
                      <Code size={14} /> Raw HTML
                    </button>
                  </div>
                </div>
                
                {editorMode === 'visual' ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800">
                    <ReactQuill theme="snow" value={editing.content} onChange={(val) => setEditing({ ...editing, content: val })} className="h-[400px]" />
                  </div>
                ) : (
                  <textarea 
                    value={editing.content} 
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })} 
                    rows={15} 
                    className={inputCls + " font-mono text-sm"} 
                    placeholder="<div class='custom-style'>\n  <h1>Raw HTML rules!</h1>\n</div>" 
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-deep-space dark:text-white mb-2 block">Status</label>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className={inputCls}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border dark:border-slate-800">
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 flex-1 py-6">
                  {saving ? <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</> : <><Save size={18} className="mr-2" /> Save Page</>}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)} className="py-6">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
