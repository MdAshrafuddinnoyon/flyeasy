import React, { useState, useEffect } from "react";
import { Heart, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import HotelCard from "@/components/HotelCard";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { stripHtml } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";

function FavPackageCard({ p }) {
  const bigText = (p.destination || p.title || "DESTINATION").split(' ')[0].toUpperCase();
  return (
    <Link to={`/packages/${p.id}`} className="group relative rounded-[2rem] overflow-hidden shadow-float hover:shadow-float-lg transition-all duration-500 hover:-translate-y-2 block border border-slate-100 dark:border-slate-800 h-[350px]">
      <div className="h-full w-full bg-gradient-to-br from-primary/80 to-accent/60 relative overflow-hidden">
        <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-deep-space/90 dark:from-black/90 via-deep-space/40 dark:via-black/50 to-deep-space/10 dark:to-transparent" />
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-deep-space dark:text-white shadow-lg group-hover:bg-accent group-hover:text-white transition-colors">
          <ArrowUpRight size={20} strokeWidth={2.5} />
        </div>
        <FavoriteButton itemId={p.id} itemType="package" className="w-10 h-10 bg-white dark:bg-slate-900 text-slate-400 shadow-lg" />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center px-4 pointer-events-none">
        <span className="text-[4rem] sm:text-[5rem] font-black text-white/20 tracking-tighter leading-none select-none mix-blend-overlay">{bigText}</span>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-6">
        <h3 className="text-white font-bold text-xl mb-1">{p.title}</h3>
        <p className="text-white/70 text-xs mb-4 line-clamp-1">{stripHtml(p.short_description || p.description) || p.destination}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-deep-space bg-white/90 px-3 py-1.5 rounded-full">{p.duration_days || 3} Days</span>
          <span className="text-xs font-semibold text-white bg-accent/90 px-3 py-1.5 rounded-full backdrop-blur">৳{Number(p.price || 0).toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
}

export default function FavoritesPanel() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    const fetchFavs = async () => {
      try {
        const res = await api.get("/favorites/my");
        if (mounted) setFavorites(res.data);
      } catch (err) {
        toast({ title: "Failed to load favorites", variant: "destructive" });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFavs();
    return () => { mounted = false; };
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const packages = favorites.filter(f => f.item_type === 'package').map(f => ({
    id: f.item_id,
    title: f.package_title,
    image_url: f.package_image,
    // Add default values for what's not joined
    price: 0, 
    duration_days: 0,
    short_description: 'Favorite Package'
  }));

  const hotels = favorites.filter(f => f.item_type === 'hotel').map(f => ({
    id: f.item_id,
    name: f.hotel_name,
    image_url: f.hotel_image,
    star_rating: 5,
    location: 'Favorite Hotel',
    price_per_night: 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
          <Heart size={24} className="text-rose-500 fill-current" /> My Favorites
        </h1>
        <p className="text-slate-500 mt-1">Quick access to your saved packages and hotels.</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-dashed border-slate-200 dark:border-slate-800">
          <Heart size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold text-deep-space dark:text-white mb-2">No favorites yet</h3>
          <p className="text-slate-500">Save packages and hotels to view them here later.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {packages.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Saved Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map(p => <FavPackageCard key={p.id} p={p} />)}
              </div>
            </div>
          )}

          {hotels.length > 0 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Saved Hotels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map(h => <HotelCard key={h.id} hotel={h} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
