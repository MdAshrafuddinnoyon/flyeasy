import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import Logo from '@/components/Logo';
import { useSiteContent } from '@/context/SiteContext';

export default function Footer() {
  const { siteData } = useSiteContent();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-space text-white/80 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Logo variant="white" className="h-10 mb-4" />
          <p className="text-sm text-white/60">
            {siteData?.footer_about || "Your trusted travel partner for flights, hotels, and holiday packages across Bangladesh and beyond."}
          </p>
          <div className="flex items-center gap-3 mt-6">
            {siteData?.social_facebook && (
              <a href={siteData.social_facebook} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
            )}
            {siteData?.social_instagram && (
              <a href={siteData.social_instagram} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
            )}
            {siteData?.social_twitter && (
              <a href={siteData.social_twitter} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            )}
            {siteData?.social_youtube && (
              <a href={siteData.social_youtube} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Youtube size={18} />
              </a>
            )}
            {siteData?.social_linkedin && (
              <a href={siteData.social_linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors">
                <Linkedin size={18} />
              </a>
            )}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/flights" className="hover:text-white">Flights</Link></li>
            <li><Link to="/hotels" className="hover:text-white">Hotels</Link></li>
            <li><Link to="/packages" className="hover:text-white">Holiday Packages</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:text-white">Help Center</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-col sm:flex-row justify-between gap-4">
        <span>© {year} {siteData?.site_name || "FlyEasy"}. All rights reserved.</span>
        {siteData?.developer_name && (
          <span>
            Developed by{" "}
            <a href={siteData.developer_website || "#"} target="_blank" rel="noopener noreferrer" className="hover:text-white underline underline-offset-2">
              {siteData.developer_name}
            </a>
          </span>
        )}
      </div>
    </footer>
  );
}
