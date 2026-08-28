import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Plane, Hotel, Map } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import Logo from '@/components/Logo';

const NAV_LINKS = [
  { label: 'Flights', to: '/flights', icon: Plane },
  { label: 'Hotels', to: '/hotels', icon: Hotel },
  { label: 'Packages', to: '/packages', icon: Map },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={cn('fixed top-0 inset-x-0 z-50 transition-all', scrolled ? 'bg-white shadow-float py-2' : 'bg-transparent py-4')}>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo variant={scrolled ? "auto" : "white"} className="h-8" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className="px-4 py-2 rounded-full text-sm font-medium hover:bg-black/5">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/portal')} className="text-sm font-medium px-4 py-2 rounded-full hover:bg-black/5">
              {user.role === 'admin' ? 'Admin' : 'My Portal'}
            </button>
          ) : (
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-full hover:bg-black/5">Login</Link>
          )}
          <button onClick={() => navigate('/packages')} className="text-sm font-semibold px-5 py-2.5 rounded-full bg-primary text-white hover:shadow-lg">
            Book Now
          </button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute top-0 right-0 h-full w-[80%] max-w-sm bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <Logo className="h-6" />
              <button onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
            </div>
            <nav className="flex-1 p-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="px-4 py-3 rounded-xl hover:bg-primary/10 flex items-center gap-3">
                  {link.icon && <link.icon size={18} className="text-primary" />}
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}
