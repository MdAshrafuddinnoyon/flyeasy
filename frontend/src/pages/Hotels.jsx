import React, { useState } from "react";
import { Search, Hotel } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { Entities } from '@/lib/api';
import HotelCard from "@/components/HotelCard";

export default function Hotels() {
const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("q") || "");

const { data: hotels = [], isLoading: loading } = useQuery({
  queryKey: ['hotels'],
  queryFn: () => Entities.hotels.list(),
});

const filtered = hotels.filter(
(h) =>
!search ||
h.name?.toLowerCase().includes(search.toLowerCase()) ||
h.location?.toLowerCase().includes(search.toLowerCase()) ||
h.city?.toLowerCase().includes(search.toLowerCase())
);

return (
<div className="bg-white dark:bg-[#0a0a0c] min-h-screen">
  {/* Hero Section */}
  <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-slate-900">
    <img src="/images/hero_hotels.jpg" alt="Hotels" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
    <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
      <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3">
        <Hotel size={16} /> Hotels & Resorts
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Stay somewhere unforgettable</h1>
      <p className="text-white/70 max-w-xl mx-auto">Luxurious or budget-friendly — accommodations for every traveller.</p>
    </div>
  </div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-10 relative z-20">
    <div className="relative max-w-xl mb-8">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search hotels by name or city..."
        className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 shadow-float focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-deep-space dark:text-white"
      />
    </div>
{loading ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{[...Array(8)].map((_, i) => (
<div key={i} className="bg-card dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-float animate-pulse">
<div className="h-52 bg-slate-200 dark:bg-slate-800" />
<div className="p-5 space-y-3">
<div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
</div>
</div>
))}
</div>
) : filtered.length > 0 ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{filtered.map((h) => (
<HotelCard key={h.id} hotel={h} />
))}
</div>
) : (
<div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border dark:border-slate-800">
<p className="text-slate-500 dark:text-slate-400">No hotels found.</p>
</div>
)}
</div>
</div>
);
}
