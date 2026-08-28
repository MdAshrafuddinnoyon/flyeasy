import React, { useState, useEffect } from "react";
import { Heart, Mail, Phone, ExternalLink, Calendar, Search, Filter } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import Pagination from "@/components/admin/Pagination";

export default function AdminLeads() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const ITEMS_PER_PAGE = 5;
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await api.get("/favorites/all");
        setFavorites(res.data);
      } catch (err) {
        toast({ title: "Error loading favorites", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [toast]);

  const filtered = favorites.filter((f) => {
    const matchSearch = !search || f.user_name?.toLowerCase().includes(search.toLowerCase()) || f.user_email?.toLowerCase().includes(search.toLowerCase()) || f.package_title?.toLowerCase().includes(search.toLowerCase()) || f.hotel_name?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || f.item_type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
          <Heart className="text-rose-500 fill-current" /> Customer Favorites (Leads)
        </h1>
        <p className="text-slate-500 mt-1">See which packages and hotels customers are saving.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or item..." className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="pl-11 pr-8 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
            <option value="all">All Types</option>
            <option value="package">Packages</option>
            <option value="hotel">Hotels</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}</div>
      ) : favorites.length > 0 ? (
        <div className="space-y-3">
          {currentItems.map((f) => (
            <div key={f.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-deep-space dark:text-white text-lg">{f.user_name || "Unknown User"}</h3>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Mail size={14} /> {f.user_email}</span>
                    {f.user_phone && <span className="flex items-center gap-1"><Phone size={14} /> {f.user_phone}</span>}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">
                    Favorited {f.item_type}
                  </div>
                  <Link to={`/${f.item_type}s/${f.item_id}`} target="_blank" className="font-bold text-primary hover:underline flex items-center gap-1">
                    {f.item_type === 'package' ? f.package_title : f.hotel_name} <ExternalLink size={14} />
                  </Link>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Calendar size={12} /> Saved on {new Date(f.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
          <p className="text-slate-500">No favorites found yet.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  );
}
