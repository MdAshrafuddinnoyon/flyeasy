import React from "react";
import { Briefcase, MapPin, Clock, ArrowRight, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const POSITIONS = [
  {
    title: "Travel Sales Executive",
    department: "Sales",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    description: "We're looking for enthusiastic travel sales executives who love helping customers plan their dream vacations. Experience in travel industry preferred.",
    requirements: ["1+ years sales experience", "Knowledge of travel destinations", "Excellent communication skills", "Proficiency in MS Office"]
  },
  {
    title: "Digital Marketing Specialist",
    department: "Marketing",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    description: "Help us grow our digital presence through SEO, social media, content marketing, and paid advertising campaigns.",
    requirements: ["2+ years digital marketing experience", "Facebook/Google Ads expertise", "Content creation skills", "Analytics proficiency"]
  },
  {
    title: "Customer Support Agent",
    department: "Support",
    location: "Remote / Dhaka",
    type: "Full-time / Part-time",
    description: "Be the first point of contact for our customers. Help them with bookings, inquiries, and ensure they have a seamless travel experience.",
    requirements: ["Excellent written & verbal communication", "Patient and empathetic attitude", "Basic computer skills", "Available on weekends"]
  },
  {
    title: "Tour Operations Executive",
    department: "Operations",
    location: "Dhaka, Bangladesh",
    type: "Full-time",
    description: "Manage tour bookings, coordinate with hotels & airlines, and ensure all travel arrangements are executed flawlessly.",
    requirements: ["Experience in tour operations", "Strong organizational skills", "Attention to detail", "Problem-solving ability"]
  },
  {
    title: "Web Developer (React)",
    department: "Technology",
    location: "Remote",
    type: "Full-time / Contract",
    description: "Help us build and maintain our booking platform. You'll work on exciting features that impact thousands of travelers.",
    requirements: ["3+ years React experience", "Node.js / Express knowledge", "MySQL / database experience", "Strong portfolio"]
  },
];

const BENEFITS = [
  "Competitive salary and performance bonuses",
  "Travel perks and discounted packages",
  "Health and wellness support",
  "Professional development opportunities",
  "Flexible working arrangements",
  "Friendly and collaborative work culture",
  "Annual team travel experiences",
  "Recognition and awards program",
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0c]">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary to-accent py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2000" alt="Team" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Briefcase size={16} /> Careers
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Join the FlyEasy Team</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">Help us make travel effortless for thousands of Bangladeshis. We're building the future of travel — come join us.</p>
        </div>
      </div>

      {/* Why Join Us */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Why Work With Us?</h2>
            <p className="text-slate-500 dark:text-slate-400">We offer more than just a job — we offer a career in one of the most exciting industries.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((benefit, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <p className="text-sm text-slate-700 dark:text-slate-300">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Open Positions</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">We're hiring talented people to join our growing team.</p>
          <div className="space-y-4">
            {POSITIONS.map((pos, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 hover:shadow-float transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{pos.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><Briefcase size={14} /> {pos.department}</span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><MapPin size={14} /> {pos.location}</span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400"><Clock size={14} /> {pos.type}</span>
                    </div>
                  </div>
                  <a
                    href={`mailto:info@flyeasytourism.com?subject=Application for ${pos.title}`}
                    className="shrink-0 inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-full hover:shadow-lg transition-all text-sm"
                  >
                    Apply Now <ArrowRight size={16} />
                  </a>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{pos.description}</p>
                <div className="flex flex-wrap gap-2">
                  {pos.requirements.map((req, j) => (
                    <span key={j} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full">{req}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Open Application */}
          <div className="mt-10 bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-3">Don't see a suitable role?</h3>
            <p className="text-white/80 mb-6">Send us your CV anyway! We're always looking for talented individuals.</p>
            <a
              href="mailto:info@flyeasytourism.com?subject=Open Application - FlyEasy Tourism"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3 rounded-full hover:shadow-xl transition-all"
            >
              <Mail size={18} /> Send Open Application
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
