import React from "react";
import { Gift, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

export default function RewardsPanel() {
  const { user } = useAuth();
  
  const points = user?.reward_points || 0;
  // Let's say 1 point = 10 BDT discount for visualization
  const discountValue = points * 10;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
          <Gift size={24} className="text-primary" /> My Rewards
        </h1>
        <p className="text-slate-500 mt-1">Earn points on bookings and redeem them for exclusive discounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-primary to-accent text-white p-8 rounded-3xl shadow-float-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
            <Gift size={120} />
          </div>
          <div className="relative z-10">
            <div className="text-white/80 font-semibold uppercase tracking-wider text-sm mb-2">Total Points</div>
            <div className="text-6xl font-black mb-6">{points.toLocaleString()}</div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-block">
              <div className="text-sm font-semibold">Value Equivalent</div>
              <div className="text-2xl font-bold">৳{discountValue.toLocaleString()} off</div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-float border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-deep-space dark:text-white mb-6 flex items-center gap-2">
            <Sparkles className="text-amber-500" /> How to Earn
          </h2>
          
          <ul className="space-y-4">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500 text-sm">1</div>
              <div>
                <h4 className="font-bold text-deep-space dark:text-white text-sm">Book Packages</h4>
                <p className="text-xs text-slate-500 mt-1">Book holiday packages through FlyEasy.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500 text-sm">2</div>
              <div>
                <h4 className="font-bold text-deep-space dark:text-white text-sm">Travel Multiple Times</h4>
                <p className="text-xs text-slate-500 mt-1">If you plan up to 2 trips in a single month, you'll earn 100 bonus points for each confirmed booking.</p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 font-bold text-slate-500 text-sm">3</div>
              <div>
                <h4 className="font-bold text-deep-space dark:text-white text-sm">Redeem Discounts</h4>
                <p className="text-xs text-slate-500 mt-1">Contact your travel agent or our support team to apply your points as a discount on your next booking!</p>
              </div>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-border dark:border-slate-800 text-center">
            <Link to="/packages" className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-deep-space dark:text-white font-semibold w-full py-3 rounded-xl transition-colors text-sm">
              Explore Packages <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
