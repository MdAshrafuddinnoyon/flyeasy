import React, { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, HelpCircle, Globe } from "lucide-react";
import { Entities } from "@/lib/api";

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <span className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base pr-4">{q}</span>
        {open ? <ChevronUp size={20} className="text-primary shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 bg-white dark:bg-slate-900">
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Entities.faqs.list()
      .then((data) => {
        const activeFaqs = data.filter(f => f.active).sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0));
        setFaqs(activeFaqs);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const groupedFaqs = useMemo(() => {
    const groups = {};
    for (const f of faqs) {
      const cat = f.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f);
    }
    return Object.entries(groups).map(([category, questions]) => ({ category, questions }));
  }, [faqs]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0a0a0c]">
      <div className="bg-gradient-to-br from-accent to-primary pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <HelpCircle size={16} /> Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-white/80 text-lg">
            Find answers to common questions about our services.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-white dark:bg-slate-900 rounded-2xl animate-pulse" />)}
          </div>
        ) : groupedFaqs.length > 0 ? (
          groupedFaqs.map((cat, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-3">
                <span className="w-2 h-6 bg-primary rounded-full" />
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.questions.map((item, j) => (
                  <FAQItem key={item.id || j} q={item.question} a={item.answer} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">No FAQs available at the moment.</p>
          </div>
        )}

        <div className="mt-12 bg-primary/5 dark:bg-primary/10 rounded-2xl p-8 text-center border border-primary/20">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
            Our team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:info@flyeasytourism.com" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all">
              Email Support
            </a>
            <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
