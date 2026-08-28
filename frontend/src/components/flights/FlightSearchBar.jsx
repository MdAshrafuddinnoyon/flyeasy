import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FlightSearchBar({ onSearch }) {
  const [searchParams] = useSearchParams();
  const [origin, setOrigin] = useState(searchParams.get("origin") || "");
  const [destination, setDestination] = useState(searchParams.get("destination") || "");
  const [date, setDate] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [flightClass, setFlightClass] = useState("Economy");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ origin, destination, date, travelers, flightClass });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative z-10 w-full max-w-5xl mx-auto -mt-10 sm:-mt-16">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 lg:items-end">
        
        {/* Origin & Destination */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">From</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="City or Airport (e.g. Dhaka)"
                required
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">To</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
              <input
                type="text"
                placeholder="City or Airport (e.g. Cox's Bazar)"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2 lg:w-48">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        {/* Travelers & Class */}
        <div className="space-y-2 lg:w-48">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Travellers & Class</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <div className="flex bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary transition-all">
              <input
                type="number"
                min="1"
                required
                value={travelers}
                onChange={(e) => setTravelers(Number(e.target.value))}
                className="w-16 pl-10 pr-2 py-3 bg-transparent border-none outline-none text-center"
              />
              <select 
                value={flightClass} 
                onChange={(e) => setFlightClass(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm pr-4 cursor-pointer"
              >
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 lg:pt-0">
          <Button type="submit" className="w-full lg:w-auto h-12 px-8 bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg shadow-accent/30 font-semibold text-lg transition-all hover:-translate-y-0.5">
            <Search className="w-5 h-5 mr-2" /> Search
          </Button>
        </div>

      </form>
    </div>
  );
}
