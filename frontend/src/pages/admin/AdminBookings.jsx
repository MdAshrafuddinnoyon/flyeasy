import React, { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, Users, Trash2, Loader2, Filter } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/admin/Pagination";

const STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("newest");
  const [updating, setUpdating] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try { setBookings(await Entities.bookings.list()); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search || b.customer_name?.toLowerCase().includes(search.toLowerCase()) || b.customer_email?.toLowerCase().includes(search.toLowerCase()) || b.package_title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchType = typeFilter === "all" || b.item_type === typeFilter;
    return matchSearch && matchStatus && matchType;
  }).sort((a, b) => {
    if (sortFilter === "newest") return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
    if (sortFilter === "oldest") return new Date(a.created_at || Date.now()) - new Date(b.created_at || Date.now());
    if (sortFilter === "travel_date") return new Date(a.travel_date || '2099-12-31') - new Date(b.travel_date || '2099-12-31');
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      await Entities.bookings.update(id, { status });
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status } : b)));
      toast({ title: `Booking marked as ${status}` });
    } catch (e) {
      toast({ title: "Error updating", variant: "destructive" });
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (b) => {
    if (!confirm(`Delete booking from ${b.customer_name}?`)) return;
    try { await Entities.bookings.remove(b.id); toast({ title: "Booking deleted" }); load(); }
    catch (e) { toast({ title: "Error deleting", variant: "destructive" }); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Bookings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{bookings.length} bookings total</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or package..." className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-11 pr-8 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="pl-11 pr-8 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
            <option value="all">All Types</option>
            <option value="package">Packages</option>
            <option value="hotel">Hotels</option>
            <option value="flight">Flights</option>
            <option value="guide">Local Guides</option>
          </select>
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select value={sortFilter} onChange={(e) => setSortFilter(e.target.value)} className="pl-11 pr-8 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="travel_date">Upcoming Travel</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}</div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {currentItems.map((b) => (
            <div key={b.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-deep-space dark:text-white">{b.customer_name}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 mb-1">{b.package_title || "—"}</div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail size={13} /> {b.customer_email}</span>
                    <span className="flex items-center gap-1"><Phone size={13} /> {b.customer_phone}</span>
                    {b.travel_date && <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(b.travel_date).toLocaleDateString()}</span>}
                    <span className="flex items-center gap-1"><Users size={13} /> {b.number_of_travelers} travellers</span>
                  </div>
                  {b.message && <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 italic line-clamp-1">"{b.message}"</p>}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-lg font-bold text-deep-space dark:text-white">৳{(b.total_price || 0).toLocaleString()}</div>
                    <div className={`text-xs font-bold inline-block px-2 py-0.5 rounded-full mt-1 capitalize ${b.item_type === 'guide' ? 'bg-purple-100 text-purple-700' : 'text-slate-500 dark:text-slate-400'}`}>
                      {b.item_type || "Package"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b.id, e.target.value)}
                      disabled={updating === b.id}
                      className="px-3 py-2 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
                    >
                      {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                    <button onClick={() => handleDelete(b)} className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 hover:bg-red-100 flex items-center justify-center"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No bookings found.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500",
    confirmed: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    completed: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>{status}</span>;
}

