import React, { useState } from "react";
import { Compass, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

export default function GuidePanel({ user }) {
  const { toast } = useToast();
  const [guide, setGuide] = useState({ destination: "", travel_date: "", number_of_travelers: 1, customer_name: user?.full_name || "", customer_phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleGuide = async (e) => {
    e.preventDefault();
    if (!guide.destination || !guide.customer_name) {
      toast({ title: "Please fill destination and your name", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await Entities.bookings.create({
        package_title: guide.destination,
        item_type: "Guide",
        customer_name: guide.customer_name,
        customer_email: user?.email || "",
        customer_phone: guide.customer_phone,
        travel_date: guide.travel_date,
        number_of_travelers: Number(guide.number_of_travelers),
        message: guide.message,
        status: "pending",
        total_price: 0,
      });
      toast({ title: "Guide request submitted! We'll match you with a local guide." });
      setGuide({ destination: "", travel_date: "", number_of_travelers: 1, customer_name: user?.full_name || "", customer_phone: "", message: "" });
    } catch (err) {
      toast({ title: "Something went wrong.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space flex items-center gap-2"><Compass size={22} className="text-primary" /> Request a Local Guide</h1>
        <p className="text-slate-500 mt-1 text-sm">Connect with a verified local guide for your destination.</p>
      </div>
      <div className="bg-white rounded-3xl shadow-float p-4 sm:p-6">
        <form onSubmit={handleGuide} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={inputCls} placeholder="Destination *" value={guide.destination} onChange={(e) => setGuide({ ...guide, destination: e.target.value })} />
          <input className={inputCls} placeholder="Your name *" value={guide.customer_name} onChange={(e) => setGuide({ ...guide, customer_name: e.target.value })} />
          <input className={inputCls} type="date" value={guide.travel_date} onChange={(e) => setGuide({ ...guide, travel_date: e.target.value })} />
          <input className={inputCls} type="number" min="1" value={guide.number_of_travelers} onChange={(e) => setGuide({ ...guide, number_of_travelers: e.target.value })} />
          <input className={inputCls} placeholder="Phone" value={guide.customer_phone} onChange={(e) => setGuide({ ...guide, customer_phone: e.target.value })} />
          <textarea className={`${inputCls} sm:col-span-2`} rows={3} placeholder="What kind of guide/tour do you need?" value={guide.message} onChange={(e) => setGuide({ ...guide, message: e.target.value })} />
          <button type="submit" disabled={submitting} className="sm:col-span-2 bg-primary text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : "Request Guide"}
          </button>
        </form>
      </div>
    </div>
  );
}


