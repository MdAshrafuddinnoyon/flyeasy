import React, { useState, useEffect } from "react";
import { X, Map, Trash2, Plane, CreditCard, ChevronRight, CheckCircle2, User, Mail, Phone, Calendar } from "lucide-react";
import { useTrip } from "@/context/TripContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export default function TripPanel() {
  const { tripItems, isTripOpen, setIsTripOpen, removeFromTrip, updateGuests, clearTrip } = useTrip();
  const { user, setShowAuthModal } = useAuth();
  const { toast } = useToast();
  
  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCustomer({ name: user.name || user.full_name || "", email: user.email || "", phone: user.phone || "" });
    }
  }, [user]);

  if (!isTripOpen) return null;

  const totalAmount = tripItems.reduce((sum, item) => sum + (item.price * (item.guests || 1)), 0);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login to proceed with checkout", variant: "destructive" });
      setShowAuthModal(true);
      return;
    }
    if (!customer.name || !customer.email || !customer.phone) {
      toast({ title: "Please fill your contact details", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Call backend payment init
      const { url } = await api.post("/payment/init", {
        items: tripItems,
        customer,
        totalAmount
      });
      if (url) {
        window.location.href = url; // Redirect to SSLCommerz
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to initiate payment", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-fade-in"
        onClick={() => setIsTripOpen(false)}
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white dark:bg-slate-950 z-[100] shadow-2xl flex flex-col animate-slide-left">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Map size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-deep-space dark:text-white leading-tight">My Trip Builder</h2>
              <p className="text-xs text-slate-500 font-medium">{tripItems.length} items selected</p>
            </div>
          </div>
          <button 
            onClick={() => setIsTripOpen(false)}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 no-scrollbar flex flex-col gap-4">
          {tripItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center pb-12">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Plane size={48} className="text-primary/40" />
              </div>
              <h3 className="font-bold text-xl text-deep-space dark:text-white mb-2">Your trip is empty</h3>
              <p className="text-slate-500 text-sm max-w-[250px]">Start exploring our packages and hotels to build your dream itinerary!</p>
              <button 
                onClick={() => setIsTripOpen(false)}
                className="mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-semibold text-sm hover:-translate-y-0.5 transition-transform"
              >
                Browse Destinations
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-deep-space dark:text-white">Selected Items</h3>
                <button 
                  onClick={clearTrip}
                  className="text-xs font-semibold text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>

              <div className="space-y-4">
                {tripItems.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative group">
                    <button 
                      onClick={() => removeFromTrip(item.id)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors z-10 opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                    
                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">{item.type}</div>
                        <h4 className="font-bold text-deep-space dark:text-white text-sm line-clamp-2 leading-snug">{item.title}</h4>
                      </div>
                      
                      <div className="flex items-end justify-between mt-2">
                        <div className="font-bold text-deep-space dark:text-white text-sm">
                          ৳{item.price.toLocaleString()}
                        </div>
                        <div className="flex items-center bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                          <button 
                            onClick={() => updateGuests(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-deep-space dark:hover:text-white font-medium"
                          >-</button>
                          <span className="w-6 text-center text-xs font-bold">{item.guests || 1}</span>
                          <button 
                            onClick={() => updateGuests(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-deep-space dark:hover:text-white font-medium"
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <h3 className="font-bold text-deep-space dark:text-white mb-4">Traveler Details</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Full Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" placeholder="Email Address" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Phone Number" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {tripItems.length > 0 && (
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-deep-space dark:text-white">৳{totalAmount.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:-translate-y-1 transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:transform-none"
            >
              {loading ? "Processing..." : (
                <>
                  <CreditCard size={20} /> Checkout & Pay
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-slate-400">
              <CheckCircle2 size={12} className="text-green-500" /> Secure payment via SSLCommerz
            </div>
          </div>
        )}
      </div>
    </>
  );
}
