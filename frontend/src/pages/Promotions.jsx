import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag, Clock } from "lucide-react";
import { Entities } from "@/lib/api";
import { Image } from "@/components/ui/image";

const FALLBACK_PROMOTIONS = [
  { id: "p1", title: "Eid Special: 20% off Domestic Flights", description: "Book any domestic flight during the Eid holiday week and get 20% flat discount up to BDT 2000.", discount_text: "20% OFF", coupon_code: "EID2026", active: true, image_url: "/images/promo_eid_flight.jpg" },
  { id: "p2", title: "Maldives Honeymoon Package - Buy 1 Get 1", description: "Book our premium Maldives honeymoon package for two and pay only for one! Limited time offer.", discount_text: "BOGO", coupon_code: "LOVE2026", active: true, image_url: "/images/maldives_resort.jpg" },
  { id: "p3", title: "Cox's Bazar Hotel Flash Sale", description: "Get massive discounts on 5-star hotels in Cox's Bazar. Valid for bookings made this weekend.", discount_text: "UP TO 50% OFF", active: true, image_url: "/images/coxs_bazar_beach.jpg" },
];

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Entities.promotions.list()
      .then((data) => {
        const active = data.filter(p => p.active);
        setPromotions(active.length > 0 ? active : FALLBACK_PROMOTIONS);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 overflow-hidden bg-slate-900">
        <img src="/images/hero_packages.jpg" alt="Promotions" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3">
            <Tag size={16} /> Special Offers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Travel Promotions</h1>
          <p className="text-white/70 max-w-xl mx-auto">Discover exclusive deals and discounts for your next adventure.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-10 relative z-20">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((p) => (
              <Link key={p.id} to={`/promotions/${p.id}`} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-float hover:shadow-float-lg transition-all duration-500 hover:-translate-y-1 block">
                <div className="relative h-56 overflow-hidden">
                  <Image src={p.image_url || "/images/hero.jpg"} alt={p.title} fittingType="cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  {p.discount_text && (
                    <div className="absolute top-4 left-4 bg-accent text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
                      {p.discount_text}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-space/80 dark:from-black/90 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-deep-space dark:text-white text-lg mb-2 line-clamp-1">{p.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{p.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border dark:border-slate-800">
                    {p.coupon_code ? (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-deep-space dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                        <Tag size={12} className="text-accent" /> Code: {p.coupon_code}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Clock size={14} /> Limited time offer
                      </div>
                    )}
                    <span className="text-accent hover:text-deep-space dark:hover:text-white transition-colors">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-border dark:border-slate-800">
            <Tag size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-deep-space dark:text-white mb-2">No active promotions</h3>
            <p className="text-slate-500 dark:text-slate-400">Check back later for new deals and discounts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
