import React, { useState, useEffect } from "react";
import { Save, Loader2, Globe, Layout, Phone, Search, Settings, Code2, Plus, Trash2, Image as ImageIcon, Mail } from "lucide-react";
import { SiteContent } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import ImagePicker from "@/components/admin/ImagePicker";
import { useSiteContent } from "@/context/SiteContext";

const DEFAULTS = {
  site_name: "FlyEasy",
  site_domain: "",
  seo_description: "Effortless travel booking — flights, hotels, and holiday packages across Bangladesh and beyond.",
  seo_keywords: "flights, hotels, packages, travel, bangladesh, maldives",
  favicon_url: "",
  logo_light_url: "",
  logo_dark_url: "",
  invoice_logo_url: "",
  hero_badge: "Bangladesh's effortless travel platform",
  hero_headline: "Find flights, hotels & holidays in one place",
  hero_subheadline: "Effortless booking, transparent pricing, and curated travel experiences — from Cox's Bazar to the Maldives.",
  hero_image_url: "",
  header_links: [],
  about_mission: "",
  contact_phone: "+880 9600 000 000",
  contact_email: "hello@flyeasy.com",
  contact_whatsapp: "+8801700000000",
  contact_address: "Level 10, Gulshan Avenue, Dhaka 1212, Bangladesh",
  contact_hours: "Saturday - Thursday: 9:00 AM - 8:00 PM\nFriday: Closed",
  contact_map_url: "",
  footer_about: "Effortless travel, elevated. FlyEasy brings you the best flights, hotels and curated holiday packages across Bangladesh and beyond.",
  footer_links: [],
  social_facebook: "",
  social_instagram: "",
  social_twitter: "",
  social_youtube: "",
  social_linkedin: "",
  developer_name: "",
  developer_tagline: "",
  developer_website: "",
  cookie_banner_text: "We use cookies to enhance your browsing experience. By continuing, you accept our cookie policy.",
  registration_open: true,
  rewards_active: true,
  admin_url_slug: "admin",
  about_show_stats: true,
  about_show_team: true,
  about_show_certs: true,
  about_show_faqs: true,
  about_show_airlines: true,
  about_show_partners: true,
  smtp_host: "smtp.example.com",
  smtp_port: "465",
  smtp_user: "",
  smtp_pass: "",
  email_sender_name: "FlyEasy",
  email_sender_email: "hello@flyeasy.com",
  email_logo_url: "",
};

const TABS = [
  { id: "header", label: "Header & Hero", icon: Layout },
  { id: "footer", label: "Footer & Contact", icon: Phone },
  { id: "seo", label: "SEO & Meta", icon: Search },
  { id: "social", label: "Social Media", icon: Globe },
  { id: "email", label: "Email / SMTP", icon: Mail },
  { id: "features", label: "Features", icon: Plus },
  { id: "security", label: "Security", icon: Settings },
];

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";


const LinksManager = ({ links, onChange, title, placeholder }) => {
    const add = () => onChange([...(links || []), { label: "", url: "" }]);
    const upd = (i, field, val) => { const n = [...(links || [])]; n[i] = { ...n[i], [field]: val }; onChange(n); };
    const rem = (i) => onChange((links || []).filter((_, idx) => idx !== i));
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-border dark:border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm text-deep-space dark:text-white">{title}</h4>
          <button type="button" onClick={add} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 flex items-center gap-1 font-medium">
            <Plus size={13} /> Add Link
          </button>
        </div>
        <div className="space-y-2">
          {(links || []).map((lnk, i) => (
            <div key={i} className="flex items-center gap-2">
              <input value={lnk.label} onChange={e => upd(i, 'label', e.target.value)} placeholder="Label (e.g. About)" className="flex-1 px-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-1 ring-primary/30" />
              <input value={lnk.url} onChange={e => upd(i, 'url', e.target.value)} placeholder={placeholder || "/about"} className="flex-1 px-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-1 ring-primary/30" />
              <button type="button" onClick={() => rem(i)} className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors shrink-0"><Trash2 size={15} /></button>
            </div>
          ))}
          {!(links && links.length > 0) && <p className="text-xs text-slate-400 italic">No links added yet.</p>}
        </div>
      </div>
    );
  };

  
const FooterColumnsManager = ({ columns, onChange }) => {
    const addCol = () => onChange([...(columns || []), { title: "", links: [] }]);
    const updColTitle = (i, title) => { const n = JSON.parse(JSON.stringify(columns || [])); n[i].title = title; onChange(n); };
    const remCol = (i) => onChange((columns || []).filter((_, idx) => idx !== i));
    
    const addLink = (colIdx) => { const n = JSON.parse(JSON.stringify(columns || [])); n[colIdx].links = [...(n[colIdx].links || []), {label: "", url: ""}]; onChange(n); };
    const updLink = (colIdx, linkIdx, field, val) => { const n = JSON.parse(JSON.stringify(columns || [])); n[colIdx].links[linkIdx][field] = val; onChange(n); };
    const remLink = (colIdx, linkIdx) => { const n = JSON.parse(JSON.stringify(columns || [])); n[colIdx].links = n[colIdx].links.filter((_, idx) => idx !== linkIdx); onChange(n); };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-deep-space dark:text-white">Footer Navigation Columns</h4>
          <button type="button" onClick={addCol} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 flex items-center gap-1 font-medium">
            <Plus size={13} /> Add Column
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {(columns || []).map((col, colIdx) => (
            <div key={colIdx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-border dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border dark:border-slate-700">
                <input value={col.title} onChange={e => updColTitle(colIdx, e.target.value)} placeholder="Column Title (e.g. SERVICES)" className="flex-1 px-3 py-2 text-sm font-bold rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-1 ring-primary/30" />
                <button type="button" onClick={() => addLink(colIdx)} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-2 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" title="Add Link"><Plus size={14}/></button>
                <button type="button" onClick={() => remCol(colIdx)} className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors shrink-0" title="Delete Column"><Trash2 size={16} /></button>
              </div>
              <div className="space-y-2">
                {(col.links || []).map((lnk, linkIdx) => (
                  <div key={linkIdx} className="flex items-center gap-2">
                    <input value={lnk.label} onChange={e => updLink(colIdx, linkIdx, 'label', e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 text-xs rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-1 ring-primary/30" />
                    <input value={lnk.url} onChange={e => updLink(colIdx, linkIdx, 'url', e.target.value)} placeholder="/url" className="flex-1 px-3 py-2 text-xs rounded-lg border border-border dark:border-slate-700 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-1 ring-primary/30" />
                    <button type="button" onClick={() => remLink(colIdx, linkIdx)} className="text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors shrink-0"><Trash2 size={13} /></button>
                  </div>
                ))}
                {!(col.links && col.links.length > 0) && <p className="text-xs text-slate-400 italic">No links in this column.</p>}
              </div>
            </div>
          ))}
          {!(columns && columns.length > 0) && <p className="text-xs text-slate-400 italic col-span-full">No columns added yet.</p>}
        </div>
      </div>
    );
  };

  
const Field = ({ label, k, textarea, image, type = "text", content, update }) => (
    <div>
      <label className="block text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5">{label}</label>
      {image ? (
        <ImagePicker label="" value={content[k] || ""} onChange={(v) => update(k, v)} />
      ) : textarea ? (
        <textarea rows={3} value={content[k] || ""} onChange={e => update(k, e.target.value)} className={inputCls} />
      ) : (
        <input type={type} value={content[k] !== undefined ? String(content[k]) : ""} onChange={e => update(k, e.target.value)} className={inputCls} />
      )}
    </div>
  );


export default function AdminContent() {
  const { toast } = useToast();
  const { setSiteData } = useSiteContent();
  const [content, setContent] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("header");

  useEffect(() => {
    (async () => {
      try {
        const data = await SiteContent.get();
        if (data) {
          const filteredData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v != null)
          );
          setContent(prev => ({
            ...prev,
            ...filteredData,
            header_links: data.header_links || [],
            footer_links: data.footer_links || [],
          }));
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const update = (key, val) => setContent(prev => ({ ...prev, [key]: val }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await SiteContent.update(content);
      // Update global SiteContext so Logo/Favicon etc. update in real-time
      setSiteData(content);
      toast({ title: "✅ Site content saved successfully." });
    } catch (err) {
      toast({ title: "Save failed. " + (err.message || ""), variant: "destructive" });
    } finally { setSaving(false); }
  };

  
  if (loading) return <div className="py-20 text-center"><Loader2 className="animate-spin inline text-primary" size={32} /></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Site Content</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all website content — Header, Footer, SEO, Social Media, and more.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg shadow-primary/20"
                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-primary border border-border dark:border-slate-800"
            }`}
          >
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={save} className="max-w-4xl">
        {/* --- HEADER TAB --- */}
        {activeTab === "header" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">Branding</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Upload your site logos and favicon. Changes will apply across the entire website in real-time after saving.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Site Name" k="site_name"  content={content} update={update} />
                <div></div>
                <Field label="Logo (Light Mode — dark text on transparent)" k="logo_light_url" image  content={content} update={update} />
                <Field label="Logo (Dark Mode — white text on transparent)" k="logo_dark_url" image  content={content} update={update} />
                <div className="sm:col-span-2"><Field label="Invoice/PDF Logo (For Tickets & Receipts)" k="invoice_logo_url" image  content={content} update={update} /></div>
                <div className="sm:col-span-2"><Field label="Favicon (32x32 PNG or ICO)" k="favicon_url" image  content={content} update={update} /></div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">Navigation Links</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add extra links to the top navigation bar. These appear after the default menu items.</p>
              <LinksManager links={content.header_links} onChange={(v) => update("header_links", v)} title="Extra Navigation Links" placeholder="/testimonials" />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">Hero Section</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Hero Badge (small text above headline)" k="hero_badge"  content={content} update={update} />
                <div></div>
                <div className="sm:col-span-2"><Field label="Hero Headline" k="hero_headline"  content={content} update={update} /></div>
                <div className="sm:col-span-2"><Field label="Hero Sub-headline" k="hero_subheadline" textarea  content={content} update={update} /></div>
                <div className="sm:col-span-2"><Field label="Hero Background Image" k="hero_image_url" image  content={content} update={update} /></div>
              </div>
            </div>
          </div>
        )}

        {/* --- FOOTER TAB --- */}
        {activeTab === "footer" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <FooterColumnsManager columns={content.footer_links} onChange={(v) => update("footer_links", v)} />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Contact Phone" k="contact_phone"  content={content} update={update} />
                <Field label="Contact Email" k="contact_email" type="email"  content={content} update={update} />
                <Field label="WhatsApp Number (e.g. 88017...)" k="contact_whatsapp"  content={content} update={update} />
                <Field label="Site Domain (e.g. flyeasy.com)" k="site_domain"  content={content} update={update} />
                <div className="sm:col-span-2"><Field label="Office Address" k="contact_address" textarea  content={content} update={update} /></div>
                <div className="sm:col-span-2"><Field label="Operating Hours" k="contact_hours" textarea  content={content} update={update} /></div>
                <div className="sm:col-span-2"><Field label="Google Maps Embed URL" k="contact_map_url" textarea  content={content} update={update} /></div>
                <div className="sm:col-span-2"><Field label="Footer About Text" k="footer_about" textarea  content={content} update={update} /></div>
              </div>
            </div>
          </div>
        )}

        {/* --- SEO TAB --- */}
        {activeTab === "seo" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">SEO & Meta Tags</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">These settings control how your site appears in Google search results and when shared on social media.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Site Name" k="site_name"  content={content} update={update} />
              <Field label="Favicon" k="favicon_url" image  content={content} update={update} />
              <div className="sm:col-span-2"><Field label="Meta Description (150-160 chars)" k="seo_description" textarea  content={content} update={update} /></div>
              <div className="sm:col-span-2"><Field label="SEO Keywords (comma-separated)" k="seo_keywords"  content={content} update={update} /></div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5">Cookie Consent Banner Text</label>
                <textarea rows={2} value={content.cookie_banner_text || ""} onChange={e => update("cookie_banner_text", e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>
        )}

        {/* --- EMAIL / SMTP TAB --- */}
        {activeTab === "email" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">SMTP Server Settings</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Configure your email server to send automated booking emails and contact form replies.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="SMTP Host" k="smtp_host"  content={content} update={update} />
                <Field label="SMTP Port" k="smtp_port"  content={content} update={update} />
                <Field label="SMTP Username" k="smtp_user"  content={content} update={update} />
                <Field label="SMTP Password" k="smtp_pass" type="password"  content={content} update={update} />
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">Email Appearance & Sender</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">These details will be used in the dynamic email templates and "From" addresses.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Sender Name (e.g. FlyEasy)" k="email_sender_name"  content={content} update={update} />
                <Field label="Sender Email Address" k="email_sender_email" type="email"  content={content} update={update} />
                <div className="sm:col-span-2"><Field label="Email Logo (Used inside templates)" k="email_logo_url" image  content={content} update={update} /></div>
              </div>
            </div>
          </div>
        )}

        {/* --- SOCIAL MEDIA TAB --- */}
        {activeTab === "social" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">Social Media Links</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Enter full URLs to your social media profiles. These appear in the footer and About page.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Facebook Page URL" k="social_facebook"  content={content} update={update} />
              <Field label="Instagram Profile URL" k="social_instagram"  content={content} update={update} />
              <Field label="Twitter / X Profile URL" k="social_twitter"  content={content} update={update} />
              <Field label="YouTube Channel URL" k="social_youtube"  content={content} update={update} />
              <Field label="LinkedIn Page URL" k="social_linkedin"  content={content} update={update} />
            </div>
          </div>
        )}

        {/* --- FEATURES TAB --- */}
        {activeTab === "features" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">Rewards System</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Control whether the rewards system is active for customers.</p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="rewards_active"
                  checked={!!content.rewards_active}
                  onChange={e => update("rewards_active", e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="rewards_active" className="text-sm font-medium text-deep-space dark:text-white">
                  Enable Customer Rewards
                </label>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">Home Page Reviews Auto-Slide</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Control whether the reviews section on the homepage automatically slides.</p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="reviews_auto_slide"
                  checked={content.reviews_auto_slide !== false}
                  onChange={e => update("reviews_auto_slide", e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="reviews_auto_slide" className="text-sm font-medium text-deep-space dark:text-white">
                  Enable Reviews Auto-Slide
                </label>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">About Page Sections</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Control which sections are visible on the About page.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: "about_show_stats", label: "Show Stats & Numbers" },
                  { key: "about_show_team", label: "Show Team Members" },
                  { key: "about_show_certs", label: "Show Certificates & Awards" },
                  { key: "about_show_faqs", label: "Show FAQs" },
                  { key: "about_show_airlines", label: "Show Top Airlines" },
                  { key: "about_show_partners", label: "Show Partners Logo Ticker" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={item.key}
                      checked={content[item.key] !== false}
                      onChange={e => update(item.key, e.target.checked)}
                      className="w-5 h-5 accent-primary"
                    />
                    <label htmlFor={item.key} className="text-sm font-medium text-deep-space dark:text-white">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- SECURITY TAB --- */}
        {activeTab === "security" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">Admin URL Slug</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                ⚠️ Changing this will move the admin panel to a new URL. You'll be redirected automatically after saving.
                Current admin URL: <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-primary font-mono text-xs">/{content.admin_url_slug || "admin"}</code>
              </p>
              <Field label="Admin URL Slug (letters and dashes only)" k="admin_url_slug"  content={content} update={update} />
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-6 border border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-deep-space dark:text-white mb-2 pb-3 border-b border-slate-100 dark:border-slate-800">Registration Control</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Control whether new users can create accounts on the website.</p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="registration_open"
                  checked={!!content.registration_open}
                  onChange={e => update("registration_open", e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="registration_open" className="text-sm font-medium text-deep-space dark:text-white">
                  Allow new user registrations
                </label>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-6">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">⚠️ Security Reminder</h3>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc pl-4">
                <li>Use a strong, unique admin URL slug that is hard to guess</li>
                <li>Keep your admin password private and never share it</li>
                <li>Ensure your site runs on HTTPS in production</li>
                <li>Regularly review user accounts for unauthorized access</li>
              </ul>
            </div>
          </div>
        )}

        {/* Sticky Save Button */}
        <div className="sticky bottom-6 flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-60"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving…" : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
