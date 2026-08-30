import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Calendar, Clock } from "lucide-react";
import BookingRow from "./BookingRow";
import PaymentModal from "./PaymentModal";
import Pagination from "@/components/admin/Pagination";

export default function BookingsPanel({ bookings }) {
  const [payBooking, setPayBooking] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const upcoming = bookings.filter(b => 
    b.status !== "cancelled" && b.status !== "completed" && (!b.travel_date || new Date(b.travel_date) >= today)
  );
  
  const history = bookings.filter(b => 
    b.status === "cancelled" || b.status === "completed" || (b.travel_date && new Date(b.travel_date) < today)
  );

  const totalUpcomingPages = Math.ceil(upcoming.length / ITEMS_PER_PAGE);
  const currentUpcoming = upcoming.slice((upcomingPage - 1) * ITEMS_PER_PAGE, upcomingPage * ITEMS_PER_PAGE);

  const totalHistoryPages = Math.ceil(history.length / ITEMS_PER_PAGE);
  const currentHistory = history.slice((historyPage - 1) * ITEMS_PER_PAGE, historyPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
          <Calendar size={22} className="text-primary" /> My Bookings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">All your upcoming trips and past history in one place.</p>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4">Upcoming Trips</h2>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-4 sm:p-6 border border-transparent dark:border-slate-800">
            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">No upcoming trips.</p>
                <Link to="/packages" className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold">
                  Browse Packages <Plane size={14} />
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-2.5">
                  {currentUpcoming.map((b) => (
                    <BookingRow key={b.id} b={b} onPay={setPayBooking} onClick={() => setViewBooking(b)} />
                  ))}
                </div>
                {totalUpcomingPages > 1 && (
                  <div className="mt-6">
                    <Pagination currentPage={upcomingPage} totalPages={totalUpcomingPages} onPageChange={setUpcomingPage} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-deep-space dark:text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-slate-400" /> Booking History
            </h2>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-4 sm:p-6 border border-transparent dark:border-slate-800 opacity-70 hover:opacity-100 transition-opacity">
              <div className="space-y-2.5">
                {currentHistory.map((b) => (
                  <BookingRow key={b.id} b={b} onClick={() => setViewBooking(b)} />
                ))}
              </div>
              {totalHistoryPages > 1 && (
                <div className="mt-6">
                  <Pagination currentPage={historyPage} totalPages={totalHistoryPages} onPageChange={setHistoryPage} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <PaymentModal booking={payBooking} onClose={() => setPayBooking(null)} />

      {/* Booking Details Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewBooking(null)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg border border-slate-100 dark:border-slate-800">
            <button onClick={() => setViewBooking(null)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors">
              ✕
            </button>
            <h2 className="text-2xl font-bold text-deep-space dark:text-white mb-1">Booking Details</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ref #: {viewBooking.id.toString().substring(0,8).toUpperCase()}</p>
            
            <div className="space-y-4 text-sm text-deep-space dark:text-slate-300">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Package / Service:</span>
                <span className="font-semibold text-right">{viewBooking.package_title || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Travel Date:</span>
                <span className="font-semibold">{viewBooking.travel_date ? new Date(viewBooking.travel_date).toLocaleDateString() : "TBD"}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Travelers:</span>
                <span className="font-semibold">{viewBooking.number_of_travelers || 1} Person(s)</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Total Price:</span>
                <span className="font-semibold text-primary">BDT {parseFloat(viewBooking.total_price || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold capitalize">{viewBooking.status}</span>
              </div>
              {viewBooking.message && (
                <div className="pt-2">
                  <span className="text-slate-500 block mb-1">Additional Notes:</span>
                  <p className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">{viewBooking.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

