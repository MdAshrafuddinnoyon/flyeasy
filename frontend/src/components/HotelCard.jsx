import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, BarChart2, PlusCircle } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useCompare } from "@/context/CompareContext";
import { useTrip } from "@/context/TripContext";

export default function HotelCard({ hotel }) {
  const { addToCompare } = useCompare();
  const { addToTrip } = useTrip();

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare({ type: 'hotel', id: hotel.id, title: hotel.name, price: hotel.price_per_night, image: hotel.image_url, rating: hotel.star_rating });
  };

  const handleTrip = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToTrip({ type: 'hotel', id: hotel.id, title: hotel.name, price: hotel.price_per_night, image: hotel.image_url });
  };

  return (
    <Link
      to={`/hotels/${hotel.id}`}
      className="group block bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-float hover:shadow-float-lg hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={hotel.image_url || '/images/hero.jpg'}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop'; }}
        />
        <div className="absolute top-3 left-3 bg-deep-space dark:bg-slate-950 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {hotel.star_rating}★ Hotel
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-2 items-end z-10">
          <FavoriteButton itemId={hotel.id} itemType="hotel" />
          <button onClick={handleCompare} className="p-2.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-primary hover:bg-white shadow-sm transition-all" title="Compare">
            <BarChart2 size={16} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {hotel.name}
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <MapPin size={12} className="text-primary" />
          {hotel.location}
        </div>
        <div className="flex items-center gap-1 mb-4">
          <Star size={14} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-semibold text-slate-800 dark:text-white">{hotel.rating}</span>
          <span className="text-xs text-slate-400">({hotel.reviews_count} reviews)</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ৳{hotel.price_per_night?.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> /night</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleTrip} className="flex items-center gap-1 p-2 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors text-xs font-semibold" title="Add to Trip">
              <PlusCircle size={14} /> Trip
            </button>
            <span className="text-primary font-semibold text-sm whitespace-nowrap">Book Now</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
