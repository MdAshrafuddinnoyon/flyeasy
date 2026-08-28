import React from "react";
import { LayoutGrid, Calendar, Heart, Wallet, LifeBuoy, Gift, Settings, LogOut, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import DeveloperCredit from "@/components/DeveloperCredit";

const SECTIONS = [
  {
    group: "Basic",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid },
      { id: "bookings", label: "My Bookings", icon: Calendar },
      { id: "favorites", label: "Favorites", icon: Heart },
      { id: "reviews", label: "My Reviews", icon: Star },
      { id: "payments", label: "Payments", icon: Wallet },
    ],
  },
  {
    group: "Support",
    items: [
      { id: "guide", label: "Request Guide", icon: LifeBuoy },
      { id: "rewards", label: "Rewards", icon: Gift },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function PortalSidebar({ active, setActive, onLogout }) {
  const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

  return (
    <>
      {/* Mobile Bottom Navigation (App-like) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center overflow-x-auto no-scrollbar z-[60] px-2 py-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {ALL_ITEMS.map((it) => (
          <button
            key={it.id}
            onClick={() => setActive(it.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-2xl transition-all shrink-0 min-w-[72px]",
              active === it.id ? "text-primary" : "text-slate-500 hover:text-deep-space dark:hover:text-white"
            )}
          >
            <div className={cn("p-1.5 rounded-xl mb-1 transition-colors", active === it.id ? "bg-primary/10 dark:bg-primary/20" : "")}>
              <it.icon size={20} className={active === it.id ? "text-primary" : "opacity-70"} />
            </div>
            <span className="text-[10px] font-bold">{it.label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center p-2 rounded-2xl transition-all shrink-0 min-w-[72px] text-red-500"
        >
          <div className="p-1.5 rounded-xl mb-1">
            <LogOut size={20} className="opacity-70" />
          </div>
          <span className="text-[10px] font-bold">Log Out</span>
        </button>
      </nav>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="bg-deep-space dark:bg-slate-950 text-slate-300 rounded-3xl shadow-float p-4 sticky top-24 border border-transparent dark:border-slate-800 flex flex-col min-h-[calc(100vh-8rem)]">
          <div className="flex-1">
            {SECTIONS.map((sec, idx) => (
              <div key={sec.group} className="mb-4 last:mb-0">
                <div className="space-y-1">
                  {sec.items.map((it) => (
                    <button
                      key={it.id}
                      onClick={() => setActive(it.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        active === it.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-400 hover:text-white hover:bg-white/10"
                      )}
                    >
                      <it.icon size={18} className={active === it.id ? "text-white" : "text-primary"} /> 
                      {it.label}
                    </button>
                  ))}
                </div>
                {idx === 0 && <div className="my-4 border-t border-white/5" />}
              </div>
            ))}
            
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all mt-2"
            >
              <LogOut size={18} /> Log Out
            </button>
          </div>

          <div className="mt-auto pt-4 border-t border-white/10 dark:border-slate-800 flex justify-center">
            <DeveloperCredit variant="dark" />
          </div>
        </div>
      </aside>
    </>
  );
}

