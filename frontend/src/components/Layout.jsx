import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import MobileBottomNav from "@/components/MobileBottomNav";

import CookieConsent from "@/components/CookieConsent";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="fixed top-0 w-full z-[100]">
        <AnnouncementBanner />
        <Navbar />
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppSupport />
      <MobileBottomNav />
      <CookieConsent />
    </div>
  );
}

