import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function PaymentFail({ cancel = false }) {
  const { setIsTripOpen } = useTrip();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-float p-8 text-center border border-slate-100 dark:border-slate-800 animate-fade-in">
        <div className={`w-20 h-20 ${cancel ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-500' : 'bg-red-100 dark:bg-red-500/20 text-red-500'} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-deep-space dark:text-white mb-2">
          {cancel ? 'Payment Cancelled' : 'Payment Failed'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          {cancel 
            ? "You cancelled the payment process. Your trip items have been saved in your builder."
            : "We couldn't process your payment. Please try again with a different payment method."
          }
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => {
              window.location.href = '/';
              // Hack to open trip panel after navigation
              setTimeout(() => setIsTripOpen(true), 500);
            }} 
            className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} /> Try Again
          </button>
          <Link to="/" className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
