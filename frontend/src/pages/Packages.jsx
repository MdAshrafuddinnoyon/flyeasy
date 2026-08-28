import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Entities } from '@/lib/api';
import { Search, SlidersHorizontal, Map } from "lucide-react";
import PackageCard from '@/components/PackageCard';

export default function Packages() {
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("q") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ['packages'],
    queryFn: () => Entities.packages.list(),
  });

  const CATEGORIES = useMemo(() => {
    const cats = packages.map(p => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [packages]);

  let filtered = packages.filter((p) => {
    if (!p.available && p.available !== undefined) return false;
    const matchSearch =
      !search ||
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.destination?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  if (sort === "price-low") filtered = [...filtered].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
  if (sort === "price-high") filtered = [...filtered].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
  if (sort === "rating") filtered = [...filtered].sort((a, b) => (Number(a.rating) || 0) - (Number(b.rating) || 0));

  return (
    <div className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-slate-900">
        <img src="/images/hero_packages.jpg" alt="Holiday Packages" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3" data-aos="fade-down">
            <Map size={16} /> Holiday Packages
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3" data-aos="fade-up">Find your perfect getaway</h1>
          <p className="text-white/70 max-w-xl mx-auto" data-aos="fade-up" data-aos-delay="100">All-inclusive packages with flights, stays and curated experiences.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-4 mb-8" data-aos="fade-up" data-aos-delay="200">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by destination or package name..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-float focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-deep-space dark:text-white"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/30 text-deep-space dark:text-white"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-primary text-white shadow-lg shadow-primary/30"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-deep-space dark:text-slate-300 hover:border-primary dark:hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-float animate-pulse">
                <div className="h-52 bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p, i) => (
              <div key={p.id} data-aos="fade-up" data-aos-delay={(i % 3) * 100}>
                <PackageCard pkg={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
            <SlidersHorizontal size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No packages match your search. Try different filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
