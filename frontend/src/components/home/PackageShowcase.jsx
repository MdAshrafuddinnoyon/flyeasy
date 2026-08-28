import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { stripHtml } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";

export default function PackageShowcase({ packages }) {
  const [tab, setTab] = useState("All");
  
  const TABS = useMemo(() => {
    const dests = packages.map(p => p.destination).filter(Boolean);
    return ["All", ...new Set(dests)].slice(0, 6);
  }, [packages]);

  const filtered = useMemo(
    () => (tab === "All" ? packages : packages.filter((p) => p.destination?.includes(tab))),
    [tab, packages]
  );
  const shown = filtered.slice(0, 3); // Mockup shows 3 big cards

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-[#0a0a0c] relative transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-block bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            • Our Packages
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-space dark:text-white mb-8">
            Explore <span className="text-accent">Bangladesh</span> & Beyond
          </h2>

          {/* Tabs matching mockup style (text links) */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 border-b border-border/50 dark:border-slate-800 pb-4">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-sm font-semibold transition-all relative pb-4 -mb-[17px] ${
                  tab === t
                    ? "text-accent border-b-2 border-accent"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 border-b-2 border-transparent"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Cards matching mockup */}
        {shown.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shown.map((p, index) => {
              // Extract a short word for the huge background text (e.g., DUBAI)
              const bigText = (p.destination || p.title || "DESTINATION").split(' ')[0].toUpperCase();
              
              return (
                <Link
                  key={p.id}
                  to={`/packages/${p.id}`}
                  className={`group relative rounded-[2rem] overflow-hidden shadow-float hover:shadow-float-lg transition-all duration-500 hover:-translate-y-2 block border border-slate-100 dark:border-slate-800 ${
                    index === 1 ? "md:translate-y-8" : "" // Offset the middle one slightly if desired, or keep flat
                  }`}
                >
                  <div className="h-[350px] sm:h-[450px] w-full bg-gradient-to-br from-primary/80 to-accent/60 relative overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-space/90 dark:from-black/90 via-deep-space/40 dark:via-black/50 to-deep-space/10 dark:to-transparent" />

                  {/* Top Right Arrow Icon and Heart */}
                  <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-deep-space dark:text-white shadow-lg group-hover:bg-accent group-hover:text-white transition-colors">
                      <ArrowUpRight size={20} strokeWidth={2.5} />
                    </div>
                    <FavoriteButton itemId={p.id} itemType="package" className="w-10 h-10 bg-white dark:bg-slate-900 text-slate-400 shadow-lg" />
                  </div>

                  {/* Huge Background Text */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center px-4 pointer-events-none">
                    <span className="text-[5rem] sm:text-[6rem] lg:text-[7rem] font-black text-white/20 tracking-tighter leading-none select-none mix-blend-overlay">
                      {bigText}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8">
                    <h3 className="text-white font-bold text-xl sm:text-2xl mb-1">{p.title}</h3>
                    <p className="text-white/70 text-xs sm:text-sm mb-4 line-clamp-1">{stripHtml(p.short_description || p.description) || p.destination}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-deep-space bg-white/90 px-3 py-1.5 rounded-full">
                        {p.duration_days || 3} Days
                      </span>
                      <span className="text-xs font-semibold text-white bg-accent/90 px-3 py-1.5 rounded-full backdrop-blur">
                        ৳{Number(p.price || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-slate-500 dark:text-slate-400 py-10">No packages available in this category.</p>
        )}
      </div>
    </section>
  );
}
