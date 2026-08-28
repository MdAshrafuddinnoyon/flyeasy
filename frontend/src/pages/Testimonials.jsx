import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Play, ArrowUpRight, Star } from "lucide-react";
import { Entities } from "@/lib/api";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    Entities.testimonials.list()
      .then((data) => {
        const active = data.filter(d => d.active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0));
        setTestimonials(active);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c] pt-28 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex px-3 py-1 bg-accent/10 text-accent font-semibold text-sm rounded-full mb-4">
              Testimonials
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-deep-space dark:text-white mb-4">
              What the procrastinators say
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-lg">
              Hear directly from our travelers about their seamless experiences, unforgettable journeys, and why they choose FlyEasy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => scroll("left")} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <ChevronLeft className="text-slate-600 dark:text-slate-300" />
            </button>
            <button onClick={() => scroll("right")} className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              <ChevronRight className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>

        {/* Slider Section */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="min-w-[320px] md:min-w-[400px] h-[550px] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse snap-center" />
            ))
          ) : (
            testimonials.map((t, i) => (
              <div 
                key={i} 
                onClick={() => setModalData(t)}
                className="group relative min-w-[320px] md:min-w-[400px] h-[550px] rounded-3xl overflow-hidden snap-center cursor-pointer select-none"
              >
                <img 
                  src={t.avatar_url || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80"} 
                  alt={t.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                
                {/* Arrow Icon */}
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center text-white bg-black/10 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight size={24} />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-0 transition-transform duration-300">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={18} className={idx < (t.rating || 5) ? "fill-accent text-accent" : "fill-white/40 text-white/40"} />
                    ))}
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-1">{t.name}</h3>
                  <p className="text-white/80 text-sm font-medium">{t.trip || "Traveler"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Video / Message Modal */}
      <Dialog open={!!modalData} onOpenChange={(open) => !open && setModalData(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-2xl">
          <DialogHeader className="sr-only">
             <DialogTitle>Testimonial from {modalData?.name}</DialogTitle>
          </DialogHeader>
          {modalData && (
            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {modalData.video_url ? (
                getYoutubeId(modalData.video_url) ? (
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${getYoutubeId(modalData.video_url)}?autoplay=1`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="absolute inset-0"
                  ></iframe>
                ) : (
                  <video 
                    controls 
                    autoPlay 
                    className="w-full h-full object-contain"
                    src={modalData.video_url}
                  />
                )
              ) : (
                <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-12 text-center">
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={24} className={idx < (modalData.rating || 5) ? "fill-accent text-accent" : "fill-white/20 text-white/20"} />
                    ))}
                  </div>
                  <p className="text-white text-2xl md:text-3xl font-medium leading-relaxed max-w-2xl">
                    "{modalData.text}"
                  </p>
                  <div className="mt-8">
                    <h4 className="text-white font-bold text-xl">{modalData.name}</h4>
                    <p className="text-white/70">{modalData.trip || "Traveler"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
