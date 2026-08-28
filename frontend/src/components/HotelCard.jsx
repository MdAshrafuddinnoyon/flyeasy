import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import FavoriteButton from "@/components/FavoriteButton";

export default function HotelCard({ hotel }) {
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
        <div className="absolute top-2 right-2">
          <FavoriteButton itemId={hotel.id} itemType="hotel" />
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
        <div className="flex items-end justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              ৳{hotel.price_per_night?.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> /night</span>
            </div>
          </div>
          <span className="text-primary font-semibold text-sm">Book Now</span>
        </div>
      </div>
    </Link>
  );
}
