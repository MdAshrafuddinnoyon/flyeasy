import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteContent } from "@/context/SiteContext";

export default function PageNotFound() {
  const { siteData } = useSiteContent();
  const bgImage = siteData?.not_found_bg_url || "/images/hero_flights.jpg";

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage} 
          alt="404 Background" 
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90 pointer-events-none" />
      </div>

      <div className="max-w-3xl w-full text-center relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        >
          <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none drop-shadow-2xl">
            404
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-3xl shadow-2xl inline-block mt-4 w-full max-w-2xl mx-auto"
        >
          <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4">
            Looks like you're lost in the clouds!
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-lg mx-auto">
            The flight you are looking for might have been diverted, had its gate changed, or is temporarily unavailable. Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.history.back()} 
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>
            <Link 
              to="/" 
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all w-full sm:w-auto justify-center"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
