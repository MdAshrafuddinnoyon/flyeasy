import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Cookie } from "lucide-react";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("flyeasy_cookie_consent");
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("flyeasy_cookie_consent", "all");
    setShow(false);
  };

  const acceptEssential = () => {
    localStorage.setItem("flyeasy_cookie_consent", "essential");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-5 z-[100] transform transition-all duration-500 translate-y-0 opacity-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Cookie size={20} />
          <span>We value your privacy</span>
        </div>
        <button onClick={acceptEssential} className="text-slate-400 hover:text-deep-space dark:hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
        We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
        {" "}
        <Link to="/cookie-policy" className="text-primary hover:underline font-medium">Read our Cookie Policy</Link>.
      </p>
      <div className="flex gap-2">
        <button onClick={acceptEssential} className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-deep-space dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          Decline
        </button>
        <button onClick={acceptAll} className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
          Accept All
        </button>
      </div>
    </div>
  );
}
