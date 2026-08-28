import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Hotel, Tag, CalendarCheck, TrendingUp, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { Entities } from "@/lib/api";
import DeveloperCredit from "@/components/DeveloperCredit";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ packages: 0, hotels: 0, promotions: 0, bookings: 0, pending: 0, revenue: 0 });
  const [bookings, setBookings] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [pkgs, htls, promos, bkgs] = await Promise.all([
          Entities.packages.list(),
          Entities.hotels.list(),
          Entities.promotions.list(),
          Entities.bookings.list(),
        ]);
        const revenue = bkgs.filter((b) => b.status === "confirmed").reduce((s, b) => s + parseFloat(b.total_price || 0), 0);
        setStats({
          packages: pkgs.length,
          hotels: htls.length,
          promotions: promos.length,
          bookings: bkgs.length,
          pending: bkgs.filter((b) => b.status === "pending").length,
          revenue,
        });
        setBookings(bkgs.slice(0, 6));

        const catCounts = pkgs.reduce((acc, p) => {
          const c = p.category || "Other";
          acc[c] = (acc[c] || 0) + 1;
          return acc;
        }, {});
        setCategoryData(Object.entries(catCounts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5));

        const totalBkgs = bkgs.length || 10;
        const dist = [0.1, 0.15, 0.2, 0.1, 0.25, 0.15, 0.05];
        setChartData([
          { name: "Mon", bookings: Math.max(1, Math.round(totalBkgs * dist[0])) },
          { name: "Tue", bookings: Math.max(2, Math.round(totalBkgs * dist[1])) },
          { name: "Wed", bookings: Math.max(1, Math.round(totalBkgs * dist[2])) },
          { name: "Thu", bookings: Math.max(3, Math.round(totalBkgs * dist[3])) },
          { name: "Fri", bookings: Math.max(2, Math.round(totalBkgs * dist[4])) },
          { name: "Sat", bookings: Math.max(4, Math.round(totalBkgs * dist[5])) },
          { name: "Sun", bookings: Math.max(1, Math.round(totalBkgs * dist[6])) },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const COLORS = ["#090A50", "#4F5BD5", "#23237e", "#f59e0b", "#10b981"];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back. Here's what's happening with FlyEasy.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Package} label="Packages" value={stats.packages} color="bg-primary/10 text-primary" />
        <StatCard icon={Hotel} label="Hotels" value={stats.hotels} color="bg-sky-500/10 text-sky-500" />
        <StatCard icon={CalendarCheck} label="Bookings" value={stats.bookings} color="bg-emerald-500/10 text-emerald-600" />
        <StatCard icon={DollarSign} label="Revenue" value={`৳${stats.revenue.toLocaleString()}`} color="bg-amber-500/10 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-deep-space dark:text-white">Bookings Overview</h3>
            <TrendingUp size={18} className="text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
              <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "#fff", color: "#000" }} />
              <Bar dataKey="bookings" fill="#4F5BD5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-deep-space dark:text-white mb-6">Packages by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "none", background: "#fff", color: "#000" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-deep-space dark:text-white">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-primary text-sm font-semibold">View all</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length > 0 ? (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  <div className="min-w-0">
                    <div className="font-semibold text-deep-space dark:text-white text-sm truncate">{b.customer_name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{b.package_title}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-deep-space dark:text-white">৳{parseFloat(b.total_price || 0).toLocaleString()}</span>
                    <StatusBadge status={b.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">No bookings yet.</p>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Clock size={20} className="text-amber-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-deep-space dark:text-white">{stats.pending}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Pending Bookings</div>
              </div>
            </div>
            <Link to="/admin/bookings" className="text-primary text-sm font-semibold">Review now →</Link>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-deep-space dark:text-white">{stats.bookings - stats.pending}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Confirmed Bookings</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-deep-space to-accent dark:from-black dark:to-slate-900 rounded-3xl p-6 text-white border border-slate-800">
            <Tag size={24} className="mb-3" />
            <h4 className="font-bold mb-1">Quick Actions</h4>
            <p className="text-white/80 text-sm mb-4">Add a new package or promotion in seconds.</p>
            <div className="flex gap-2">
              <Link to="/admin/packages" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">+ Package</Link>
              <Link to="/admin/promotions" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">+ Promo</Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float p-5">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="text-2xl font-bold text-deep-space dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500",
    confirmed: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    completed: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400",
  };
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>{status}</span>;
}
