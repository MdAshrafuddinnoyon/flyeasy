import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Clock4, Headset, Sparkles, Plane, Map, Hotel, ArrowRight, ChevronDown } from "lucide-react";
import { PlaneTakeoff, Users, Globe, Target, MapPin, Award } from "lucide-react";
import { Entities, SiteContent } from "@/lib/api";
import { useSiteContent } from "@/context/SiteContext";

import LogoTicker from "@/components/LogoTicker";

export default function About() {
  const { siteData } = useSiteContent();
  const [team, setTeam] = React.useState([]);
  const [certs, setCerts] = React.useState([]);
  const [faqs, setFaqs] = React.useState([]);
  const [openFaq, setOpenFaq] = React.useState(null);
  const [siteContent, setSiteContent] = React.useState({});
  const [airlines, setAirlines] = React.useState([]);
  const [partners, setPartners] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      try {
        const [teamData, certsData, faqsData, contentData, airlinesData, partnersData] = await Promise.all([
          Entities.team.list(),
          Entities.certifications.list(),
          Entities.faqs.list(),
          SiteContent.get(),
          Entities.airlines.list(),
          Entities.partners.list()
        ]);
        setTeam(teamData.filter(t => t.active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
        setCerts(certsData.filter(c => c.active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
        setFaqs(faqsData.filter(f => f.active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
        setAirlines(airlinesData.filter(a => a.active));
        setPartners(partnersData.filter(p => p.active));
        if (contentData) setSiteContent(contentData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const originalCerts = certs.filter(c => c.type === 'certification' || c.type === 'award');
  const partnerLogos = certs.filter(c => c.type === 'partner');

  return (
<div className="bg-white dark:bg-[#0a0a0c] min-h-screen">
{/* Hero Section */}
<div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900">
  <img src={siteData?.about_hero_url || "/images/hero_packages.jpg"} alt="About Us" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
  <div className="absolute inset-0 bg-slate-900/60 pointer-events-none" />
  <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
    <div className="inline-flex items-center gap-2 text-accent text-sm font-semibold mb-3">
      <Sparkles size={16} /> About FlyEasy
    </div>
    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{siteContent.hero_headline || "Effortless travel, elevated"}</h1>
    <p className="text-white/70 text-lg max-w-2xl mx-auto">
      {siteContent.about_mission || "Based in Chattogram, FlyEasy Tourism is on a mission to make travel across Bangladesh — and beyond — effortless, transparent and memorable. From Cox's Bazar to the Maldives, we handle flights, hotels and curated holiday packages under one roof."}
    </p>
  </div>
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-20">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
<div>
<h2 className="text-3xl font-bold text-deep-space mb-4">The Transparent Navigator</h2>
<p className="text-slate-600 leading-relaxed mb-4">
FlyEasy was built to reject the cluttered "bargain bin" look of traditional travel sites. We treat the viewport as an infinite horizon, where every interaction feels as light as air.
</p>
<p className="text-slate-600 leading-relaxed mb-4">
From the moment you search to the moment you arrive, we obsess over clarity, speed and transparency. No hidden fees. No surprises. Just the journey.
</p>
<Link to="/packages" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all mt-2">
Explore our packages <ArrowRight size={18} />
</Link>
</div>
    {siteContent.about_show_stats !== false && (
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: Plane, label: "Flights", value: "500+", desc: "Routes" },
          { icon: Hotel, label: "Hotels", value: "1,200+", desc: "Properties" },
          { icon: Map, label: "Packages", value: "80+", desc: "Curated" },
          { icon: Headset, label: "Support", value: "24/7", desc: "Always on" },
        ].map((s, i) => (
          <div key={i} className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-float p-6 text-center transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-300 pointer-events-none" />
            <div className="w-12 h-12 rounded-2xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mx-auto mb-3 transition-colors duration-300">
              <s.icon size={22} className="text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-3xl font-bold text-deep-space dark:text-white mb-1">{s.value}</div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{s.desc}</div>
          </div>
        ))}
      </div>
    )}
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{[
{ icon: ShieldCheck, title: "Transparent Pricing", desc: "What you see is what you pay. No hidden fees, ever." },
{ icon: Clock4, title: "Speed of Intent", desc: "From search to booking in seconds, not minutes." },
{ icon: Headset, title: "Human Support", desc: "Real travel experts, available around the clock." },
].map((v, i) => (
        <div key={i} className="group relative bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-3xl p-8 hover:shadow-float-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
          <div className="relative w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
            <v.icon size={26} className="text-primary group-hover:text-white transition-colors duration-300" />
          </div>
          <h3 className="font-bold text-deep-space dark:text-white text-xl mb-3">{v.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{v.desc}</p>
        </div>
))}
</div>
</div>

{/* Team Section */}
{siteContent.about_show_team !== false && team.length > 0 && (
<div className="bg-slate-50 dark:bg-slate-900/50 py-16 sm:py-24 border-t border-slate-100 dark:border-slate-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">Meet the Team</h2>
      <p className="text-slate-600 dark:text-slate-400">The passionate experts behind your next effortless journey.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {team.map((member) => (
        <div key={member.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-float hover:shadow-float-lg transition-all duration-300 text-center border border-slate-100 dark:border-slate-800">
          <div className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800">
            {member.image_url ? (
              <img src={member.image_url} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-deep-space dark:text-white mb-1">{member.name}</h3>
            <p className="text-primary font-medium text-sm mb-3">{member.role}</p>
            {member.bio && <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-3">{member.bio}</p>}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
)}

{/* Original Certificates Section */}
{siteContent.about_show_certs !== false && originalCerts.length > 0 && (
<div className="bg-white dark:bg-[#0a0a0c] py-16 sm:py-24 border-t border-slate-100 dark:border-slate-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center max-w-2xl mx-auto mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">Original Certificates & Awards</h2>
      <p className="text-slate-600 dark:text-slate-400">Our official licenses, accreditations, and industry recognitions.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
      {originalCerts.map((cert) => (
        <div key={cert.id} className="group bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-float-lg transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
          <div className="p-4 bg-white dark:bg-slate-800 flex-1 flex items-center justify-center">
            {cert.image_url ? (
              <img src={cert.image_url} alt={cert.name} className="max-h-[350px] w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="h-64 w-full flex items-center justify-center text-slate-300">No Image</div>
            )}
          </div>
          <div className="p-5 text-center border-t border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-deep-space dark:text-white">{cert.name}</h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
)}

{/* FAQs Section */}
{siteContent.about_show_faqs !== false && faqs.length > 0 && (
<div className="bg-white dark:bg-[#0a0a0c] py-16 sm:py-24">
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-deep-space dark:text-white mb-4">Frequently Asked Questions</h2>
    </div>
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div key={faq.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 transition-all">
          <button 
            className="w-full text-left px-6 py-5 flex items-center justify-between font-bold text-deep-space dark:text-white focus:outline-none"
            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
          >
            {faq.question}
            <ChevronDown className={`shrink-0 transition-transform ${openFaq === faq.id ? "rotate-180 text-primary" : "text-slate-400"}`} size={20} />
          </button>
          <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === faq.id ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
)}
{/* Top Airlines Slider */}
{siteContent.about_show_airlines !== false && airlines.length > 0 && (
  <div className="border-t border-slate-100 dark:border-white/10 mt-12">
    <LogoTicker title="SEARCH TOP AIRLINES" items={airlines} />
  </div>
)}

{/* Partners Slider */}
{siteContent.about_show_partners !== false && partners.length > 0 && (
  <LogoTicker title="OUR PARTNERS" items={partners} />
)}

</div>
);
}
