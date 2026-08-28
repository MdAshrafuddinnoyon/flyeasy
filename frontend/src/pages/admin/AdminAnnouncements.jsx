import React, { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, Power, Search, Download } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/admin/Pagination";

export default function AdminAnnouncements() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", message: "", type: "info", link_url: "", active: true });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const load = async () => {
    try { setItems(await Entities.announcements.list()); }
    catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const filtered = items.filter((a) => 
    !search || 
    a.title?.toLowerCase().includes(search.toLowerCase()) || 
    a.message?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    if (items.length === 0) return;
    const headers = ["id", "title", "message", "type", "link_url", "active"];
    const csvContent = [
      headers.join(","),
      ...items.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "announcements_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const create = async (e) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast({ title: "Title and message required", variant: "destructive" }); return; }
    setSaving(true);
    try {
      await Entities.announcements.create(form);
      toast({ title: "Announcement published." });
      setForm({ title: "", message: "", type: "info", link_url: "", active: true });
      load();
    } catch (err) { toast({ title: "Failed to publish.", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const toggle = async (a) => { await Entities.announcements.update(a.id, { active: !a.active }); load(); };
  const remove = async (a) => { if (confirm("Delete this announcement?")) { await Entities.announcements.remove(a.id); load(); } };

  const typeColor = { info: "bg-sky-100 text-sky-700", success: "bg-emerald-100 text-emerald-700", warning: "bg-amber-100 text-amber-700" };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Announcements</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Broadcast real-time announcements to all clients.</p>
      </div>

      <form onSubmit={create} className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-5 sm:p-6 mb-8 max-w-3xl border border-slate-100 dark:border-slate-800">
        <h2 className="font-bold text-deep-space dark:text-white mb-4">New Announcement</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input">
            <option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option>
          </select>
          <textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={2} className="input sm:col-span-2" />
          <input placeholder="Link URL (optional)" value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="input sm:col-span-2" />
          <label className="flex items-center gap-2 text-sm text-deep-space dark:text-slate-300 sm:col-span-2">
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-primary" /> Active (show to clients now)
          </label>
        </div>
        <button type="submit" disabled={saving} className="mt-4 inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 disabled:opacity-60">
          <Plus size={16} /> {saving ? "Publishing…" : "Publish"}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search announcements..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
          />
        </div>
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
          <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {loading ? <div className="text-slate-400"><Loader2 className="animate-spin inline" /></div> : items.length === 0 ? (
        <p className="text-slate-400">No announcements yet.</p>
      ) : (
        <>
          <div className="space-y-3">
            {currentItems.map((a) => (
            <div key={a.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-float p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${typeColor[a.type]}`}>{a.type}</span>
                  {!a.active && <span className="text-xs text-slate-400">Inactive</span>}
                </div>
                <div className="font-semibold text-deep-space dark:text-white">{a.title}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{a.message}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggle(a)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title={a.active ? "Deactivate" : "Activate"}>
                  <Power size={16} className={a.active ? "text-emerald-600 dark:text-emerald-500" : "text-slate-400 dark:text-slate-600"} />
                </button>
                <button onClick={() => remove(a)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10" title="Delete">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
        </>
      )}
    </div>
  );
}


