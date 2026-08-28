import React, { useState, useEffect } from "react";
import { Heart, Gift, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Entities } from "@/lib/api";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import PortalSidebar from "@/components/portal/PortalSidebar";
import PortalHeader from "@/components/portal/PortalHeader";
import OverviewPanel from "@/components/portal/OverviewPanel";
import BookingsPanel from "@/components/portal/BookingsPanel";
import PaymentsPanel from "@/components/portal/PaymentsPanel";
import ReviewsPanel from "@/components/portal/ReviewsPanel";
import GuidePanel from "@/components/portal/GuidePanel";
import FavoritesPanel from "@/components/portal/FavoritesPanel";
import RewardsPanel from "@/components/portal/RewardsPanel";
import SettingsPanel from "@/components/portal/SettingsPanel";
import ReviewModal from "@/components/portal/ReviewModal";
import WhatsAppSupport from "@/components/WhatsAppSupport";

export default function ClientDashboard() {
const { user, logout } = useAuth();
const [bookings, setBookings] = useState([]);
const [announcements, setAnnouncements] = useState([]);
const [paymentMethods, setPaymentMethods] = useState([]);
const [loading, setLoading] = useState(true);
const [active, setActive] = useState("overview");

useEffect(() => {
if (!user) return;
(async () => {
try {
const [bks, anns, pms] = await Promise.all([
Entities.bookings.list(),
Entities.announcements.list(),
Entities.paymentMethods.list(),
]);
// Filter bookings for current user (this should ideally be handled by the backend)
setBookings(bks.filter(b => b.customer_email === user.email));
setAnnouncements(anns.filter((a) => a.active));
setPaymentMethods(pms.filter((p) => p.active));
} catch (e) {
console.error(e);
} finally {
setLoading(false);
}
})();
}, [user]);

const today = new Date();
const upcoming = bookings.find((b) => b.travel_date && new Date(b.travel_date) >= today && b.status !== "cancelled");
const weatherCity = upcoming?.package_title || "Dhaka";

const handleLogout = () => {
  logout();
};

if (loading) {
return (
<div className="pt-32 max-w-7xl mx-auto px-4 py-20 text-center text-slate-500 dark:text-slate-400">
<Loader2 className="animate-spin inline mr-2" /> Loading your dashboard…
</div>
);
}

return (
<div className="pt-28 lg:pt-36 pb-16 bg-slate-50 dark:bg-background min-h-screen">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
<div className="flex flex-col lg:flex-row gap-6">
<PortalSidebar active={active} setActive={setActive} onLogout={handleLogout} />
<div className="flex-1 min-w-0">
<PortalHeader user={user} />
{active === "overview" && <OverviewPanel user={user} bookings={bookings} announcements={announcements} weatherCity={weatherCity} />}
{active === "bookings" && <BookingsPanel bookings={bookings} />}
{active === "payments" && <PaymentsPanel paymentMethods={paymentMethods} />}
{active === "reviews" && <ReviewsPanel user={user} bookings={bookings} />}
{active === "guide" && <GuidePanel user={user} />}
{active === "favorites" && <FavoritesPanel />}
{active === "rewards" && <RewardsPanel />}
{active === "settings" && <SettingsPanel />}
</div>
</div>
</div>
<ReviewModal />
</div>
);
}

function Placeholder({ icon: Icon, title, desc }) {
return (
<div className="space-y-6">
<div>
<h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2"><Icon size={22} className="text-primary" /> {title}</h1>
<p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{desc}</p>
</div>
<div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-10 text-center border border-slate-100 dark:border-slate-800">
<div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><Icon size={28} className="text-primary" /></div>
<p className="text-slate-500 dark:text-slate-400 text-sm">Coming soon. Stay tuned!</p>
</div>
</div>
);
}
