import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, MessageSquare, Clock, Send, CheckCircle2 } from "lucide-react";
import { SiteContent, Entities } from "@/lib/api";

export default function CustomerSupport() {
  const [submitted, setSubmitted] = useState(false);
  const [content, setContent] = useState({});
  const [faqs, setFaqs] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await SiteContent.get();
        if (list) setContent(list);
        const faqsData = await Entities.faqs.list();
        setFaqs(faqsData.filter(f => f.active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0c] pt-32 sm:pt-40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Quick Contact Cards */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-float border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Phone className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-deep-space dark:text-white mb-2">Call Us</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">We are available 24/7 for urgent inquiries.</p>
            <a href={`tel:${content.contact_phone?.replace(/[^0-9+]/g, '') || "+8809600000000"}`} className="text-primary font-bold text-lg hover:underline">{content.contact_phone || "+880 9600 000 000"}</a>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-float border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
              <MessageSquare className="text-accent w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-deep-space dark:text-white mb-2">WhatsApp</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Chat with our agents for quick support.</p>
            <a href={`https://wa.me/${content.contact_whatsapp?.replace(/[^0-9]/g, '') || "8801700000000"}`} target="_blank" rel="noreferrer" className="text-accent font-bold text-lg hover:underline">{content.contact_whatsapp || "+880 1700 000 000"}</a>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-float border border-slate-100 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-deep-space dark:text-white mb-2">Email Us</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">For general queries and corporate bookings.</p>
            <a href={`mailto:${content.contact_email || "support@flyeasy.com"}`} className="text-green-500 font-bold text-lg hover:underline">{content.contact_email || "support@flyeasy.com"}</a>
          </div>
        </div>



        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-deep-space dark:text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-500 dark:text-slate-400">Find quick answers to common queries.</p>
          </div>
          
          {faqs.length > 0 ? (
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
                  <button 
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                  >
                    <span className="font-semibold text-deep-space dark:text-white pr-4">{faq.question}</span>
                    <span className={`shrink-0 transition-transform ${openFaq === faq.id ? "rotate-180 text-primary" : "text-slate-400"}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </span>
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === faq.id ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 max-w-3xl mx-auto">
              <p className="text-slate-500 dark:text-slate-400">No FAQs available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
