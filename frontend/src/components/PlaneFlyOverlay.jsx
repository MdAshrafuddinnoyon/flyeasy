import React, { useEffect } from "react";
import { Plane } from "lucide-react";

export default function PlaneFlyOverlay({ onDone }) {
  useEffect(() => {
    const t = setTimeout(() => onDone && onDone(), 1700);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[90] pointer-events-none flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]" />
      <Plane className="plane-fly text-primary drop-shadow-lg" size={56} strokeWidth={2.2} />
      <p className="absolute bottom-1/3 left-0 right-0 text-center text-deep-space font-semibold text-lg animate-fade-in px-4">
        Your booking is taking off! ✈️
      </p>
    </div>
  );
}
