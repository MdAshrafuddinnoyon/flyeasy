import React, { useState } from "react";
import { Lock, Globe, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";

const CONTENT = {
  en: {
    title: "Privacy Policy",
    subtitle: "How we collect, use, and protect your personal information.",
    lastUpdated: "Last updated: August 2026",
    sections: [
      {
        heading: "Information We Collect",
        content: `We collect the following types of information when you use FlyEasy's services:\n\n• Personal Information: Full name, email address, phone number, date of birth, passport details.\n• Booking Information: Travel dates, destinations, passenger details, payment information.\n• Usage Information: Pages visited, search queries, browser type, IP address, device information.\n• Communication Data: Messages, emails, and inquiries sent to our support team.`
      },
      {
        heading: "How We Use Your Information",
        content: `FlyEasy uses your personal information to:\n\n• Process and manage your bookings and reservations.\n• Send booking confirmations, itineraries, and travel updates.\n• Provide customer support and respond to inquiries.\n• Improve our services and personalize your experience.\n• Send promotional offers and travel deals (you may opt out at any time).\n• Comply with legal obligations and prevent fraud.`
      },
      {
        heading: "Information Sharing",
        content: `We share your personal information with:\n\n• Service Providers: Airlines, hotels, and tour operators necessary to fulfill your booking.\n• Payment Processors: Secure payment gateways to process transactions.\n• Legal Authorities: When required by law or to protect our rights.\n\nWe do NOT sell your personal data to third parties for marketing purposes.`
      },
      {
        heading: "Data Security",
        content: `FlyEasy implements industry-standard security measures to protect your personal data:\n\n• SSL encryption for all data transmission.\n• Secure servers with access controls.\n• Regular security audits and vulnerability assessments.\n• Staff training on data protection practices.\n\nHowever, no method of transmission over the internet is 100% secure. We encourage you to use strong passwords and not share your account credentials.`
      },
      {
        heading: "Cookies",
        content: `FlyEasy uses cookies to enhance your browsing experience:\n\n• Essential Cookies: Required for the website to function properly.\n• Analytics Cookies: Help us understand how visitors use our site.\n• Preference Cookies: Remember your settings and preferences.\n\nYou can control cookie settings through your browser preferences.`
      },
      {
        heading: "Your Rights",
        content: `You have the following rights regarding your personal data:\n\n• Access: Request a copy of the personal data we hold about you.\n• Correction: Request correction of inaccurate personal data.\n• Deletion: Request deletion of your personal data (subject to legal requirements).\n• Portability: Request transfer of your data in a machine-readable format.\n• Objection: Object to processing of your personal data for marketing purposes.\n\nTo exercise these rights, contact us at info@flyeasytourism.com.`
      },
      {
        heading: "Data Retention",
        content: `We retain your personal data for as long as necessary to:\n\n• Provide our services and maintain your account.\n• Comply with legal, accounting, and reporting requirements.\n• Resolve disputes and enforce our agreements.\n\nBooking records are typically retained for 7 years in accordance with Bangladesh tax regulations.`
      },
      {
        heading: "Contact Us",
        content: `For privacy-related inquiries:\n\nFlyEasy Tourism — Data Protection\nEmail: info@flyeasytourism.com\nWebsite: www.flyeasytourism.com`
      }
    ]
  },
  bn: {
    title: "গোপনীয়তা নীতি",
    subtitle: "আমরা কীভাবে আপনার ব্যক্তিগত তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি।",
    lastUpdated: "সর্বশেষ আপডেট: আগস্ট ২০২৬",
    sections: [
      {
        heading: "আমরা কোন তথ্য সংগ্রহ করি",
        content: `ফ্লাইইজির সেবা ব্যবহার করার সময় আমরা নিম্নলিখিত ধরনের তথ্য সংগ্রহ করি:\n\n• ব্যক্তিগত তথ্য: পুরো নাম, ইমেইল ঠিকানা, ফোন নম্বর, জন্ম তারিখ, পাসপোর্টের বিবরণ।\n• বুকিং তথ্য: ভ্রমণের তারিখ, গন্তব্য, যাত্রীর বিবরণ, পেমেন্ট তথ্য।\n• ব্যবহারের তথ্য: পরিদর্শন করা পৃষ্ঠা, অনুসন্ধান প্রশ্ন, ব্রাউজারের ধরন, আইপি ঠিকানা।`
      },
      {
        heading: "আমরা আপনার তথ্য কীভাবে ব্যবহার করি",
        content: `ফ্লাইইজি আপনার ব্যক্তিগত তথ্য ব্যবহার করে:\n\n• আপনার বুকিং এবং রিজার্ভেশন প্রক্রিয়া ও পরিচালনা করতে।\n• বুকিং নিশ্চিতকরণ, ভ্রমণসূচী এবং ভ্রমণ আপডেট পাঠাতে।\n• গ্রাহক সহায়তা প্রদান এবং অনুসন্ধানে সাড়া দিতে।\n• আমাদের সেবা উন্নত করতে এবং আপনার অভিজ্ঞতা ব্যক্তিগতকৃত করতে।\n• প্রচারমূলক অফার এবং ভ্রমণ ডিল পাঠাতে (আপনি যেকোনো সময় অপ্ট-আউট করতে পারেন)।`
      },
      {
        heading: "তথ্য ভাগাভাগি",
        content: `আমরা আপনার ব্যক্তিগত তথ্য শেয়ার করি:\n\n• সেবা প্রদানকারী: আপনার বুকিং পূরণের জন্য প্রয়োজনীয় এয়ারলাইন, হোটেল এবং ট্যুর অপারেটরদের সাথে।\n• পেমেন্ট প্রসেসর: লেনদেন প্রক্রিয়া করার জন্য নিরাপদ পেমেন্ট গেটওয়ে।\n• আইনি কর্তৃপক্ষ: আইনের প্রয়োজনে বা আমাদের অধিকার রক্ষার জন্য।\n\nআমরা মার্কেটিং উদ্দেশ্যে তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত ডেটা বিক্রি করি না।`
      },
      {
        heading: "আপনার অধিকার",
        content: `আপনার ব্যক্তিগত ডেটার বিষয়ে আপনার নিম্নলিখিত অধিকার রয়েছে:\n\n• অ্যাক্সেস: আমাদের কাছে থাকা আপনার ব্যক্তিগত ডেটার একটি কপি অনুরোধ করুন।\n• সংশোধন: ভুল ব্যক্তিগত ডেটা সংশোধনের অনুরোধ করুন।\n• মুছে ফেলা: আপনার ব্যক্তিগত ডেটা মুছে ফেলার অনুরোধ করুন।\n• আপত্তি: মার্কেটিং উদ্দেশ্যে আপনার ব্যক্তিগত ডেটা প্রক্রিয়াকরণে আপত্তি করুন।`
      }
    ]
  }
};

export default function Privacy() {
  const [lang, setLang] = useState("en");
  const [dynamicPage, setDynamicPage] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const pages = await Entities.pages.list();
        const found = pages.find((p) => p.slug === 'privacy' && p.status === 'published');
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
      <div className="bg-gradient-to-br from-slate-900 to-primary pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Lock size={16} /> Privacy
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{c.title}</h1>
          <p className="text-white/80 text-lg">{c.subtitle}</p>
          <p className="text-white/60 text-sm mt-3">{c.lastUpdated}</p>
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
        <div className="space-y-8">
          {c.sections.map((section, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{section.heading}</h2>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">{section.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
