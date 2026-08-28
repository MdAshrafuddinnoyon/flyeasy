import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, X, Search, Download } from 'lucide-react';
import Pagination from './Pagination';

// Generic list+form admin panel for a simple entity. `fields` describes the
// editable columns: [{ key, label, type }]. Kept intentionally simple so
// each admin page is a thin config wrapper around this component.
export default function EntityTable({ title, queryKey, resource, fields, columns }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data = [], isLoading } = useQuery({ queryKey: [queryKey], queryFn: () => resource.list() });

  const saveMutation = useMutation({
    mutationFn: (item) => (item.id ? resource.update(item.id, item) : resource.create(item)),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [queryKey] }); setEditing(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => resource.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
  });

  const displayCols = columns || fields.slice(0, 4).map((f) => f.key);

  const filteredData = data.filter((row) => {
    if (!search) return true;
    return displayCols.some((col) => String(row[col] ?? '').toLowerCase().includes(search.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const currentItems = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(","),
      ...data.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" 
            />
          </div>
          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200" title="Export CSV">
            <Download size={16} /> <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => setEditing({})} className="flex items-center justify-center gap-2 bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90">
            <Plus size={16} /> <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-float overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              {displayCols.map((c) => <th key={c} className="p-3 font-semibold capitalize">{c.replace(/_/g, ' ')}</th>)}
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td className="p-3" colSpan={displayCols.length + 1}>Loading…</td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td className="p-3 text-center text-slate-500 py-6" colSpan={displayCols.length + 1}>No records found.</td></tr>
            ) : currentItems.map((row) => (
              <tr key={row.id} className="border-b last:border-0 hover:bg-slate-50/50">
                {displayCols.map((c) => <td key={c} className="p-3">{String(row[c] ?? '')}</td>)}
                <td className="p-3 flex gap-2 justify-end">
                  <button onClick={() => setEditing(row)} className="p-1.5 hover:bg-slate-100 rounded"><Pencil size={14} /></button>
                  <button onClick={() => deleteMutation.mutate(row.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length > 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </div>

      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing.id ? 'Edit' : 'New'} {title.slice(0, -1)}</h2>
              <button onClick={() => setEditing(null)}><X size={18} /></button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(editing); }}
              className="space-y-3"
            >
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-slate-500 block mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editing[f.key] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    />
                  ) : f.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!editing[f.key]}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })}
                    />
                  ) : (
                    <input
                      type={f.type || 'text'}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={editing[f.key] ?? ''}
                      onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <button type="submit" className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg mt-2">
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
