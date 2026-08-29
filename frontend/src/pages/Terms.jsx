import React, { useState } from 'react';
import { Shield, Lock, Globe, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";

const CONTENT = {
  en: {
    title: "Terms & Conditions",
    subtitle: "Please read these terms carefully before using our services.",
    lastUpdated: "Last updated: August 2026",
    sections: [
      {
        heading: "1. Agreement to Terms",
        content: `By accessing and using FlyEasy Tourism's services — including our website, mobile application, and booking platforms — you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.\n\nFlyEasy Tourism operates as a licensed travel agency in Bangladesh, providing flight booking, hotel reservations, holiday packages, and related travel services.`
      },
      {
        heading: "2. Booking & Payment",
        content: `2.1 All bookings made through FlyEasy are subject to availability and price confirmation at the time of booking.\n\n2.2 Prices quoted are subject to change without prior notice until full payment is received and booking confirmation is issued.\n\n2.3 Payment must be completed in full within the stipulated time. FlyEasy accepts bank transfer, mobile banking (bKash, Nagad, Rocket), and cash payments at our offices.\n\n2.4 A booking confirmation email/SMS will be sent within 24 hours of successful payment.\n\n2.5 FlyEasy reserves the right to cancel any booking where fraudulent payment activity is suspected.`
      },
      {
        heading: "3. Cancellation & Refund Policy",
        content: `3.1 Cancellations must be submitted in writing via email to info@flyeasytourism.com or through our customer support.\n\n3.2 Cancellation charges apply as follows:\n• 30+ days before departure: 10% of total booking amount\n• 15-29 days before departure: 25% of total booking amount\n• 7-14 days before departure: 50% of total booking amount\n• Less than 7 days before departure: No refund\n\n3.3 Flight tickets are subject to the airline's own cancellation and refund policy.\n\n3.4 Refunds will be processed within 7-14 working days after approval.`
      },
      {
        heading: "4. Travel Documents & Visa",
        content: `4.1 It is the sole responsibility of the traveller to ensure all travel documents (passport, visa, health certificates) are valid and obtained before travel.\n\n4.2 FlyEasy may assist with visa guidance but does not guarantee visa approval.\n\n4.3 Passports must be valid for at least 6 months beyond the date of travel.\n\n4.4 FlyEasy shall not be held liable for denied boarding or entry due to inadequate travel documents.`
      },
      {
        heading: "5. Travel Insurance",
        content: `5.1 FlyEasy strongly recommends all travellers to obtain comprehensive travel insurance prior to departure.\n\n5.2 Travel insurance should cover medical emergencies, trip cancellation, lost baggage, and personal liability.\n\n5.3 FlyEasy is not responsible for any losses arising from the absence of travel insurance.`
      },
      {
        heading: "6. Liability & Disclaimer",
        content: `6.1 FlyEasy acts as an intermediary between travellers and service providers (airlines, hotels, tour operators). We are not responsible for the quality of services provided by third parties.\n\n6.2 FlyEasy shall not be liable for any loss, damage, delay, or inconvenience caused by circumstances beyond our control (force majeure), including but not limited to natural disasters, government actions, strikes, or civil unrest.\n\n6.3 FlyEasy's maximum liability to any customer shall not exceed the total amount paid for the booking in question.`
      },
      {
        heading: "7. Privacy & Data Protection",
        content: `7.1 By using our services, you consent to the collection and use of your personal information as described in our Privacy Policy.\n\n7.2 FlyEasy does not sell or share your personal data with third parties for marketing purposes without your explicit consent.\n\n7.3 We use industry-standard security measures to protect your data.`
      },
      {
        heading: "8. Governing Law",
        content: `These Terms and Conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh. Any disputes arising shall be subject to the exclusive jurisdiction of the courts of Bangladesh.`
      },
      {
        heading: "9. Changes to Terms",
        content: `FlyEasy reserves the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Continued use of our services after changes constitutes acceptance of the new terms.`
      },
      {
        heading: "10. Contact Us",
        content: `For any questions regarding these Terms & Conditions:\n\nFlyEasy Tourism\nEmail: info@flyeasytourism.com\nWhatsApp: +880 1XXXXXXXXX\nWebsite: www.flyeasytourism.com`
      }
    ]
  },
  bn: {
    title: "শর্তাবলী ও নিয়মনীতি",
    subtitle: "আমাদের সেবা ব্যবহার করার আগে অনুগ্রহ করে এই শর্তাবলী মনোযোগ সহকারে পড়ুন।",
    lastUpdated: "সর্বশেষ আপডেট: আগস্ট ২০২৬",
    sections: [
      {
        heading: "১. শর্তাবলীতে সম্মতি",
        content: `ফ্লাইইজি ট্যুরিজমের সেবা — ওয়েবসাইট, মোবাইল অ্যাপ এবং বুকিং প্ল্যাটফর্ম — ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলীর সাথে একমত না হন, তাহলে অনুগ্রহ করে আমাদের সেবা ব্যবহার করবেন না।\n\nফ্লাইইজি ট্যুরিজম বাংলাদেশে একটি লাইসেন্সপ্রাপ্ত ট্রাভেল এজেন্সি হিসেবে ফ্লাইট বুকিং, হোটেল রিজার্ভেশন, হলিডে প্যাকেজ এবং সংশ্লিষ্ট ট্রাভেল সেবা প্রদান করে।`
      },
      {
        heading: "২. বুকিং ও পেমেন্ট",
        content: `২.১ ফ্লাইইজির মাধ্যমে করা সমস্ত বুকিং বুকিংয়ের সময় প্রাপ্যতা এবং মূল্য নিশ্চিতকরণের উপর নির্ভরশীল।\n\n২.২ পূর্ণ পেমেন্ট প্রাপ্ত এবং বুকিং নিশ্চিতকরণ ইস্যু না হওয়া পর্যন্ত উল্লিখিত মূল্য পূর্ব বিজ্ঞপ্তি ছাড়াই পরিবর্তন হতে পারে।\n\n২.৩ নির্ধারিত সময়ের মধ্যে সম্পূর্ণ পেমেন্ট করতে হবে। ফ্লাইইজি ব্যাংক ট্রান্সফার, মোবাইল ব্যাংকিং (বিকাশ, নগদ, রকেট) এবং অফিসে নগদ পেমেন্ট গ্রহণ করে।\n\n২.৪ সফল পেমেন্টের ২৪ ঘণ্টার মধ্যে একটি বুকিং নিশ্চিতকরণ ইমেইল/SMS পাঠানো হবে।`
      },
      {
        heading: "৩. বাতিল ও রিফান্ড নীতি",
        content: `৩.১ বাতিলকরণ অবশ্যই info@flyeasytourism.com ইমেইলে বা কাস্টমার সাপোর্টের মাধ্যমে লিখিতভাবে জমা দিতে হবে।\n\n৩.২ বাতিল চার্জ নিম্নরূপ প্রযোজ্য:\n• যাত্রার ৩০+ দিন আগে: মোট বুকিং পরিমাণের ১০%\n• যাত্রার ১৫-২৯ দিন আগে: মোট বুকিং পরিমাণের ২৫%\n• যাত্রার ৭-১৪ দিন আগে: মোট বুকিং পরিমাণের ৫০%\n• যাত্রার ৭ দিনের কম আগে: কোনো রিফান্ড নেই\n\n৩.৩ ফ্লাইট টিকিট এয়ারলাইনের নিজস্ব বাতিলকরণ এবং রিফান্ড নীতির অধীন।\n\n৩.৪ অনুমোদনের পর ৭-১৪ কার্যদিবসের মধ্যে রিফান্ড প্রক্রিয়া করা হবে।`
      },
      {
        heading: "৪. ভ্রমণ দলিল ও ভিসা",
        content: `৪.১ ভ্রমণকারীর নিজস্ব দায়িত্বে নিশ্চিত করতে হবে যে সমস্ত ভ্রমণ দলিল (পাসপোর্ট, ভিসা, স্বাস্থ্য সনদ) বৈধ এবং ভ্রমণের আগে প্রাপ্ত হয়েছে।\n\n৪.২ ফ্লাইইজি ভিসা গাইডেন্সে সহায়তা করতে পারে কিন্তু ভিসা অনুমোদনের নিশ্চয়তা দেয় না।\n\n৪.৩ পাসপোর্ট ভ্রমণের তারিখের পরে কমপক্ষে ৬ মাস বৈধ হতে হবে।`
      },
      {
        heading: "৫. দায় ও দাবিত্যাগ",
        content: `৫.১ ফ্লাইইজি ভ্রমণকারী এবং সেবা প্রদানকারীদের (এয়ারলাইন, হোটেল, ট্যুর অপারেটর) মধ্যে মধ্যস্থতাকারী হিসেবে কাজ করে।\n\n৫.২ প্রাকৃতিক দুর্যোগ, সরকারি পদক্ষেপ, ধর্মঘট বা সামরিক অশান্তিসহ আমাদের নিয়ন্ত্রণের বাইরের পরিস্থিতির কারণে সৃষ্ট যেকোনো ক্ষতি, বিলম্ব বা অসুবিধার জন্য ফ্লাইইজি দায়বদ্ধ নয়।`
      },
      {
        heading: "৬. প্রযোজ্য আইন",
        content: `এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের আইন অনুযায়ী পরিচালিত এবং ব্যাখ্যা করা হবে। যেকোনো বিরোধ বাংলাদেশের আদালতের এখতিয়ারের অধীনে হবে।`
      }
    ]
  }
};

export default function TermsConditions() {
  const [lang, setLang] = useState("en");
  const [dynamicPage, setDynamicPage] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        const pages = await Entities.pages.list();
        const found = pages.find((p) => p.slug === 'terms' && p.status === 'published');
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
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary to-accent pt-32 pb-16 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Shield size={16} /> Legal
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{c.title}</h1>
          <p className="text-white/80 text-lg">{c.subtitle}</p>
          <p className="text-white/60 text-sm mt-3">{c.lastUpdated}</p>
        </div>
      </div>

      {/* Language Toggle */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Globe size={16} className="text-primary" />
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Language:</span>
          <button
            onClick={() => setLang("en")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${lang === "en" ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            English
          </button>
          <button
            onClick={() => setLang("bn")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${lang === "bn" ? "bg-primary text-white" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
          >
            বাংলা
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          {c.sections.map((section, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                {section.heading}
              </h2>
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20 text-center">
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            {lang === "en" 
              ? "For questions about these terms, contact us at " 
              : "এই শর্তাবলী সম্পর্কে প্রশ্নের জন্য যোগাযোগ করুন: "}
            <a href="mailto:info@flyeasytourism.com" className="text-primary font-semibold hover:underline">
              info@flyeasytourism.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
