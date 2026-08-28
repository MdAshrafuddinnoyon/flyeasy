import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, Hotel, Tag, CalendarCheck, PlaneTakeoff,
  LogOut, Menu, X, ExternalLink, FileText, Megaphone, Users, CreditCard,
  Quote, Star, UserCheck, ShieldCheck, HelpCircle, Mail, Plane, Image,
  Settings, Globe, ChevronDown, ChevronRight, Heart, MessageCircle
} from "lucide-react";
import Logo from "@/components/Logo";
import DeveloperCredit from "@/components/DeveloperCredit";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { SiteContent } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { slug: "", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ]
  },
  {
    label: "Content",
    items: [
      { slug: "packages", label: "Packages", icon: Package },
      { slug: "flights", label: "Flights", icon: PlaneTakeoff },
      { slug: "hotels", label: "Hotels", icon: Hotel },
      { slug: "promotions", label: "Promotions", icon: Tag },
      { slug: "airlines", label: "Airlines", icon: Plane },
      { slug: "partners", label: "Partners", icon: Globe },
      { slug: "pages", label: "Custom Pages", icon: FileText },
    ]
  },
  {
    label: "Community",
    items: [
      { slug: "testimonials", label: "Testimonials", icon: Quote },
      { slug: "reviews", label: "Package Reviews", icon: Star },
      { slug: "messages", label: "Contact Messages", icon: MessageCircle },
      { slug: "team", label: "Team Members", icon: UserCheck },
      { slug: "certs", label: "Certifications", icon: ShieldCheck },
      { slug: "faqs", label: "FAQs", icon: HelpCircle },
    ]
  },
  {
    label: "Commerce",
    items: [
      { slug: "bookings", label: "Bookings", icon: CalendarCheck },
      { slug: "leads", label: "Customer Favorites", icon: Heart },
      { slug: "payment-methods", label: "Payment Methods", icon: CreditCard },
    ]
  },
  {
    label: "Marketing",
    items: [
      { slug: "announcements", label: "Announcements", icon: Megaphone },
      { slug: "newsletter", label: "Newsletter", icon: Mail },
      { slug: "email-templates", label: "Email Templates", icon: Mail },
    ]
  },
  {
    label: "System",
    items: [
      { slug: "users", label: "User Management", icon: Users },
      { slug: "media", label: "Media Library", icon: Image },
      { slug: "content", label: "Site Content & Settings", icon: Settings },
    ]
  },
];

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [adminSlug, setAdminSlug] = useState("admin");
  const [collapsedGroups, setCollapsedGroups] = useState({});

  useEffect(() => {
    SiteContent.get().then(data => {
      if (data?.admin_url_slug) setAdminSlug(data.admin_url_slug);
    }).catch(() => {});
  }, []);

  // Close sidebar on navigation
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const basePath = `/${adminSlug}`;

  const getLinkPath = (slug) => slug === "" ? basePath : `${basePath}/${slug}`;

  const isActive = (item) => {
    const path = getLinkPath(item.slug);
    return item.exact || item.slug === ""
      ? location.pathname === path
      : location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const toggleGroup = (label) => {
    setCollapsedGroups(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-white/10 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Logo variant="dark" className="h-8" />
          <ThemeToggle className="text-slate-400 hover:text-white transition-colors" />
        </div>
        <button className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setOpen(false)}>
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1 no-scrollbar">
        {NAV_GROUPS.map((group) => {
          const isCollapsed = collapsedGroups[group.label];
          return (
            <div key={group.label} className="mb-1">
              {group.label !== "Main" && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <span>{group.label}</span>
                  {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
              {!isCollapsed && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(item);
                    return (
                      <Link
                        key={item.slug}
                        to={getLinkPath(item.slug)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                          active
                            ? "bg-white text-deep-space shadow-lg font-semibold"
                            : "text-slate-400 hover:bg-white/8 hover:text-white"
                        )}
                      >
                        <item.icon size={17} className={active ? "text-primary" : ""} />
                        <span className="truncate">{item.label}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 dark:border-slate-800 space-y-1 shrink-0">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-white/8 hover:text-white transition-all">
          <ExternalLink size={17} /> View Website
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <LogOut size={17} /> Logout
        </button>
      </div>
      <div className="px-4 pb-4 border-t border-white/10 dark:border-slate-800">
        <DeveloperCredit variant="dark" />
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-background flex text-deep-space dark:text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 bg-deep-space dark:bg-slate-950 text-slate-300 flex-col h-screen sticky top-0 border-r border-transparent dark:border-slate-800 shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-deep-space dark:bg-slate-950 text-slate-300 flex flex-col h-full">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-deep-space dark:bg-slate-950 text-white px-4 py-3 flex items-center justify-between border-b border-white/10 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Logo variant="dark" className="h-7" />
          <ThemeToggle className="p-2 rounded-lg hover:bg-white/10 transition-colors text-slate-300" />
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden pb-28 lg:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
