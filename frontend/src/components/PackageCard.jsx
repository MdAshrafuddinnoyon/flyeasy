import React from "react";
import { Link } from "react-router-dom";
import { Star, Clock, MapPin, ArrowRight, BarChart2, PlusCircle } from "lucide-react";
import { cn, stripHtml } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";
import { useCompare } from "@/context/CompareContext";
import { useTrip } from "@/context/TripContext";

export default function PackageCard({ pkg, wide = false }) {
  const discount = pkg.original_price
    ? Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)
    : 0;
  
  const { addToCompare } = useCompare();
  const { addToTrip } = useTrip();

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare({ type: 'package', id: pkg.id, title: pkg.title, price: pkg.price, image: pkg.image_url, duration: `${pkg.duration_days} Days` });
  };

  const handleTrip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToTrip({ type: 'package', id: pkg.id, title: pkg.title, price: pkg.price, image: pkg.image_url });
  };

  return (
    <Link
      to={`/packages/${pkg.id}`}
      className={cn(
        "group block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-float hover:shadow-float-lg hover:-translate-y-1 transition-all duration-500",
        wide ? "lg:col-span-2" : ""
      )}
    >
      <div className={cn("relative overflow-hidden bg-slate-200 dark:bg-slate-800", wide ? "h-64 lg:h-80" : "h-52")}>
        <img
          src={pkg.image_url || '/images/hero.jpg'}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=600&auto=format&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        {discount > 0 && (
          <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {discount}% OFF
          </div>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-10">
          <FavoriteButton itemId={pkg.id} itemType="package" />
          <button onClick={handleCompare} className="p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-white shadow-sm transition-all" title="Compare">
            <BarChart2 size={16} />
          </button>
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-sm mt-1">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-white">{pkg.rating || 4.5}</span>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-1.5 text-white/90 text-xs mb-1">
            <MapPin size={12} />
            {pkg.destination}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {pkg.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{stripHtml(pkg.short_description || pkg.description)}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4">
          <Clock size={14} className="text-primary" />
          {pkg.duration_days} Days · {pkg.duration_days - 1} Nights
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            {pkg.original_price && pkg.original_price > pkg.price && (
              <div className="text-xs text-slate-400 line-through">৳{pkg.original_price.toLocaleString()}</div>
            )}
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ৳{pkg.price.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> /person</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleTrip} className="flex items-center gap-1 p-2 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-semibold" title="Add to Trip">
              <PlusCircle size={14} /> Trip
            </button>
            <div className="flex items-center gap-1 text-primary font-semibold text-sm group-hover:gap-2 transition-all whitespace-nowrap">
              View <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
