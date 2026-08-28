import React, { useState, useEffect } from "react";
import { X, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { Entities } from "@/lib/api";

export default function AnnouncementBanner() {
  const [items, setItems] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    Entities.announcements.list()
      .then((anns) => {
        setItems(anns.filter(a => a.active));
      })
      .catch(() => {});
  }, []);

  if (items.length === 0 || dismissed) return null;

  const getStyle = (type) => {
    if (type === 'success') return "bg-emerald-600 text-white";
    if (type === 'warning') return "bg-amber-500 text-white";
    return "bg-primary text-white";
  };

  const getIcon = (type) => {
    if (type === 'success') return <CheckCircle size={16} className="shrink-0" />;
    if (type === 'warning') return <AlertTriangle size={16} className="shrink-0" />;
    return <Info size={16} className="shrink-0" />;
  };

  return (
    <div id="announcement-banner" className="bg-primary text-white text-sm relative z-[60] shadow-sm overflow-hidden flex items-center">
      <div className="flex-1 overflow-hidden relative h-10 flex items-center">
        <div className="w-full relative overflow-hidden flex items-center h-full">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 absolute left-0 hover:[animation-play-state:paused]">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {getIcon(item.type)}
                  <span className="font-semibold">
                    {item.title}
                    {item.message && <span className="opacity-90 font-normal"> &mdash; {item.message}</span>}
                  </span>
                  {item.link_url && (
                    <a href={item.link_url} className="underline hover:opacity-80 font-medium ml-1">Learn more</a>
                  )}
                  <span className="mx-6 text-white/30 text-lg">&bull;</span>
                </div>
              ))}
              {/* Duplicate for seamless looping */}
              {items.map((item, idx) => (
                <div key={`dup-${idx}`} className="flex items-center gap-3">
                  {getIcon(item.type)}
                  <span className="font-semibold">
                    {item.title}
                    {item.message && <span className="opacity-90 font-normal"> &mdash; {item.message}</span>}
                  </span>
                  {item.link_url && (
                    <a href={item.link_url} className="underline hover:opacity-80 font-medium ml-1">Learn more</a>
                  )}
                  <span className="mx-6 text-white/30 text-lg">&bull;</span>
                </div>
              ))}
            </div>
        </div>
      </div>
      <button onClick={() => setDismissed(true)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 shrink-0 bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition-colors z-10" aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
