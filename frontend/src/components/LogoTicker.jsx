import React from "react";
import Marquee from "react-fast-marquee";
import { Plane } from "lucide-react";

export default function LogoTicker({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="py-10 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <h2 className="text-[11px] font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
          {title}
        </h2>
      </div>
      
      <div className="relative">
        {/* Fade gradients for edges */}
        <div className="absolute top-0 left-0 w-8 sm:w-16 md:w-32 h-full bg-gradient-to-r from-white to-transparent dark:from-[#0a0a0c] z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 sm:w-16 md:w-32 h-full bg-gradient-to-l from-white to-transparent dark:from-[#0a0a0c] z-10 pointer-events-none" />
        
        <Marquee pauseOnHover={true} speed={40} gradient={false}>
          <div className="flex items-center gap-8 sm:gap-12 md:gap-24 px-8 sm:px-12">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 min-w-[80px] sm:min-w-[120px]"
                title={item.name}
              >
                {item.logo_url ? (
                  <img 
                    src={item.logo_url} 
                    alt={item.name} 
                    className="h-10 md:h-12 object-contain" 
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="flex items-center gap-2 font-bold text-xl text-slate-800 dark:text-slate-200">
                    <Plane size={24} />
                    <span>{item.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
}
