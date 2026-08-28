import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, X, Save, Plane, Loader2, Download } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Pagination from "@/components/admin/Pagination";

const EMPTY = {
  airline_name: "",
  flight_code: "",
  origin: "",
  destination: "",
  departure_time: "",
  arrival_time: "",
  price: 0,
  stops: 0,
  available: true,
};

// Simple datetime string format helper for local input
const toLocalISO = (d) => {
  if (!d) return "";
  const date = new Date(d);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

export default function AdminFlights() {
  const [flights, setFlights] = useState([]);
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
      const data = await Entities.flights.list();
      setFlights(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleExportCSV = () => {
    if (flights.length === 0) return;
    const headers = ["id", "airline_name", "flight_code", "origin", "destination", "departure_time", "arrival_time", "price", "stops", "available"];
    const csvContent = [
      headers.join(","),
      ...flights.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "flights_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = flights.filter((f) => !search || f.airline_name?.toLowerCase().includes(search.toLowerCase()) || f.flight_code?.toLowerCase().includes(search.toLowerCase()) || f.origin?.toLowerCase().includes(search.toLowerCase()) || f.destination?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (f) => { setEditing({ ...EMPTY, ...f, departure_time: toLocalISO(f.departure_time), arrival_time: toLocalISO(f.arrival_time) }); setOpen(true); };
  
  const save = async (e) => {
    e.preventDefault();
    if (!editing.airline_name || !editing.flight_code) return;
    setSaving(true);
    try {
      if (editing.id) await Entities.flights.update(editing.id, editing);
      else await Entities.flights.create(editing);
      toast({ title: "Flight saved successfully" });
      setOpen(false);
      load();
    } catch (err) {
      toast({ title: "Failed to save flight", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await Entities.flights.remove(id);
      toast({ title: "Flight deleted" });
      load();
    } catch (e) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const update = (key, val) => setEditing({ ...editing, [key]: val });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-space dark:text-white">Flights</h1>
          <p className="text-sm text-slate-500">Manage available flights</p>
        </div>
        <Button onClick={openNew} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Flight
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input placeholder="Search flights..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-9 bg-slate-50 dark:bg-slate-800" />
          </div>
          <Button variant="outline" onClick={handleExportCSV} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No flights found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-800 border-b border-border">
                <tr>
                  <th className="px-6 py-4">Airline & Code</th>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Schedule</th>
                  <th className="px-6 py-4">Price & Stops</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-deep-space dark:text-white">{f.airline_name}</div>
                      <div className="text-xs text-slate-500">{f.flight_code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700 dark:text-slate-300">{f.origin} → {f.destination}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 dark:text-slate-300">Dep: {new Date(f.departure_time).toLocaleString()}</div>
                      <div className="text-xs text-slate-500">Arr: {new Date(f.arrival_time).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">৳{f.price}</div>
                      <div className="text-xs text-slate-500">{f.stops === 0 ? "Non-stop" : `${f.stops} Stop(s)`}</div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEdit(f)} className="p-2 text-slate-400 hover:text-primary bg-slate-100 hover:bg-primary/10 dark:bg-slate-800 dark:hover:bg-primary/20 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => remove(f.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-500/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Flight" : "Add Flight"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={save} className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Airline Name *</Label><Input value={editing.airline_name} onChange={(e) => update("airline_name", e.target.value)} required /></div>
                <div className="space-y-2"><Label>Flight Code *</Label><Input value={editing.flight_code} onChange={(e) => update("flight_code", e.target.value)} required /></div>
                
                <div className="space-y-2"><Label>Origin (e.g. DAC) *</Label><Input value={editing.origin} onChange={(e) => update("origin", e.target.value)} required /></div>
                <div className="space-y-2"><Label>Destination (e.g. CXB) *</Label><Input value={editing.destination} onChange={(e) => update("destination", e.target.value)} required /></div>
                
                <div className="space-y-2"><Label>Departure Time *</Label><Input type="datetime-local" value={editing.departure_time} onChange={(e) => update("departure_time", e.target.value)} required /></div>
                <div className="space-y-2"><Label>Arrival Time *</Label><Input type="datetime-local" value={editing.arrival_time} onChange={(e) => update("arrival_time", e.target.value)} required /></div>
                
                <div className="space-y-2"><Label>Price (৳) *</Label><Input type="number" min="0" value={editing.price} onChange={(e) => update("price", Number(e.target.value))} required /></div>
                <div className="space-y-2"><Label>Stops</Label><Input type="number" min="0" value={editing.stops} onChange={(e) => update("stops", Number(e.target.value))} /></div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <input type="checkbox" id="available" checked={editing.available} onChange={(e) => update("available", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                <Label htmlFor="available">Active / Available</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-white" disabled={saving}>{saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Flight</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
