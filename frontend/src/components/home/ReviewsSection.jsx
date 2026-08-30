import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Entities } from "@/lib/api";



import { useSiteContent } from "@/context/SiteContext";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = React.useRef(null);
  const { siteData } = useSiteContent();
  const autoSlideRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    Entities.testimonials.list()
      .then((data) => setReviews(data.filter((t) => t.active)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // If auto slide is explicitly false, don't start it. Default is true.
    if (siteData?.reviews_auto_slide === false || reviews.length === 0) {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      return;
    }

    autoSlideRef.current = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // If reached the end, scroll back to start
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [siteData?.reviews_auto_slide, reviews.length]);

  const list = reviews;

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-[#0a0a0c] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="max-w-2xl">
            <div className="text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider mb-2">REVIEWS</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-space dark:text-white mb-3 md:mb-4">
              What Our <span className="text-accent">Travelers</span> Say
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              Trusted by thousands of travelers for smooth bookings, affordable fares, and
              memorable journeys across Bangladesh and beyond.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:hover:text-primary transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full bg-deep-space text-white dark:text-[#0a0a0c] flex items-center justify-center hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-black/10">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* CSS Snap Scroll Container */}
        <div ref={scrollRef} className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {list.map((r, i) => (
            <div 
              key={r.id || i} 
              className="snap-center sm:snap-start shrink-0 w-[85vw] sm:w-[350px] lg:w-[300px] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl font-bold text-deep-space dark:text-white">{Number(r.rating || 5).toFixed(1)}</span>
                <div className="flex gap-1">
                  {Array.from({ length: r.rating || 5 }).map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-6 min-h-[100px]">
                "{r.text}"
              </p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt={r.name} className="w-10 h-10 rounded-full object-cover grayscale" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold text-base">
                    {r.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm text-deep-space dark:text-white">{r.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{r.trip || "Traveler"}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
