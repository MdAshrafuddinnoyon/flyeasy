import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckCircle, ArrowRight, Home } from "lucide-react";

export default function ThankYou() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type"); // 'booking' or 'contact'

  const isBooking = type === "booking";

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 dark:bg-background flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-[2rem] p-10 sm:p-14 text-center shadow-float border border-slate-100 dark:border-slate-800" data-aos="zoom-in">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={48} className="text-emerald-500" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">
          {isBooking ? "Booking Received!" : "Message Sent!"}
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 leading-relaxed">
          {isBooking 
            ? "Thank you for choosing FlyEasy. We have received your booking request. Our team will review the details and get back to you shortly to confirm your itinerary and payment."
            : "Thank you for reaching out to us. We have received your message and one of our support agents will get back to you as soon as possible."}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20">
            <Home size={18} /> Back to Home
          </Link>
          {isBooking && (
            <Link to="/portal" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-deep-space dark:text-white font-semibold px-8 py-3.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5">
              Go to Dashboard <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
