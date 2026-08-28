import React from "react";
import { Link } from "react-router-dom";
import { Plane, Hotel, Map, Train, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import LogoTicker from "@/components/LogoTicker";

const SERVICES = [
  { icon: Plane, title: "Flight Booking", desc: "Book domestic and international flights at the best fares with flexible travel options.", to: "/flights" },
  { icon: Hotel, title: "Hotel Booking", desc: "Comfortable stays for every budget, from luxury hotels to affordable rooms.", to: "/hotels" },
  { icon: Map, title: "Holiday Packages", desc: "Book domestic and international flights at the best fares with flexible travel options.", to: "/packages" },
  { icon: Train, title: "Train Booking", desc: "Book comfortable and seamless train travel for India and beyond.", to: "/contact" },
];

const IMG_LEFT_1 = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800"; // Airplane
const IMG_LEFT_2 = "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800"; // Hotel room
const IMG_RIGHT = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000"; // Bali/tropical

export default function ServicesSection({ partners = [] }) {
  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 mb-12">
          {/* Left Top: Text and Small Images */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                • Our Services
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-deep-space dark:text-white leading-tight mb-5">
                Your <span className="text-accent">Trusted Partner</span> for<br/>Flights, Holidays & Travel
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base max-w-md">
                FlyEasy helps you book flights, plan vacations, and manage travel with ease. From bookings to support, we make every journey smooth and stress-free.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="rounded-2xl overflow-hidden h-32 sm:h-40">
                <Image src={IMG_LEFT_1} alt="Travel" fittingType="cover" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="rounded-2xl overflow-hidden h-32 sm:h-40">
                <Image src={IMG_LEFT_2} alt="Travel 2" fittingType="cover" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </div>

          {/* Right Top: Large Image with floating card */}
          <div className="relative">
            <div className="rounded-[2.5rem] overflow-hidden h-[300px] sm:h-[450px]">
              <Image src={IMG_RIGHT} alt="Explore" fittingType="cover" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            
            {/* Overlapping Card */}
            <div className="absolute -bottom-6 -left-4 sm:-left-12 sm:bottom-8 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-float-lg max-w-sm border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-deep-space dark:text-white text-lg">Travel stress? Leave it to us</h3>
                <span className="text-accent font-black text-xl italic leading-none">fly<br/>easy</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                From affordable flight deals to complete travel assistance, we handle everything so you can enjoy your trip without the hassle.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-[10px] font-bold text-deep-space dark:text-white uppercase tracking-wider hover:text-accent dark:hover:text-accent transition-colors">
                Explore Services <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: 4 Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 lg:mt-24">
          {SERVICES.map((s) => (
            <Link key={s.title} to={s.to} className="group bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-900 rounded-3xl p-6 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-float transition-all">
              <div className="w-10 h-10 mb-4 text-slate-400 group-hover:text-accent transition-colors">
                <s.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-deep-space dark:text-white text-base mb-2">{s.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
            </Link>
          ))}
        </div>

        {/* Partners Ticker - placed exactly underneath services as requested */}
        {partners && partners.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <LogoTicker title="OUR PARTNERS" items={partners} />
          </div>
        )}

      </div>
    </section>
  );
}
