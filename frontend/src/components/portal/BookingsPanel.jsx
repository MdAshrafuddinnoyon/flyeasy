import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plane, Calendar, Clock } from "lucide-react";
import BookingRow from "./BookingRow";
import PaymentModal from "./PaymentModal";

export default function BookingsPanel({ bookings }) {
  const [payBooking, setPayBooking] = useState(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const upcoming = bookings.filter(b => 
    b.status !== "cancelled" && b.status !== "completed" && (!b.travel_date || new Date(b.travel_date) >= today)
  );
  
  const history = bookings.filter(b => 
    b.status === "cancelled" || b.status === "completed" || (b.travel_date && new Date(b.travel_date) < today)
  );

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
              <div className="space-y-2.5">
                {upcoming.map((b) => (
                  <BookingRow key={b.id} b={b} onPay={setPayBooking} />
                ))}
              </div>
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
                {history.map((b) => (
                  <BookingRow key={b.id} b={b} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <PaymentModal booking={payBooking} onClose={() => setPayBooking(null)} />
    </div>
  );
}

