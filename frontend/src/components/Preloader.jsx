import React, { useState, useEffect } from "react";
import { Plane } from "lucide-react";
import Logo from "@/components/Logo";

export default function Preloader() {
  const [out, setOut] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1800);
    const t2 = setTimeout(() => setDone(true), 2350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (done) return null;

  return (
    <div className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center ${out ? "preloader-out" : ""}`}>
      <div className="relative w-60 h-16 overflow-hidden mb-6">
        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-primary/25" />
        <Plane className="absolute top-1/2 -translate-y-1/2 text-primary preloader-plane" size={36} strokeWidth={2.2} />
      </div>
      <Logo variant="light" className="h-9 mb-2" />
      <p className="text-sm text-slate-400 font-medium">Preparing your journey…</p>
    </div>
  );
}

