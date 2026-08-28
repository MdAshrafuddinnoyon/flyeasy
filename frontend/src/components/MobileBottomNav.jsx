import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Package, Hotel, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function MobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: "Home", to: "/", icon: Home },
    { label: "Packages", to: "/packages", icon: Package },
    { label: "Hotels", to: "/hotels", icon: Hotel },
    { label: "Account", to: user ? "/portal" : "/login", icon: User },
  ];

  return (
    <>
      {/* Spacer so content doesn't get hidden behind the fixed bottom nav on mobile */}
      <div className="h-16 md:hidden" />
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-[#0a0a0c] border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to !== "/" && location.pathname.startsWith(item.to));
            return (
              <Link
                key={item.label}
                to={item.to}
                className="flex flex-col items-center justify-center w-full h-full space-y-1 relative group"
              >
                <div className={cn(
                  "p-1 rounded-full transition-all duration-300",
                  isActive ? "bg-red-50 text-red-500 scale-110" : "text-slate-500 dark:text-slate-400 group-hover:text-red-400"
                )}>
                  <item.icon size={20} className={isActive ? "fill-red-500/20" : ""} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-red-500" : "text-slate-500 dark:text-slate-400 group-hover:text-red-400"
                )}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-red-500 rounded-b-full shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
