import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Entities, SiteContent } from "@/lib/api";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import PackageShowcase from "@/components/home/PackageShowcase";
import ProcessSection from "@/components/home/ProcessSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import Newsletter from "@/components/Newsletter";
import HotelCard from "@/components/HotelCard";

export default function Home() {
const [packages, setPackages] = useState([]);
const [hotels, setHotels] = useState([]);
const [partners, setPartners] = useState([]);
const [content, setContent] = useState({});
const [loading, setLoading] = useState(true);

useEffect(() => {
let mounted = true;
(async () => {
try {
const [pkgs, htls, siteContentList, partnersList] = await Promise.all([
Entities.packages.list(),
Entities.hotels.list(),
SiteContent.get(),
Entities.partners.list(),
]);
if (mounted) {
setPackages(pkgs);
setHotels(htls);
setContent(siteContentList || {});
setPartners(partnersList.filter(p => p.active));
}
} catch (e) {
console.error("Home loading error:", e);
} finally {
if (mounted) setLoading(false);
}
})();
return () => { mounted = false; };
}, []);

const featuredPackage = useMemo(() => {
  if (!packages || packages.length === 0) return null;
  const adminFeatured = packages.find(p => p.featured);
  if (adminFeatured) return adminFeatured;
  return [...packages].sort((a, b) => {
    return (b.rating || 0) - (a.rating || 0) || (b.reviews_count || 0) - (a.reviews_count || 0);
  })[0];
}, [packages]);

return (
<div className="bg-white dark:bg-[#0a0a0c]">
<HeroSection content={content} featured={featuredPackage} />

<div data-aos="fade-up"><ServicesSection partners={partners} /></div>

<div data-aos="fade-up"><PackageShowcase packages={packages} /></div>

{/* HOTELS */}
<section className="py-16 sm:py-20 bg-white dark:bg-slate-900/30">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10" data-aos="fade-up">
<div>
<div className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Best Hotels</div>
<h2 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white">Stay somewhere unforgettable</h2>
</div>
<Link to="/hotels" className="flex items-center gap-1 text-primary font-semibold hover:gap-2 transition-all">
View all hotels <ArrowRight size={18} />
</Link>
</div>
{loading ? (
<SkeletonGrid />
) : hotels.length > 0 ? (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{hotels.slice(0, 4).map((h, i) => (
<div key={h.id} data-aos="fade-up" data-aos-delay={i * 100}>
<HotelCard hotel={h} />
</div>
))}
</div>
) : (
<EmptyState text="No hotels available yet." />
)}
</div>
</section>

<div data-aos="fade-up"><ProcessSection /></div>
<div data-aos="fade-up"><ReviewsSection /></div>
<div data-aos="fade-up"><Newsletter /></div>

{/* CTA */}
<section className="py-16 sm:py-24 relative overflow-hidden bg-primary/5 dark:bg-slate-900">
<img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000" alt="Travel" className="absolute inset-0 w-full h-full object-cover opacity-40 dark:opacity-30 mix-blend-multiply dark:mix-blend-overlay" />
<div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/80 dark:from-slate-900/90 dark:to-slate-900/90 pointer-events-none" />
<div className="absolute -top-20 -right-20 w-80 h-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10" data-aos="zoom-in">
<h2 className="text-3xl sm:text-5xl font-bold text-white mb-5">Ready to take off?</h2>
<p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
Join thousands of travellers who book with FlyEasy every day. Your next adventure is one click away.
</p>
<Link
to="/packages"
className="inline-flex items-center gap-2 bg-accent text-white font-semibold px-8 py-4 rounded-full hover:shadow-2xl hover:shadow-accent/30 hover:-translate-y-1 transition-all"
>
Explore Packages <ArrowRight size={20} />
</Link>
</div>
</section>
</div>
);
}

function SkeletonGrid() {
return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
{[...Array(4)].map((_, i) => (
<div key={i} className="bg-card dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-float animate-pulse">
<div className="h-52 bg-slate-200 dark:bg-slate-800" />
<div className="p-5 space-y-3">
<div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
<div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
</div>
</div>
))}
</div>
);
}

function EmptyState({ text }) {
return (
<div className="mt-10 text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border dark:border-slate-800">
<p className="text-slate-500 dark:text-slate-400">{text}</p>
</div>
);
}
