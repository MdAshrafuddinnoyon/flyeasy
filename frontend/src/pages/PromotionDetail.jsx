import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Tag, Copy, Check } from "lucide-react";
import { Entities } from "@/lib/api";
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";

const FALLBACK_PROMOTIONS = [
  { id: "p1", title: "Eid Special: 20% off Domestic Flights", description: "Book any domestic flight during the Eid holiday week and get 20% flat discount up to BDT 2000.", discount_text: "20% OFF", coupon_code: "EID2026", active: true, image_url: "/images/promo_eid_flight.jpg" },
  { id: "p2", title: "Maldives Honeymoon Package - Buy 1 Get 1", description: "Book our premium Maldives honeymoon package for two and pay only for one! Limited time offer.", discount_text: "BOGO", coupon_code: "LOVE2026", active: true, image_url: "/images/maldives_resort.jpg" },
  { id: "p3", title: "Cox's Bazar Hotel Flash Sale", description: "Get massive discounts on 5-star hotels in Cox's Bazar. Valid for bookings made this weekend.", discount_text: "UP TO 50% OFF", active: true, image_url: "/images/coxs_bazar_beach.jpg" },
];

export default function PromotionDetail() {
  const { id } = useParams();
  const [promo, setPromo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Entities.promotions.get(id)
      .then((data) => {
        if (!data) throw new Error("Not found");
        setPromo(data);
      })
      .catch((err) => {
        console.error("API failed, using fallback:", err);
        const fallback = FALLBACK_PROMOTIONS.find(p => p.id === id);
        setPromo(fallback || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const copyCode = () => {
    if (promo?.coupon_code) {
      navigator.clipboard.writeText(promo.coupon_code);
      setCopied(true);
      toast({ title: "Coupon code copied!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="min-h-screen pt-32 pb-16 flex justify-center bg-slate-50 dark:bg-[#0a0a0c]"><div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" /></div>;
  }

  if (!promo) {
    return (
      <div className="min-h-screen pt-32 pb-16 text-center bg-slate-50 dark:bg-[#0a0a0c]">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Promotion not found</h2>
        <Link to="/promotions" className="text-primary hover:underline">Back to promotions</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] pt-24 sm:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/promotions" className="inline-flex items-center gap-2 text-slate-500 hover:text-deep-space dark:hover:text-white font-medium mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to all offers
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-float-lg border border-slate-100 dark:border-slate-800">
          <div className="h-64 sm:h-96 relative">
            <Image src={promo.image_url || "/images/hero.jpg"} alt={promo.title} fittingType="cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-space/80 dark:from-black/90 via-transparent to-transparent" />
            {promo.discount_text && (
              <div className="absolute top-6 left-6 bg-accent text-white font-bold text-sm sm:text-base px-4 py-2 rounded-full shadow-lg">
                {promo.discount_text}
              </div>
            )}
          </div>
          
          <div className="p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">{promo.title}</h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">{promo.description}</p>
            </div>

            {promo.coupon_code && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Use Coupon Code</div>
                  <div className="text-2xl font-black text-deep-space dark:text-white tracking-wider">{promo.coupon_code}</div>
                </div>
                <button
                  onClick={copyCode}
                  className="w-full sm:w-auto bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? "Copied!" : "Copy Code"}
                </button>
              </div>
            )}

            {promo.link_url && (
              <a href={promo.link_url} target="_blank" rel="noreferrer" className="inline-flex bg-accent text-white font-semibold px-8 py-4 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all">
                Redeem Offer Now
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
