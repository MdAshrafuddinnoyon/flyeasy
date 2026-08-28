import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, Plane, Hotel, Map, ChevronDown, User, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { SiteContent } from "@/lib/api";

const NAV_LINKS = [
  { label: "Flights", to: "/flights", icon: Plane },
  { label: "Hotels", to: "/hotels", icon: Hotel },
  { label: "Holiday Packages", to: "/packages", icon: Map },
  { label: "Promotions", to: "/promotions" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setShowAuthModal } = useAuth();
  const [headerLinks, setHeaderLinks] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const list = await SiteContent.get();
        if (list && list.header_links) {
          setHeaderLinks(list.header_links);
        }
      } catch(e) {}
    })();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isInnerHeroPage = ["/", "/packages", "/hotels", "/flights", "/promotions", "/about", "/contact"].includes(location.pathname);
  const isHome = location.pathname === "/";
  const isHeroPage = isInnerHeroPage || isHome;

  const handlePortalClick = () => {
    if (user) navigate("/portal");
    else setShowAuthModal(true);
  };

  return (
    <>
    <header
      className={cn(
        "relative w-full z-50 transition-all duration-500 glass dark:glass-dark shadow-float",
        scrolled ? "py-2" : "py-3"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center shrink-0">
          <Logo variant="auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          
          {headerLinks.map((link, idx) => {
            const active = location.pathname === link.url;
            return (
              <Link
                key={`dyn-${idx}`}
                to={link.url}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all",
                  active
                    ? "text-primary bg-primary/10"
                    : "text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle className="w-9 h-9 rounded-full flex items-center justify-center transition-all text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10" />
          <button
            onClick={handlePortalClick}
            className="text-sm font-medium px-4 py-2 rounded-full transition-all text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
          >
            {user ? "My Portal" : "Login"}
          </button>
          <button
            onClick={() => navigate("/packages")}
            className="text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 bg-primary text-white hover:shadow-lg hover:shadow-primary/30"
          >
            Book Now
          </button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg transition-colors text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
      </div>

      </header>

      {/* Mobile slide-in drawer */}
      <div className={cn("lg:hidden fixed inset-0 z-[100] transition-all", mobileOpen ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300", mobileOpen ? "opacity-100" : "opacity-0")} onClick={() => setMobileOpen(false)} />
        <aside className={cn("absolute top-0 right-0 h-[100dvh] w-[85%] max-w-sm bg-white dark:bg-[#0a0a0c] shadow-2xl flex flex-col transition-transform duration-300 rounded-l-3xl border-l border-border dark:border-slate-800", mobileOpen ? "translate-x-0" : "translate-x-full")}>
          <div className="flex items-center justify-between p-6 border-b border-border dark:border-slate-800 shrink-0">
            <Logo variant="auto" className="h-8" />
            <button onClick={() => setMobileOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-deep-space dark:text-white transition-colors" aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-2 no-scrollbar">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={cn("px-4 py-3.5 rounded-2xl text-deep-space dark:text-white font-semibold transition-all flex items-center gap-4", active ? "bg-primary/10 text-primary dark:text-accent" : "hover:bg-slate-50 dark:hover:bg-slate-800")}>
                  {link.icon && <link.icon size={20} className={active ? "text-primary dark:text-accent" : "text-slate-400"} />}
                  {link.label}
                </Link>
              );
            })}
            {headerLinks.map((link, idx) => {
              const active = location.pathname === link.url;
              return (
                <Link key={`dyn-m-${idx}`} to={link.url} onClick={() => setMobileOpen(false)} className={cn("px-4 py-3.5 rounded-2xl text-deep-space dark:text-white font-semibold transition-all flex items-center gap-4", active ? "bg-primary/10 text-primary dark:text-accent" : "hover:bg-slate-50 dark:hover:bg-slate-800")}>
                  {link.label}
                </Link>
              );
            })}
            
            <div className="my-4 border-t border-border dark:border-slate-800" />
            
            <button onClick={() => { setMobileOpen(false); handlePortalClick(); }} className="px-4 py-3.5 rounded-2xl text-deep-space dark:text-white font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-4 w-full text-left transition-all">
              <User size={20} className="text-slate-400" /> {user ? "My Portal" : "Login / Register"}
            </button>
          </nav>
          <div className="p-6 border-t border-border dark:border-slate-800 space-y-4 bg-slate-50 dark:bg-slate-900/50 shrink-0 pb-safe">
            <button onClick={() => { setMobileOpen(false); navigate("/packages"); }} className="w-full bg-primary text-white font-bold px-5 py-4 rounded-2xl shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all">
              Book Now
            </button>
            <ThemeToggle className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-deep-space dark:text-white text-sm font-semibold shadow-sm" />
          </div>
        </aside>
      </div>
    </>
  );
}

