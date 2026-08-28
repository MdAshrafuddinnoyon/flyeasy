import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Image } from "@/components/ui/image";
import SearchWidget from "@/components/SearchWidget";

const FALLBACK_HERO = "/images/hero.jpg";

export default function HeroSection({ content, featured }) {
  const bgImage = content?.hero_image_url || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-20 lg:pt-48 lg:pb-28 overflow-hidden min-h-[80vh] flex flex-col justify-center">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={bgImage} alt="Hero Background" className="w-full h-full object-cover" />
      </div>
      {/* Strong dark overlay so white text is always readable */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & Search Widget */}
          <div className="max-w-2xl" data-aos="fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
              {content?.hero_headline || "Find flights, hotels & holidays in one place"}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed font-medium">
              {content?.hero_subheadline || "Effortless booking, transparent pricing, and curated travel experiences — from Cox's Bazar to the Maldives."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-up" data-aos-delay="200">
              <SearchWidget />
            </div>
          </div>

          {/* Right Column: Image & Overlay matching mockup */}
          <div className="relative hidden lg:flex items-center justify-center lg:justify-end" data-aos="fade-left" data-aos-delay="300">
            <div className="relative w-full max-w-md">
              {/* The colored splash background */}
              <div className="absolute top-4 -left-6 w-full h-[110%] bg-accent rounded-[3rem] -rotate-3 z-0 shadow-xl" />
              <div className="absolute top-10 -right-4 w-full h-[90%] bg-primary rounded-[3rem] rotate-6 z-0" />
              
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/20">
              <Image
                src={featured?.image_url || content?.hero_image_url || FALLBACK_HERO}
                alt={featured?.title || "Travel"}
                fittingType="cover"
                className="w-full h-[450px] object-cover"
              />
            </div>

            {/* Floating Glass Card (like mockup) */}
            {featured && (
              <div className="absolute -bottom-6 -left-6 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-float-lg w-64 border border-white/20 dark:border-slate-800" data-aos="fade-up" data-aos-delay="500">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <MapPin size={12} className="text-accent" /> {featured.destination || "Featured"}
                </div>
                <div className="font-bold text-slate-900 dark:text-white text-sm leading-snug mb-2 line-clamp-2">{featured.title}</div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">৳{Number(featured.price || 0).toLocaleString()}</span>
                  </div>
                  <Link to={`/packages/${featured.id}`} className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:shadow-lg transition-all">
                    Book Now
                  </Link>
                </div>
              </div>
            )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
