import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Hotel, Map, Search, MapPin, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "holidays", label: "Holidays", icon: Map },
];

const POPULAR_LOCATIONS = [
  "Dhaka, Bangladesh (DAC)",
  "Cox's Bazar, Bangladesh (CXB)",
  "Sylhet, Bangladesh (ZYL)",
  "Chittagong, Bangladesh (CGP)",
  "Malé, Maldives (MLE)",
  "Bali, Indonesia (DPS)",
  "Dubai, UAE (DXB)",
  "Singapore (SIN)",
  "Kathmandu, Nepal (KTM)",
  "Bangkok, Thailand (BKK)",
  "Kuala Lumpur, Malaysia (KUL)",
  "Istanbul, Turkey (IST)",
  "London, UK (LHR)",
  "New York, USA (JFK)"
];

const inputCls =
  "w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-white focus:outline-none placeholder:text-slate-400 placeholder:font-normal";

export default function SearchWidget() {
  const [active, setActive] = useState("flights");
  const [tripType, setTripType] = useState("oneway");
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSearch = (e) => {
    e.preventDefault();
    if (active === "hotels") {
      const q = form.destination ? `?q=${encodeURIComponent(form.destination)}` : "";
      navigate(`/hotels${q}`);
    } else if (active === "holidays") {
      const q = form.destination ? `?q=${encodeURIComponent(form.destination)}` : "";
      navigate(`/packages${q}`);
    } else {
      const q = new URLSearchParams();
      if (form.from) q.append("origin", form.from);
      if (form.to) q.append("destination", form.to);
      const qs = q.toString();
      navigate(`/flights${qs ? `?${qs}` : ""}`);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <datalist id="locations">
        {POPULAR_LOCATIONS.map(loc => <option key={loc} value={loc} />)}
      </datalist>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-2 sm:p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cn(
                "flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap",
                active === t.id ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              )}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="p-3 sm:p-5">
          {active === "flights" && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { id: "oneway", l: "One Way" },
                  { id: "round", l: "Round Trip" },
                  { id: "multi", l: "Multi City" },
                ].map((tt) => (
                  <button
                    type="button"
                    key={tt.id}
                    onClick={() => setTripType(tt.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      tripType === tt.id ? "bg-primary text-white border-primary" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-primary/40"
                    )}
                  >
                    {tt.l}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                <Field icon={MapPin} label="From">
                  <input list="locations" className={inputCls} placeholder="Dhaka (DAC)" value={form.from || ""} onChange={(e) => set("from", e.target.value)} />
                </Field>
                <Field icon={MapPin} label="To">
                  <input list="locations" className={inputCls} placeholder="Cox's Bazar (CXB)" value={form.to || ""} onChange={(e) => set("to", e.target.value)} />
                </Field>
                <Field icon={Calendar} label="Departure">
                  <input type="date" className={inputCls} value={form.depart || ""} onChange={(e) => set("depart", e.target.value)} />
                </Field>
                <Field icon={Calendar} label={tripType === "round" ? "Return" : "Travellers"}>
                  {tripType === "round" ? (
                    <input type="date" className={inputCls} value={form.return || ""} onChange={(e) => set("return", e.target.value)} />
                  ) : (
                    <input className={inputCls} placeholder="1 · Economy" value={form.travelers || ""} onChange={(e) => set("travelers", e.target.value)} />
                  )}
                </Field>
                <SearchBtn />
              </div>
            </>
          )}

          {active === "hotels" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              <Field icon={MapPin} label="Destination" wide>
                <input list="locations" className={inputCls} placeholder="Cox's Bazar, Bangladesh" value={form.destination || ""} onChange={(e) => set("destination", e.target.value)} />
              </Field>
              <Field icon={Calendar} label="Check-in">
                <input type="date" className={inputCls} value={form.checkin || ""} onChange={(e) => set("checkin", e.target.value)} />
              </Field>
              <Field icon={Calendar} label="Check-out">
                <input type="date" className={inputCls} value={form.checkout || ""} onChange={(e) => set("checkout", e.target.value)} />
              </Field>
              <Field icon={Users} label="Guests & Rooms">
                <input className={inputCls} placeholder="2 Guests · 1 Room" value={form.guests || ""} onChange={(e) => set("guests", e.target.value)} />
              </Field>
              <SearchBtn />
            </div>
          )}

          {active === "holidays" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <Field icon={MapPin} label="Where to?" wide>
                <input list="locations" className={inputCls} placeholder="Any destination" value={form.destination || ""} onChange={(e) => set("destination", e.target.value)} />
              </Field>
              <Field icon={Calendar} label="Travel Date">
                <input type="date" className={inputCls} value={form.date || ""} onChange={(e) => set("date", e.target.value)} />
              </Field>
              <Field icon={Users} label="Travellers">
                <input className={inputCls} placeholder="2 Travellers" value={form.travelers || ""} onChange={(e) => set("travelers", e.target.value)} />
              </Field>
              <SearchBtn />
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children, wide }) {
  return (
    <div className={cn("bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 transition-colors", wide && "sm:col-span-2 lg:col-span-1")}>
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">
        <Icon size={13} className="text-primary" /> {label}
      </div>
      {children}
    </div>
  );
}

function SearchBtn() {
  return (
    <button
      type="submit"
      className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 px-6 py-3 hover:shadow-lg hover:shadow-primary/30 transition-all"
    >
      <Search size={18} /> <span>Search</span>
    </button>
  );
}
