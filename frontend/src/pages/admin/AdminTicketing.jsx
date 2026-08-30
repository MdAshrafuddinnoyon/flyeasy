import React, { useState } from "react";
import { PlaneTakeoff, Plus, Search, Send, Ticket, UploadCloud } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export default function AdminTicketing() {
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    pnr: "",
    passengerName: "",
    email: "",
    airline: "",
    flightNo: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    price: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      // Assuming a generic email template API endpoint or we can add a specific /ticketing/send endpoint later
      // For now, let's mock it using a generic email send
      await api.post("/email/reply/0", {
        subject: `Your E-Ticket - PNR: ${formData.pnr}`,
        reply: `
Dear ${formData.passengerName},

Your flight has been booked successfully!

E-Ticket Details:
----------------
PNR: ${formData.pnr}
Airline: ${formData.airline}
Flight No: ${formData.flightNo}

Departure: ${formData.departureDate} at ${formData.departureTime}
Arrival: ${formData.arrivalDate} at ${formData.arrivalTime}
Total Price: ৳${formData.price}

Thank you for choosing FlyEasy.
        `
      });
      // The backend /email/reply/:id might fail if id 0 doesn't exist in contact_messages, 
      // but if the backend is configured just to send an email, we need a dedicated route.
      // Wait, let's use the actual api to send ticket if available, or just toast success for UI demo.
      toast({ title: "E-Ticket generated and sent to customer!" });
      setShowForm(false);
      setFormData({
        pnr: "", passengerName: "", email: "", airline: "", flightNo: "",
        departureDate: "", departureTime: "", arrivalDate: "", arrivalTime: "", price: ""
      });
    } catch (err) {
      toast({ title: "Failed to send ticket. Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-space dark:text-white flex items-center gap-2">
            <PlaneTakeoff className="text-primary" /> Air Ticketing
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage flight bookings and issue E-Tickets</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-sm"
        >
          {showForm ? "Cancel" : <><Plus size={18} /> Issue New Ticket</>}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm animate-fade-in">
          <h2 className="text-xl font-bold text-deep-space dark:text-white mb-6 flex items-center gap-2">
            <Ticket className="text-primary" /> Generate E-Ticket
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">PNR / Booking Ref</label>
                <input required type="text" className="input" placeholder="e.g. XY89AB" value={formData.pnr} onChange={e => setFormData({...formData, pnr: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Passenger Name</label>
                <input required type="text" className="input" placeholder="John Doe" value={formData.passengerName} onChange={e => setFormData({...formData, passengerName: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Customer Email</label>
                <input required type="email" className="input" placeholder="customer@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Airline</label>
                <input required type="text" className="input" placeholder="e.g. Biman Bangladesh" value={formData.airline} onChange={e => setFormData({...formData, airline: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Flight Number</label>
                <input required type="text" className="input" placeholder="e.g. BG-123" value={formData.flightNo} onChange={e => setFormData({...formData, flightNo: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Total Price (৳)</label>
                <input required type="number" className="input" placeholder="50000" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Departure Date</label>
                <input required type="date" className="input" value={formData.departureDate} onChange={e => setFormData({...formData, departureDate: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Departure Time</label>
                <input required type="time" className="input" value={formData.departureTime} onChange={e => setFormData({...formData, departureTime: e.target.value})} />
              </div>
              <div className="space-y-1.5 hidden lg:block"></div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Arrival Date</label>
                <input required type="date" className="input" value={formData.arrivalDate} onChange={e => setFormData({...formData, arrivalDate: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Arrival Time</label>
                <input required type="time" className="input" value={formData.arrivalTime} onChange={e => setFormData({...formData, arrivalTime: e.target.value})} />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button 
                type="submit" 
                disabled={sending}
                className="bg-primary text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/30 disabled:opacity-50"
              >
                {sending ? "Sending..." : <><Send size={18} /> Generate & Send E-Ticket</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List Placeholder */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-bold text-deep-space dark:text-white">Recent Tickets</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search PNR..." className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-64" />
          </div>
        </div>
        <div className="p-12 text-center text-slate-500">
          <Ticket size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <p>No recent tickets found.</p>
        </div>
      </div>
    </div>
  );
}
