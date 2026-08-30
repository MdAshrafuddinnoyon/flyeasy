import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { useTrip } from '@/context/TripContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const tran_id = searchParams.get('tran_id');
  const { clearTrip } = useTrip();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearTrip();
      setCleared(true);
    }
  }, [clearTrip, cleared]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-float p-8 text-center border border-slate-100 dark:border-slate-800 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500 w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-deep-space dark:text-white mb-2">Payment Successful!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Your trip has been booked successfully. An email confirmation has been sent to you.
        </p>
        
        {tran_id && (
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-4 mb-8 text-left border border-slate-100 dark:border-slate-800">
            <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Transaction ID</div>
            <div className="font-mono text-sm font-medium text-deep-space dark:text-white break-all">{tran_id}</div>
          </div>
        )}

        <div className="space-y-3">
          <Link to="/client" className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:-translate-y-0.5 transition-transform shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
            View My Bookings <ChevronRight size={18} />
          </Link>
          <Link to="/" className="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold py-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
