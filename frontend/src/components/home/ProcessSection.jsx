import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search, FileText, Plane, Hotel, Camera, Heart } from "lucide-react";
import { useSiteContent } from "@/context/SiteContext";

export default function ProcessSection() {
  const navigate = useNavigate();
  const { siteData } = useSiteContent();

  return (
    <section className="relative pt-28 pb-0 lg:pt-40 overflow-hidden bg-white dark:bg-slate-900 flex flex-col justify-between">
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full flex-grow">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Text Content */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 mb-6 animate-fade-up bg-accent/10 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-accent font-bold text-[10px] tracking-widest uppercase">YOUR JOURNEY, YOUR WAY</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-deep-space dark:text-white leading-[1.1] mb-6 animate-fade-up uppercase" style={{ animationDelay: '0.1s' }}>
              WE MAKE EVERY TRIP <br/>
              SIMPLE, SMART & <span className="text-accent">STRESS-FREE.</span>
            </h2>
            
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed mb-10 max-w-md animate-fade-up font-medium" style={{ animationDelay: '0.2s' }}>
              From searching flights to creating unforgettable memories,
              FlyEasy helps you travel better with transparent pricing and
              seamless booking.
            </p>
            
            <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <button 
                onClick={() => navigate('/packages')}
                className="inline-flex items-center gap-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-deep-space dark:text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all group"
              >
                Book You Trip Now 
                <span className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:bg-slate-50 dark:group-hover:bg-slate-700 transition-colors">
                  <ArrowRight size={14} className="text-slate-500 dark:text-slate-400" />
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Path Animation */}
          <div className="hidden lg:block relative h-full animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* The dotted path (simulated with SVG) */}
            <svg className="absolute top-10 left-0 w-full h-[300px] overflow-visible" viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 150 Q 150 250 250 100 T 400 150 T 550 50" stroke="hsl(var(--accent))" strokeWidth="2" strokeDasharray="6 6" fill="none" />
              <circle cx="50" cy="150" r="4" fill="hsl(var(--accent))" />
              <circle cx="150" cy="200" r="4" fill="hsl(var(--accent))" />
              <circle cx="250" cy="100" r="4" fill="hsl(var(--accent))" />
              <circle cx="330" cy="120" r="4" fill="hsl(var(--accent))" />
              <circle cx="400" cy="150" r="4" fill="hsl(var(--accent))" />
              <circle cx="480" cy="90" r="4" fill="hsl(var(--accent))" />
              <circle cx="550" cy="50" r="4" fill="hsl(var(--accent))" />
            </svg>

            {/* Nodes */}
            <div className="absolute top-[130px] left-[30px] flex flex-col items-center">
              <div className="text-[10px] font-medium text-deep-space dark:text-slate-200 mb-2">Search</div>
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-accent/20 dark:border-accent/40 shadow-lg flex items-center justify-center text-accent"><Search size={18} /></div>
            </div>
            
            <div className="absolute top-[80px] left-[230px] flex flex-col items-center">
              <div className="text-[10px] font-medium text-deep-space dark:text-slate-200 mb-2">Book</div>
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-accent/20 dark:border-accent/40 shadow-lg flex items-center justify-center text-accent"><FileText size={18} /></div>
            </div>

            <div className="absolute top-[30px] left-[310px] flex flex-col items-center">
              <div className="text-[10px] font-medium text-deep-space dark:text-slate-200 mb-2">Fly</div>
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-accent/20 dark:border-accent/40 shadow-lg flex items-center justify-center text-accent"><Plane size={18} /></div>
            </div>

            <div className="absolute top-[60px] left-[380px] flex flex-col items-center">
              <div className="text-[10px] font-medium text-deep-space dark:text-slate-200 mb-2">Stay</div>
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-accent/20 dark:border-accent/40 shadow-lg flex items-center justify-center text-accent"><Hotel size={18} /></div>
            </div>

            <div className="absolute top-[20px] left-[460px] flex flex-col items-center">
              <div className="text-[10px] font-medium text-deep-space dark:text-slate-200 mb-2">Experiences</div>
              <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-accent/20 dark:border-accent/40 shadow-lg flex items-center justify-center text-accent"><Camera size={18} /></div>
            </div>

            <div className="absolute top-[0px] left-[530px] flex flex-col items-center">
              <div className="text-[10px] font-medium text-deep-space dark:text-slate-200 mb-2">Memories</div>
              <div className="w-12 h-12 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center text-white"><Heart size={18} fill="currentColor" /></div>
            </div>

            {/* Airplane Icon tracking the line */}
            <Plane size={24} className="absolute top-[132px] left-[270px] text-accent -rotate-[15deg] plane-fly opacity-0" />
            <div className="absolute top-[138px] left-[270px] w-24 h-[1px] bg-accent -rotate-[15deg] plane-fly opacity-0 origin-left" />
          </div>

        </div>
      </div>

      {/* Background Mountain Layer */}
      <div className="relative w-full h-[250px] sm:h-[350px] lg:h-[400px] mt-8 lg:-mt-10 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        {/* Masking the mountain so it fades into white at the top */}
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-slate-900 via-white/40 dark:via-slate-900/40 to-transparent z-10" />
        <img 
          src={siteData?.process_bg_image_url || "/images/hero_mountain_bg.jpg"} 
          alt="Mountains" 
          className="absolute inset-0 w-full h-full object-cover object-bottom"
        />
      </div>

    </section>
  );
}
