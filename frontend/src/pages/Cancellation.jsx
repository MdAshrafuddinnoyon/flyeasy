import React, { useState, useEffect } from "react";
import { Globe, XCircle, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";

const CONTENT = {
  en: {
    title: "Cancellation Policy",
    subtitle: "Understand our cancellation and refund terms before booking.",
    sections: [
      {
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50",
        heading: "Free Cancellation Window",
        content: "Many of our packages allow free cancellation if requested 30 or more days before departure. Please check your specific package details at the time of booking."
      },
      {
        icon: AlertTriangle,
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50",
        heading: "Partial Refund Period",
        content: "Cancellations made between 7-29 days before departure are eligible for a partial refund, with deductions ranging from 25% to 50% of the total booking amount."
      },
      {
        icon: XCircle,
        color: "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50",
        heading: "No Refund Period",
        content: "Cancellations within 7 days of departure are non-refundable. This is due to pre-committed costs with hotels, airlines, and service providers."
      }
    ],
    table: {
      title: "Cancellation Fee Structure",
      headers: ["Time Before Departure", "Cancellation Fee", "Refund Amount"],
      rows: [
        ["30+ days", "10% of total", "90% refunded"],
        ["15 – 29 days", "25% of total", "75% refunded"],
        ["7 – 14 days", "50% of total", "50% refunded"],
        ["Less than 7 days", "100% of total", "No refund"],
      ]
    },
    notes: [
      "Flight ticket cancellations are subject to the airline's own refund policy, which may differ from the above.",
      "Hotel cancellation policies may vary by property and booking type.",
      "Visa fees and processing charges are non-refundable.",
      "Travel insurance premiums are non-refundable once the policy is issued.",
      "Force majeure events (natural disasters, government travel bans) may allow exceptions — contact us immediately.",
      "Refunds are processed within 7–14 working days after approval.",
    ],
    howTo: {
      title: "How to Cancel",
      steps: [
        "Email us at info@flyeasytourism.com with your booking reference.",
        "Or contact our support team via WhatsApp or phone.",
        "Provide your full name, booking ID, and reason for cancellation.",
        "Our team will confirm the cancellation and applicable charges within 24 hours.",
        "Refunds are processed within 7-14 working days after confirmation."
      ]
    }
  },
  bn: {
    title: "বাতিল নীতি",
    subtitle: "বুকিং করার আগে আমাদের বাতিল এবং রিফান্ড শর্তাবলী বুঝুন।",
    sections: [
      {
        icon: CheckCircle,
        color: "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50",
        heading: "বিনামূল্যে বাতিলকরণ সময়",
        content: "আমাদের অনেক প্যাকেজ যাত্রার ৩০ বা তার বেশি দিন আগে অনুরোধ করলে বিনামূল্যে বাতিলকরণের অনুমতি দেয়।"
      },
      {
        icon: AlertTriangle,
        color: "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50",
        heading: "আংশিক রিফান্ড সময়",
        content: "যাত্রার ৭-২৯ দিন আগে করা বাতিলকরণ আংশিক রিফান্ডের জন্য যোগ্য, মোট বুকিং পরিমাণের ২৫% থেকে ৫০% কর্তনের সাথে।"
      },
      {
        icon: XCircle,
        color: "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50",
        heading: "কোনো রিফান্ড নেই",
        content: "যাত্রার ৭ দিনের মধ্যে বাতিলকরণ অ-ফেরতযোগ্য। এটি হোটেল, এয়ারলাইন এবং সেবা প্রদানকারীদের সাথে পূর্ব-প্রতিশ্রুতিবদ্ধ খরচের কারণে।"
      }
    ],
    table: {
      title: "বাতিল ফি কাঠামো",
      headers: ["যাত্রার আগে সময়", "বাতিল ফি", "রিফান্ড পরিমাণ"],
      rows: [
        ["৩০+ দিন", "মোটের ১০%", "৯০% ফেরত"],
        ["১৫ – ২৯ দিন", "মোটের ২৫%", "৭৫% ফেরত"],
        ["৭ – ১৪ দিন", "মোটের ৫০%", "৫০% ফেরত"],
        ["৭ দিনের কম", "মোটের ১০০%", "কোনো রিফান্ড নেই"],
      ]
    },
    notes: [
      "ফ্লাইট টিকিট বাতিলকরণ এয়ারলাইনের নিজস্ব রিফান্ড নীতির অধীন।",
      "হোটেল বাতিলকরণ নীতি সম্পত্তি এবং বুকিংয়ের ধরন অনুযায়ী পরিবর্তিত হতে পারে।",
      "ভিসা ফি এবং প্রক্রিয়াকরণ চার্জ অ-ফেরতযোগ্য।",
      "রিফান্ড অনুমোদনের ৭-১৪ কার্যদিবসের মধ্যে প্রক্রিয়া করা হয়।",
    ],
    howTo: {
      title: "কীভাবে বাতিল করবেন",
      steps: [
        "আপনার বুকিং রেফারেন্স সহ info@flyeasytourism.com-এ ইমেইল করুন।",
        "অথবা হোয়াটসঅ্যাপ বা ফোনে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।",
        "আপনার পুরো নাম, বুকিং আইডি এবং বাতিলের কারণ প্রদান করুন।",
        "আমাদের টিম ২৪ ঘণ্টার মধ্যে বাতিলকরণ নিশ্চিত করবে।",
        "নিশ্চিতকরণের ৭-১৪ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া করা হবে।"
      ]
    }
  }
};

export default function Cancellation() {
  const [lang, setLang] = useState("en");
  const [dynamicPage, setDynamicPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    (async () => {
      try {
        const pages = await Entities.pages.list();
        const found = pages.find((p) => p.slug === 'cancellation' && p.status === 'published');
        if (found) setDynamicPage(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (dynamicPage) {
    return (
      <div className="bg-white dark:bg-[#0a0a0c] min-h-screen pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-bold text-deep-space dark:text-white mb-8 border-b border-border dark:border-slate-800 pb-6">
            {dynamicPage.title}
          </h1>
          <div 
            className="prose dark:prose-invert prose-slate max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: dynamicPage.content }} 
          />
        </div>
      </div>
    );
  }

  const c = CONTENT[lang];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c]">
      <div className="bg-gradient-to-br from-amber-600 to-red-600 pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <XCircle size={16} /> Cancellation
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{c.title}</h1>
          <p className="text-white/80 text-lg">{c.subtitle}</p>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Globe size={16} className="text-primary" />
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Language:</span>
          <button onClick={() => setLang("en")} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${lang === "en" ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>English</button>
          <button onClick={() => setLang("bn")} className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${lang === "bn" ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>বাংলা</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {c.sections.map((s, i) => (
            <div key={i} className={`rounded-2xl p-6 border ${s.color}`}>
              <s.icon size={24} className="mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{s.heading}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-10">
          <div className="bg-slate-900 dark:bg-slate-950 px-6 py-4">
            <h2 className="text-lg font-bold text-white">{c.table.title}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  {c.table.headers.map((h, i) => (
                    <th key={i} className="text-left px-6 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.table.rows.map((row, i) => (
                  <tr key={i} className={`border-t border-slate-100 dark:border-slate-800 ${i === c.table.rows.length - 1 ? "bg-red-50 dark:bg-red-950/20" : ""}`}>
                    {row.map((cell, j) => (
                      <td key={j} className={`px-6 py-4 text-sm ${j === 0 ? "font-semibold text-slate-900 dark:text-white" : j === 2 && i === c.table.rows.length - 1 ? "text-red-600 font-semibold" : "text-slate-600 dark:text-slate-300"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/50 mb-10">
          <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-amber-600" /> Important Notes</h3>
          <ul className="space-y-2">
            {c.notes.map((note, i) => (
              <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* How to Cancel */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-5 text-xl">{c.howTo.title}</h3>
          <div className="space-y-3">
            {c.howTo.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</div>
                <p className="text-sm text-slate-600 dark:text-slate-300 pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
