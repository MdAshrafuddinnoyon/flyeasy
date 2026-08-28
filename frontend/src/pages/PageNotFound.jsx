import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PageNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-[150px] sm:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent select-none drop-shadow-sm">
            404
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">
            Looks like you're lost in the clouds!
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <Link 
            to="/" 
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all w-full sm:w-auto justify-center"
          >
            <Home size={18} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
