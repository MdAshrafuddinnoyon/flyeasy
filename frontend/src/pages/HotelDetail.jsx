import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Check, ArrowLeft, Calendar, Users, Phone, Mail, User, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ThankYouModal from "@/components/ThankYouModal";
import { useQuery, useMutation } from '@tanstack/react-query';
import { Entities } from '@/lib/api';
import { Image } from "@/components/ui/image";
import { useToast } from "@/components/ui/use-toast";
import PlaneFlyOverlay from "@/components/PlaneFlyOverlay";
import { useAuth } from "@/context/AuthContext";

export default function HotelDetail() {
const { id } = useParams();
const { toast } = useToast();
const navigate = useNavigate();
const { user, setShowAuthModal } = useAuth();

const { data: hotel, isLoading: loading } = useQuery({
  queryKey: ['hotel', id],
  queryFn: () => Entities.hotels.get(id),
});

const [booking, setBooking] = useState({ customer_name: user?.name || "", customer_email: user?.email || "", customer_phone: user?.phone || "", travel_date: "", number_of_travelers: 1, message: "" });

React.useEffect(() => {
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

const bookingMutation = useMutation({
  mutationFn: (newBooking) => Entities.bookings.create(newBooking),
  onSuccess: () => {
    setFlying(true);
    toast({ title: "Booking request submitted! We'll contact you shortly." });
    setBooking({ customer_name: "", customer_email: "", customer_phone: "", travel_date: "", number_of_travelers: 1, message: "" });
  },
  onError: () => {
    toast({ title: "Something went wrong.", variant: "destructive" });
  },
  onSettled: () => setSubmitting(false)
});

const handleSubmit = (e) => {
e.preventDefault();

if (!booking.customer_name || !booking.customer_email || !booking.customer_phone) {
toast({ title: "Please fill all required fields", variant: "destructive" });
return;
}
setSubmitting(true);
bookingMutation.mutate({
...booking,
package_id: hotel.id,
package_title: hotel.name,
item_type: "hotel",
total_price: hotel.price_per_night * booking.number_of_travelers,
status: "pending",
});
};

if (loading) return <div className="pt-32 max-w-7xl mx-auto px-4"><div className="h-96 bg-slate-200 rounded-3xl animate-pulse" /></div>;
if (!hotel)
return (
<div className="pt-32 max-w-7xl mx-auto px-4 text-center py-20">
<p className="text-slate-500 mb-4">Hotel not found.</p>
<Link to="/hotels" className="text-primary font-semibold">← Back to hotels</Link>
</div>
);

const gallery = hotel.gallery?.length ? hotel.gallery : [hotel.image_url].filter(Boolean);

return (
<div className="pt-24">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<Link to="/hotels" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-primary mb-6">
<ArrowLeft size={16} /> Back to hotels
</Link>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
<div className="lg:col-span-2">
<div className="rounded-3xl overflow-hidden shadow-float mb-6 h-80 sm:h-[440px]">
<Image src={hotel.image_url} alt={hotel.name} fittingType="fill" className="w-full h-full" />
</div>

<div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
<MapPin size={16} className="text-primary" />
{hotel.location} · {hotel.city}
</div>
<h1 className="text-3xl sm:text-4xl font-bold text-deep-space mb-3">{hotel.name}</h1>
<div className="flex flex-wrap items-center gap-4 mb-6">
<div className="flex items-center gap-1">
{[...Array(5)].map((_, i) => (
<Star key={i} size={16} className={i < (hotel.star_rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
))}
</div>
<div className="flex items-center gap-1">
<Star size={16} className="fill-amber-400 text-amber-400" />
<span className="font-semibold text-deep-space">{hotel.rating}</span>
<span className="text-sm text-slate-400">({hotel.reviews_count} reviews)</span>
</div>
</div>

<p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-line">{hotel.description}</p>

{hotel.amenities?.length > 0 && (
<div>
<h3 className="font-bold text-deep-space mb-4 text-xl">Amenities</h3>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
{hotel.amenities.map((a, i) => (
<div key={i} className="flex items-center gap-2 text-sm text-slate-600">
<Check size={16} className="text-green-600" /> {a}
</div>
))}
</div>
</div>
)}
</div>

<div className="lg:col-span-1">
<div className="sticky top-24">
<div className="bg-card rounded-3xl shadow-float-lg p-6">
<div className="text-3xl font-bold text-deep-space mb-1">৳{hotel.price_per_night.toLocaleString()}</div>
<p className="text-xs text-slate-500 mb-6">per night</p>
<form onSubmit={handleSubmit} className="space-y-3">
<h3 className="font-bold text-deep-space">Book this hotel</h3>
    <Input icon={<User size={16} />} placeholder="Full name *" value={booking.customer_name} onChange={(v) => setBooking({ ...booking, customer_name: v })} />
    <Input icon={<Mail size={16} />} type="email" placeholder="Email *" value={booking.customer_email} onChange={(v) => setBooking({ ...booking, customer_email: v })} />
    <Input icon={<Phone size={16} />} placeholder="Phone *" value={booking.customer_phone} onChange={(v) => setBooking({ ...booking, customer_phone: v })} />
<Input icon={<Calendar size={16} />} type="date" value={booking.travel_date} onChange={(v) => setBooking({ ...booking, travel_date: v })} />
<div className="relative">
<Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
<input type="number" min="1" value={booking.number_of_travelers} onChange={(e) => setBooking({ ...booking, number_of_travelers: parseInt(e.target.value) || 1 })} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Guests" />
</div>
<button type="submit" disabled={submitting} className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60">
{submitting ? "Submitting..." : "Request Booking"}
</button>
</form>
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
<input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm" />
</div>
);
}
