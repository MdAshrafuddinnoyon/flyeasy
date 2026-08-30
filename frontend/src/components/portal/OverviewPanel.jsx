import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Plane, CheckCircle2, CloudSun, Bell, ArrowRight, Compass } from "lucide-react";
import WeatherWidget from "@/components/WeatherWidget";
import BookingRow from "./BookingRow";

export default function OverviewPanel({ user, bookings, announcements, weatherCity, onBookingClick }) {
  const today = new Date();
  const stats = [
    { label: "Total Bookings", value: bookings.length, icon: Calendar },
    { label: "Upcoming", value: bookings.filter((b) => b.travel_date && new Date(b.travel_date) >= today && b.status !== "cancelled").length, icon: Plane },
    { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Welcome, {user?.full_name || user?.email || "Traveller"}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage your trips, check the weather, and connect with local guides.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl shadow-float p-3 sm:p-5 border border-transparent dark:border-slate-800">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
              <s.icon size={18} className="text-primary" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-deep-space dark:text-white">{s.value}</div>
            <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-float p-4 sm:p-6 border border-transparent dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-deep-space dark:text-white flex items-center gap-2"><Plane size={18} className="text-primary" /> Recent Bookings</h2>
            <Link to="/packages" className="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">Browse <ArrowRight size={14} /></Link>
          </div>
          {bookings.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">No bookings yet.</p>
              <Link to="/packages" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold">Browse Packages <Plane size={14} /></Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookings.slice(0, 5).map((b) => <BookingRow key={b.id} b={b} onClick={() => onBookingClick && onBookingClick(b)} />)}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-4 sm:p-6 border border-transparent dark:border-slate-800">
            <h2 className="font-bold text-deep-space dark:text-white mb-4 flex items-center gap-2"><CloudSun size={18} className="text-primary" /> Weather</h2>
            <WeatherWidget city={weatherCity} />
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-4 sm:p-6 border border-transparent dark:border-slate-800">
            <h2 className="font-bold text-deep-space dark:text-white mb-4 flex items-center gap-2"><Bell size={18} className="text-primary" /> Announcements</h2>
            {announcements.length === 0 ? <p className="text-sm text-slate-400">No announcements right now.</p> : (
              <div className="space-y-3">
                {announcements.slice(0, 3).map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700">
                    <div className="font-semibold text-sm text-deep-space dark:text-white">{a.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{a.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

