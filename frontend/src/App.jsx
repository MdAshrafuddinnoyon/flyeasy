import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import ScrollToTop from '@/components/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Home from '@/pages/Home';
import Flights from '@/pages/Flights';
import Hotels from '@/pages/Hotels';
import HotelDetail from '@/pages/HotelDetail';
import Packages from '@/pages/Packages';
import PackageDetail from '@/pages/PackageDetail';
import Promotions from '@/pages/Promotions';
import PromotionDetail from '@/pages/PromotionDetail';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import AdminLogin from '@/pages/AdminLogin';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import PageNotFound from '@/pages/PageNotFound';
import CustomPage from '@/pages/CustomPage';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import FAQ from '@/pages/FAQ';
import Cancellation from '@/pages/Cancellation';
import Careers from '@/pages/Careers';
import Testimonials from '@/pages/Testimonials';
import CustomerSupport from '@/pages/CustomerSupport';
import CookiePolicy from '@/pages/CookiePolicy';
import ThankYou from '@/pages/ThankYou';

import ClientDashboard from '@/pages/portal/ClientDashboard';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminPackages from '@/pages/admin/AdminPackages';
import AdminFlights from '@/pages/admin/AdminFlights';
import AdminHotels from '@/pages/admin/AdminHotels';
import AdminPromotions from '@/pages/admin/AdminPromotions';
import AdminTestimonials from '@/pages/admin/AdminTestimonials';
import AdminAirlines from '@/pages/admin/AdminAirlines';
import AdminBookings from '@/pages/admin/AdminBookings';
import AdminLeads from '@/pages/admin/AdminLeads';
import AdminReviews from '@/pages/admin/Reviews';
import AdminPayment from '@/pages/admin/AdminPayment';
import AdminContent from '@/pages/admin/AdminContent';
import AdminAnnouncements from '@/pages/admin/AdminAnnouncements';
import AdminMedia from '@/pages/admin/AdminMedia';
import AdminPages from '@/pages/admin/AdminPages';
import AdminTeam from '@/pages/admin/AdminTeam';
import AdminCerts from '@/pages/admin/AdminCerts';
import AdminPartners from '@/pages/admin/AdminPartners';
import AdminFaqs from '@/pages/admin/AdminFaqs';
import AdminNewsletter from '@/pages/admin/AdminNewsletter';
import AdminEmailTemplates from '@/pages/admin/AdminEmailTemplates';
import AdminMessages from '@/pages/admin/AdminMessages';

import { Toaster } from "@/components/ui/toaster";
import AuthModal from "@/components/AuthModal";
import { SiteContent } from "@/lib/api";
import { Loader2 } from "lucide-react";

function withAdminLayout(Page) {
  return (
    <ProtectedRoute adminOnly>
      <AdminLayout><Page /></AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  const [adminSlug, setAdminSlug] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });

    SiteContent.get().then((data) => {
      setAdminSlug(data.admin_url_slug || 'admin');
    }).catch(err => {
      console.error('Failed to load site content', err);
      setAdminSlug('admin'); // Fallback
    });
  }, []);

  if (!adminSlug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/packages/:id" element={<PackageDetail />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/promotions/:id" element={<PromotionDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/cancellation" element={<Cancellation />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/customer-support" element={<CustomerSupport />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/p/:slug" element={<CustomPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/portal" element={<ProtectedRoute clientOnly={true}><ClientDashboard /></ProtectedRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>

        <Route path={`/${adminSlug}`} element={withAdminLayout(AdminDashboard)} />
        <Route path={`/${adminSlug}/media`} element={withAdminLayout(AdminMedia)} />
        <Route path={`/${adminSlug}/packages`} element={withAdminLayout(AdminPackages)} />
        <Route path={`/${adminSlug}/flights`} element={withAdminLayout(AdminFlights)} />
        <Route path={`/${adminSlug}/hotels`} element={withAdminLayout(AdminHotels)} />
        <Route path={`/${adminSlug}/promotions`} element={withAdminLayout(AdminPromotions)} />
        <Route path={`/${adminSlug}/testimonials`} element={withAdminLayout(AdminTestimonials)} />
        <Route path={`/${adminSlug}/airlines`} element={withAdminLayout(AdminAirlines)} />
        <Route path={`/${adminSlug}/bookings`} element={withAdminLayout(AdminBookings)} />
        <Route path={`/${adminSlug}/leads`} element={withAdminLayout(AdminLeads)} />
        <Route path={`/${adminSlug}/reviews`} element={withAdminLayout(AdminReviews)} />
        <Route path={`/${adminSlug}/payment-methods`} element={withAdminLayout(AdminPayment)} />
        <Route path={`/${adminSlug}/content`} element={withAdminLayout(AdminContent)} />
        <Route path={`/${adminSlug}/pages`} element={withAdminLayout(AdminPages)} />
        <Route path={`/${adminSlug}/team`} element={withAdminLayout(AdminTeam)} />
        <Route path={`/${adminSlug}/certs`} element={withAdminLayout(AdminCerts)} />
        <Route path={`/${adminSlug}/partners`} element={withAdminLayout(AdminPartners)} />
        <Route path={`/${adminSlug}/faqs`} element={withAdminLayout(AdminFaqs)} />
        <Route path={`/${adminSlug}/newsletter`} element={withAdminLayout(AdminNewsletter)} />
        <Route path={`/${adminSlug}/email-templates`} element={withAdminLayout(AdminEmailTemplates)} />
        <Route path={`/${adminSlug}/announcements`} element={withAdminLayout(AdminAnnouncements)} />
        <Route path={`/${adminSlug}/users`} element={withAdminLayout(AdminUsers)} />
        <Route path={`/${adminSlug}/messages`} element={withAdminLayout(AdminMessages)} />
        {adminSlug !== 'admin' && <Route path="/admin" element={<Navigate to={`/${adminSlug}`} replace />} />}
      </Routes>
      <AuthModal />
      <Toaster />
    </>
  );
}
