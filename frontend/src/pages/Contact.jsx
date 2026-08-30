import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ThankYouModal from "@/components/ThankYouModal";
import { useSiteContent } from "@/context/SiteContext";
import { SiteContent, api } from "@/lib/api";

export default function Contact() {
  const { toast } = useToast();
  const { siteData } = useSiteContent();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [content, setContent] = useState({});

  useEffect(() => {
    SiteContent.get().then(data => { if (data) setContent(data); }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const toEmail = content.contact_email || "info@flyeasytourism.com";
      const res = await api.post("/email/send", {
        to: toEmail,
        subject: form.subject || `New Contact from ${form.name}`,
        name: form.name,
        email: form.email,
        text: `Name: ${form.name}\nEmail: ${form.email}\nMessage:\n${form.message}`
      });
      if (res.data.success) {
        setForm({ name: "", email: "", subject: "", message: "" });
        setShowThankYou(true);
      } else {
        toast({ title: "Failed to send message", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error sending message", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const phone = content.contact_phone || "01819-024927";
  const whatsapp = content.contact_whatsapp || "8801819024927";
  const email = content.contact_email || "info@flyeasytourism.com";
  const address = content.contact_address || "Abed Khan Building, 61 Pathantuli Road, Agrabad, Chattogram";
  const hours = content.contact_hours || "Saturday - Thursday: 9:00 AM - 8:00 PM\nFriday: Closed";
  const mapUrl = content.contact_map_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14738.47398745847!2d91.80588!3d22.3245!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd8a63254d7f3%3A0x4e73cb77819c5052!2sAgrabad%2C%20Chattogram!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd";

  return (
    <div className="bg-white dark:bg-[#0a0a0c] min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-slate-900">
        <img src={siteData?.contact_hero_url || "/images/hero_contact.jpg"} alt="Contact Us" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3">
            <MessageCircle size={16} /> Contact Us
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Get in touch</h1>
          <p className="text-white/70 max-w-xl mx-auto">Questions, custom trips or partnership inquiries — we're here to help.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-16 relative z-20">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: MapPin, title: "Visit Us", value: address, href: null, color: "bg-primary/10 text-primary" },
            { icon: Phone, title: "Call Us", value: phone, href: `tel:${phone.replace(/[^0-9+]/g, '')}`, color: "bg-sky-500/10 text-sky-500" },
            { icon: MessageCircle, title: "WhatsApp", value: `+${whatsapp.replace(/[^0-9]/g, '')}`, href: `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`, color: "bg-green-500/10 text-green-500" },
            { icon: Mail, title: "Email Us", value: email, href: `mailto:${email}`, color: "bg-amber-500/10 text-amber-500" },
          ].map((c, i) => (
            <a
              key={i}
              href={c.href || undefined}
              target={c.href && !c.href.startsWith("tel") && !c.href.startsWith("mailto") ? "_blank" : undefined}
              rel="noreferrer"
              className="bg-card dark:bg-slate-900 rounded-2xl shadow-float p-5 flex items-start gap-4 hover:shadow-float-lg transition-shadow border border-slate-100 dark:border-slate-800"
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${c.color}`}>
                <c.icon size={20} />
              </div>
              <div>
                <div className="font-semibold text-deep-space dark:text-white text-sm">{c.title}</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm mt-0.5 break-words">{c.value}</div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Form & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float border border-slate-100 dark:border-slate-800 p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-deep-space dark:text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5">Your Name</label>
                  <input 
                    required 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5">Subject</label>
                <input 
                  type="text" 
                  value={form.subject}
                  onChange={(e) => setForm({...form, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5">Message</label>
                <textarea 
                  required 
                  rows={4} 
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-primary text-white font-bold px-6 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? "Sending..." : <><Send size={18} /> Send Message</>}
              </button>
            </form>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-deep-space dark:text-white mb-6">Our Office</h2>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="text-slate-600 dark:text-slate-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-deep-space dark:text-white text-lg">Main Headquarters</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-wrap">{address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center shrink-0">
                  <Clock className="text-slate-600 dark:text-slate-400 w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-deep-space dark:text-white text-lg">Operating Hours</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-1 whitespace-pre-wrap">{hours}</p>
                </div>
              </div>
            </div>
            
            <div className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-float h-[300px] bg-slate-200 dark:bg-slate-900 relative">
              <iframe 
                src={mapUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      <ThankYouModal 
        open={showThankYou} 
        onOpenChange={setShowThankYou} 
        title="Thank You!" 
        message="Your message has been successfully sent." 
        subMessage="We will get back to you as soon as possible." 
      />
    </div>
  );
}
