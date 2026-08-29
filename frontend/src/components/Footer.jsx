import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, MapPin, Mail, Phone, Plane, ShieldCheck, HeartHandshake, Headphones, Globe, ArrowRight } from "lucide-react";
import DeveloperCredit from "./DeveloperCredit";
import Logo from "@/components/Logo";
import { SiteContent } from "@/lib/api";

const COLUMNS = [
  {
    title: "SERVICES",
    links: [
      { label: "Flight Booking", to: "/flights" },
      { label: "Holiday Packages", to: "/packages" },
      { label: "International Trips", to: "/packages" },
      { label: "Visa Consultation", to: "/contact" },
    ],
  },
  {
    title: "DESTINATIONS",
    links: [
      { label: "India", to: "/packages" },
      { label: "Dubai", to: "/packages" },
      { label: "Bali", to: "/packages" },
      { label: "Europe", to: "/packages" },
      { label: "Maldives", to: "/packages" },
      { label: "Singapore", to: "/packages" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Our Services", to: "/about" },
      { label: "Testimonials", to: "/" },
      { label: "Contact Us", to: "/contact" },
      { label: "Careers", to: "/careers" },
    ],
  },
  {
    title: "SUPPORT",
    links: [
      { label: "FAQs", to: "/faq" },
      { label: "Cancellation Policy", to: "/cancellation" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Cookie Policy", to: "/cookies" },
      { label: "Customer Support", to: "/customer-support" },
    ],
  },
];

export default function Footer() {
  const [content, setContent] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const data = await SiteContent.get();
        if (data) setContent(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <footer className="relative bg-[#0a0a0c] text-slate-300 overflow-hidden pt-40 lg:pt-60 pb-8 min-h-[500px]">
      {/* Background Image & Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/footer_mountain_bg.jpg" 
          alt="Mountains" 
          className="w-full h-full object-cover object-top opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/80 to-[#0a0a0c] pointer-events-none" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none overflow-hidden mix-blend-overlay z-0">
        <span className="text-[12rem] sm:text-[18rem] lg:text-[24rem] font-black tracking-tighter whitespace-nowrap mt-40 text-white">FLYEASY</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
          
          {/* Logo & Intro */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-start text-left">
            <div className="mb-6">
              <Logo variant="dark" className="h-10" />
            </div>
            <p className="text-sm font-medium text-slate-400 max-w-xs mb-8">
              {content.footer_about || "Crafted for travelers who seek more than destinations."}
            </p>
            <div className="flex gap-4 mb-6">
              {content.social_facebook && (
                <a href={content.social_facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                  <Facebook size={14} />
                </a>
              )}
              {content.social_instagram && (
                <a href={content.social_instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                  <Instagram size={14} />
                </a>
              )}
              {content.social_twitter && (
                <a href={content.social_twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                  <Twitter size={14} />
                </a>
              )}
              {content.social_youtube && (
                <a href={content.social_youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                  <Youtube size={14} />
                </a>
              )}
              {content.social_linkedin && (
                <a href={content.social_linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/20 text-white flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-all">
                  <Linkedin size={14} />
                </a>
              )}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {(Array.isArray(content.footer_links) && content.footer_links.length > 0 && content.footer_links[0].title !== undefined ? content.footer_links : COLUMNS).map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-bold text-sm tracking-widest mb-6 flex items-center gap-2 uppercase">
                  {col.title} <span className="w-1 h-1 rounded-full bg-red-600" />
                </h4>
                <ul className="space-y-4 text-sm font-medium">
                  {col.links && col.links.map((l, idx) => (
                    <li key={idx}>
                      <Link to={l.url || l.to} className="text-slate-400 hover:text-white transition-colors">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-slate-500 font-medium">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-red-600" /> Global Presence
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-red-600" /> 100+ Destinations
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <Headphones size={14} className="text-red-600" /> 24/7 Support
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <p>© {new Date().getFullYear()} {content.site_name || "FlyEasy"}. All Rights Reserved.</p>
              <div className="hidden sm:flex text-red-600 border-b border-dotted border-red-600/50 pb-0.5 ml-2 w-16 items-center justify-end">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45 shrink-0"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.7l-1.2 3.6 7.4 3-2.6 2.6-4.6-1.1c-.5-.1-1 .2-1.3.6l-1 2.9 6.8 2 2 6.8 2.9-1c.4-.3.7-.8.6-1.3l-1.1-4.6 2.6-2.6 3 7.4 3.6-1.2c.5-.2.8-.6.7-1.1z"/></svg>
              </div>
            </div>
            <p className="text-white/20 hidden sm:block">|</p>
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
              <span className="text-slate-500 text-xs">Developed by</span>
              <a href="https://websearchbd.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-500 transition-colors font-semibold text-sm">
                Web Search BD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
