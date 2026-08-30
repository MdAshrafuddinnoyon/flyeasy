import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Plane, ArrowLeftRight, CheckCircle2, Download } from "lucide-react";
import Marquee from "react-fast-marquee";
import { useQuery } from '@tanstack/react-query';
import { Entities } from '@/lib/api';
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import FlightSearchBar from "@/components/flights/FlightSearchBar";
import { generateBookingPDF } from "@/lib/pdfGenerator";
import LogoTicker from "@/components/LogoTicker";
import { useCompare } from "@/context/CompareContext";
import { useTrip } from "@/context/TripContext";
import { useSiteContent } from "@/context/SiteContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Flights() {
  const { toast } = useToast();
  const { user, setShowAuthModal } = useAuth();
  const { addToCompare } = useCompare();
  const { addToTrip } = useTrip();
  const { siteData } = useSiteContent();
  const [urlParams] = useSearchParams();
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customer_name: "", customer_email: "", customer_phone: "", travel_date: "", number_of_travelers: 1, message: ""
  });
  const [recentBooking, setRecentBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [airlines, setAirlines] = useState([]);
  
  const [searchParams, setSearchParams] = useState({
    origin: urlParams.get("origin") || "",
    destination: urlParams.get("destination") || ""
  });

  const { data: flights = [], isLoading: loading } = useQuery({
    queryKey: ['flights'],
    queryFn: async () => {
      const [flightsData, airlinesData] = await Promise.all([
        Entities.flights.list(),
        Entities.airlines.list()
      ]);
      setAirlines(airlinesData.filter(a => a.active));
      return flightsData;
    }
  });

  const filteredFlights = useMemo(() => {
    return flights.filter(f => {
      if (searchParams.origin && !f.origin.toLowerCase().includes(searchParams.origin.toLowerCase())) return false;
      if (searchParams.destination && !f.destination.toLowerCase().includes(searchParams.destination.toLowerCase())) return false;
      return true;
    });
  }, [flights, searchParams]);

  const handleBookClick = (f) => {
    setSelectedFlight(f);
    setBookingForm({
      customer_name: user?.name || "",
      customer_email: user?.email || "",
      customer_phone: user?.phone || "",
      travel_date: "",
      number_of_travelers: 1,
      message: ""
    });
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!user) {
        setShowAuthModal(true);
        return;
    }
    if (!bookingForm.customer_name || !bookingForm.customer_email || !bookingForm.customer_phone) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    try {
      const data = await Entities.bookings.create({
        ...bookingForm,
        package_id: selectedFlight.id,
        package_title: selectedFlight.flight_code,
        item_type: "flight",
        total_price: selectedFlight.price * bookingForm.number_of_travelers,
        status: "pending",
      });
      setCreatedBooking(data);
      setSubmitting(false);
      setShowBookingModal(false);
      setRecentBooking(data);
      setShowThankYouModal(true);
    } catch {
      setSubmitting(false);
      toast({ title: "Failed to book flight.", variant: "destructive" });
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 bg-deep-space overflow-hidden">
        <img src={siteData?.flights_hero_url || "/images/hero_flights.jpg"} alt="Flights" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3">
            <Plane size={16} /> Flight Search
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Find your next flight</h1>
          <p className="text-white/70 max-w-xl mx-auto">Book flights easily and securely with FlyEasy</p>
        </div>
      </div>

      <FlightSearchBar onSearch={setSearchParams} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-20 mt-10">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 shadow-float rounded-2xl p-4 sm:p-6 mb-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Plane size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-deep-space dark:text-white">
                {searchParams.origin || searchParams.destination ? `Flights from ${searchParams.origin || 'Anywhere'} to ${searchParams.destination || 'Anywhere'}` : 'Available Flights'}
              </h2>
              <span className="text-sm text-slate-500">{filteredFlights.length} flights found</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="p-10 text-center text-slate-500">Loading flights...</div>
          ) : filteredFlights.length === 0 ? (
            <div className="p-10 text-center text-slate-500">No flights found matching your search.</div>
          ) : filteredFlights.map((f, i) => (
            <div key={i} className="bg-card rounded-3xl shadow-float p-5 hover:shadow-float-lg transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Plane size={20} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg text-deep-space dark:text-white">{f.flight_code}</div>
                    <div className="text-sm text-slate-500">{f.airline}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 sm:px-8">
                  <div className="text-center">
                    <div className="text-lg font-bold text-deep-space dark:text-white">{formatTime(f.departure_time)}</div>
                    <div className="text-sm text-slate-500 font-medium">{f.origin}</div>
                  </div>
                  <div className="flex flex-col items-center justify-center px-4">
                    <span className="text-xs text-slate-400 mb-1">Direct</span>
                    <div className="w-16 sm:w-24 border-t border-slate-200 dark:border-slate-700 relative">
                      <ArrowLeftRight size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-300 bg-card px-1" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-deep-space dark:text-white">{formatTime(f.arrival_time)}</div>
                    <div className="text-sm text-slate-500 font-medium">{f.destination}</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-3 mt-4 sm:mt-0">
                  <div className="text-center sm:text-right">
                    <div className="text-xs text-slate-500">Price</div>
                    <div className="text-xl font-bold text-primary">৳{f.price.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => addToCompare({ type: 'flight', id: f.id, title: f.flight_code, price: f.price, image: '/images/hero_flights.jpg', duration: 'Flight' })} 
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary hover:border-primary transition-all text-sm font-semibold whitespace-nowrap" title="Compare"
                    >
                      Compare
                    </button>
                    <button onClick={() => handleBookClick(f)} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors text-sm whitespace-nowrap">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Booking Form Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Book Flight {selectedFlight?.flight_code}</DialogTitle>
            <DialogDescription>Please provide traveler details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleConfirmBooking} className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Full Name *</label>
              <input type="text" required value={bookingForm.customer_name} onChange={e => setBookingForm({...bookingForm, customer_name: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Email *</label>
              <input type="email" required value={bookingForm.customer_email} onChange={e => setBookingForm({...bookingForm, customer_email: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Phone *</label>
              <input type="text" required value={bookingForm.customer_phone} onChange={e => setBookingForm({...bookingForm, customer_phone: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Travel Date *</label>
                <input type="date" required value={bookingForm.travel_date} onChange={e => setBookingForm({...bookingForm, travel_date: e.target.value})} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1 block">Travelers *</label>
                <input type="number" min="1" required value={bookingForm.number_of_travelers} onChange={e => setBookingForm({...bookingForm, number_of_travelers: parseInt(e.target.value)||1})} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-primary/50 text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between font-bold text-lg pt-4 border-t">
              <span>Total:</span>
              <span>৳{(selectedFlight?.price * bookingForm.number_of_travelers || 0).toLocaleString()}</span>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 mt-2">
              {submitting ? "Submitting..." : "Confirm Booking"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
      {/* Top Airlines Slider */}
      {airlines.length > 0 && (
        <div className="border-t border-slate-100 dark:border-white/10 mt-12">
          <LogoTicker title="SEARCH TOP AIRLINES" items={airlines} />
        </div>
      )}
    </div>
  );
}
