import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Check, X, ArrowLeft, Calendar, Users, Phone, Mail, User, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ThankYouModal from "@/components/ThankYouModal";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Entities } from '@/lib/api';
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import PlaneFlyOverlay from "@/components/PlaneFlyOverlay";

import { useAuth } from "@/context/AuthContext";

export default function PackageDetail() {
const { id } = useParams();
const navigate = useNavigate();
const { toast } = useToast();
const { user, setShowAuthModal } = useAuth();

const { data: pkg, isLoading: loading } = useQuery({
  queryKey: ['package', id],
  queryFn: () => Entities.packages.get(id),
});

const { data: reviews = [] } = useQuery({
  queryKey: ['reviews_for', id],
  queryFn: async () => {
    const all = await Entities.package_reviews.list();
    return all.filter(r => r.item_id === id && r.status === 'approved');
  },
  enabled: !!id,
});

const [activeImage, setActiveImage] = useState(0);
const [booking, setBooking] = useState({
customer_name: user?.full_name || "",
customer_email: user?.email || "",
customer_phone: user?.phone || "",
travel_date: "",
number_of_travelers: 1,
message: "",
});

useEffect(() => {
  if (user) {
    setBooking(prev => ({
      ...prev,
      customer_name: user.name || prev.customer_name,
      customer_email: user.email || prev.customer_email,
      customer_phone: user.phone || prev.customer_phone,
    }));
  }
}, [user]);
const [submitting, setSubmitting] = useState(false);
const [flying, setFlying] = useState(false);
const [showThankYou, setShowThankYou] = useState(false);

const gallery = pkg?.gallery?.length ? pkg.gallery : [pkg?.image_url].filter(Boolean);

const bookingMutation = useMutation({
  mutationFn: (newBooking) => Entities.bookings.create(newBooking),
  onSuccess: () => {
    setFlying(true);
    toast({ title: "Booking request submitted! We'll contact you shortly." });
    setBooking({ customer_name: "", customer_email: "", customer_phone: "", travel_date: "", number_of_travelers: 1, message: "" });
  },
  onError: () => {
    toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
  },
  onSettled: () => setSubmitting(false)
});

const handleSubmit = (e) => {
  e.preventDefault();

  if (!booking.customer_name || !booking.customer_email || !booking.travel_date) {
    toast({ title: "Please fill all required fields (Name, Email, Travel Date)", variant: "destructive" });
    return;
  }
  setSubmitting(true);
bookingMutation.mutate({
...booking,
package_id: pkg.id,
package_title: pkg.title,
item_type: "package",
total_price: pkg.price * booking.number_of_travelers,
status: "pending",
});
};

if (loading) {
return (
<div className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
</div>
);
}

if (!pkg) {
return (
<div className="pt-32 max-w-7xl mx-auto px-4 text-center py-20">
<p className="text-slate-500 mb-4">Package not found.</p>
<Link to="/packages" className="text-primary font-semibold">← Back to packages</Link>
</div>
);
}

const discount = pkg.original_price && pkg.original_price > pkg.price
? Math.round(((pkg.original_price - pkg.price) / pkg.original_price) * 100)
: 0;

return (
  <div className="pt-24 sm:pt-32 bg-white dark:bg-[#0a0a0c] min-h-screen">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Link to="/packages" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6">
<ArrowLeft size={16} /> Back to packages
</Link>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
{/* Gallery */}
<div className="rounded-3xl overflow-hidden shadow-float mb-4 h-80 sm:h-[420px]">
<Image src={gallery[activeImage]} alt={pkg.title} fittingType="fill" className="w-full h-full" />
</div>
{gallery.length > 1 && (
<div className="flex gap-3 overflow-x-auto pb-2">
{gallery.map((img, i) => (
<button
key={i}
onClick={() => setActiveImage(i)}
className={`w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 transition-all ${
activeImage === i ? "border-primary" : "border-transparent opacity-70"
}`}
>
<Image src={img} alt="" fittingType="fill" className="w-full h-full" />
</button>
))}
</div>
)}

<div className="mt-8">
<div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
<MapPin size={16} className="text-primary" />
{pkg.destination} · {pkg.country}
</div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">{pkg.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-slate-800 dark:text-white">{pkg.rating || 4.5}</span>
                  <span className="text-sm text-slate-400">({reviews.length || pkg.reviews_count || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                  <Clock size={16} className="text-primary" />
                  {pkg.duration_days} Days · {pkg.duration_days - 1} Nights
                </div>
                {pkg.category && (
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{pkg.category}</span>
                )}
              </div>

              {/* Description — render HTML properly */}
              <div
                className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8 prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base"
                dangerouslySetInnerHTML={{ __html: pkg.description || pkg.short_description || "" }}
              />

              {/* Itinerary */}
              {pkg.itinerary?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5">Itinerary</h2>
                  <div className="space-y-4">
                    {pkg.itinerary.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                            {item.day || i + 1}
                          </div>
                          {i < pkg.itinerary.length - 1 && <div className="w-0.5 flex-1 bg-border dark:bg-slate-700 mt-2" />}
                        </div>
                        <div className="pb-6">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pkg.inclusions?.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-950/30 rounded-2xl p-5 border border-green-100 dark:border-green-900/50">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Check size={18} className="text-green-600" /> What's Included</h3>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <Check size={16} className="text-green-600 mt-0.5 shrink-0" /> {inc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {pkg.exclusions?.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950/30 rounded-2xl p-5 border border-red-100 dark:border-red-900/50">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><X size={18} className="text-red-500" /> Not Included</h3>
                    <ul className="space-y-2">
                      {pkg.exclusions.map((exc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <X size={16} className="text-red-500 mt-0.5 shrink-0" /> {exc}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

{/* Reviews Section */}
{reviews.length > 0 && (
<div className="mt-12 pt-8 border-t border-border">
<h2 className="text-2xl font-bold text-deep-space mb-6">Verified Client Reviews</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
{reviews.map(rev => (
<div key={rev.id} className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-border">
  <div className="flex items-center justify-between mb-4">
    <div className="font-semibold text-deep-space dark:text-white">{rev.customer_name || 'Traveler'}</div>
    <div className="flex text-amber-500">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < rev.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"} />
      ))}
    </div>
  </div>
  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic">"{rev.text}"</p>
</div>
))}
</div>
</div>
)}
</div>
</div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float-lg p-6">
                <div className="flex items-end justify-between mb-1">
                  <div>
                    {pkg.original_price && pkg.original_price > pkg.price && (
                      <span className="text-sm text-slate-400 line-through">৳{pkg.original_price.toLocaleString()}</span>
                    )}
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">৳{pkg.price.toLocaleString()}</div>
                  </div>
                  {discount > 0 && (
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full">{discount}% OFF</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-6">per person · all inclusive</p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">Book this package</h3>
                  
                  <Input icon={<User size={16} />} placeholder="Full name *" value={booking.customer_name} onChange={(v) => setBooking({ ...booking, customer_name: v })} />
                  <Input icon={<Mail size={16} />} type="email" placeholder="Email *" value={booking.customer_email} onChange={(v) => setBooking({ ...booking, customer_email: v })} />
                  <Input icon={<Phone size={16} />} placeholder="Phone" value={booking.customer_phone} onChange={(v) => setBooking({ ...booking, customer_phone: v })} />
                  
                  <Input icon={<Calendar size={16} />} type="date" value={booking.travel_date} onChange={(v) => setBooking({ ...booking, travel_date: v })} />
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      value={booking.number_of_travelers}
                      onChange={(e) => setBooking({ ...booking, number_of_travelers: parseInt(e.target.value) || 1 })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      placeholder="Travellers"
                    />
                  </div>
                  <textarea
                    value={booking.message}
                    onChange={(e) => setBooking({ ...booking, message: e.target.value })}
                    placeholder="Special requests (optional)"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                  />
                  {booking.number_of_travelers > 0 && (
                    <div className="flex items-center justify-between text-sm py-2 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500">Total price</span>
                      <span className="font-bold text-slate-900 dark:text-white text-lg">৳{(pkg.price * booking.number_of_travelers).toLocaleString()}</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Request Booking"}
                  </button>
                </form>

<div className="mt-5 pt-5 border-t border-border space-y-2">
<div className="flex items-center gap-2 text-xs text-slate-500">
<ShieldCheck size={14} className="text-green-600" /> No hidden fees — transparent pricing
</div>
<div className="flex items-center gap-2 text-xs text-slate-500">
<ShieldCheck size={14} className="text-green-600" /> Free cancellation up to 7 days before
</div>
</div>
</div>
</div>
</div>
</div>
</div>
{flying && <PlaneFlyOverlay onDone={() => { setFlying(false); setShowThankYou(true); }} />}

<ThankYouModal 
  open={showThankYou} 
  onOpenChange={setShowThankYou} 
  title="Thank You!" 
  message="Your booking request has been successfully submitted." 
  subMessage="Our team will contact you shortly to confirm the details." 
/>
</div>
);
}

function Input({ icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm placeholder:text-slate-400"
      />
    </div>
  );
}
