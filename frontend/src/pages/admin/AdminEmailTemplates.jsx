import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Mail, Check, X, Search } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function AdminEmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body_html: "",
    active: true,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await Entities.email_templates.list();
      setTemplates(res || []);
    } catch (err) {
      toast({ title: "Error loading templates", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", subject: "", body_html: "", active: true });
    setShowModal(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setForm({ ...t, active: Boolean(t.active) });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this template?")) return;
    try {
      await Entities.email_templates.delete(id);
      toast({ title: "Success", description: "Template deleted" });
      loadData();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const handleLoadPreset = (preset) => {
    let body = "";
    if (preset === "booking") {
      body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="[Site Logo]" alt="[Site Name] Logo" style="max-width: 150px;" />
  </div>
  <h2 style="color: #0f172a; text-align: center;">Booking Update: [Status]</h2>
  <p style="color: #334155; font-size: 16px;">Dear [Customer Name],</p>
  <p style="color: #334155; font-size: 16px;">Your booking <strong>[Booking ID]</strong> has been updated to: <strong style="color: #3b82f6;">[Status]</strong>.</p>
  
  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0; color: #0f172a;">Booking Details</h3>
    <p style="margin: 5px 0;"><strong>Package:</strong> [Package Name]</p>
    <p style="margin: 5px 0;"><strong>Date:</strong> [Travel Date]</p>
  </div>
  
  <p style="color: #64748b; font-size: 14px;">If you have any questions, feel free to contact our support team.</p>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
  <div style="text-align: center; font-size: 12px; color: #94a3b8;">
    <p>© ${new Date().getFullYear()} [Site Name]. All rights reserved.</p>
    <p>Contact us: [Phone] | [WhatsApp]</p>
  </div>
</div>`;
    } else if (preset === "contact") {
      body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #ffffff;">
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="[Site Logo]" alt="[Site Name] Logo" style="max-width: 150px;" />
  </div>
  <h2 style="color: #0f172a; text-align: center;">We've Received Your Message!</h2>
  <p style="color: #334155; font-size: 16px;">Hi [Customer Name],</p>
  <p style="color: #334155; font-size: 16px;">Thank you for getting in touch with us at [Site Name]. We have received your inquiry and one of our team members will get back to you shortly.</p>
  
  <p style="color: #64748b; font-size: 14px;">For urgent matters, you can reach us immediately via WhatsApp or Phone.</p>
  
  <div style="text-align: center; margin-top: 30px;">
    <a href="https://wa.me/[WhatsApp]" style="background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">WhatsApp Us</a>
    <a href="tel:[Phone]" style="background-color: #0f172a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Call Us</a>
  </div>

  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0 20px 0;" />
  <div style="text-align: center; font-size: 12px; color: #94a3b8;">
    <p>© ${new Date().getFullYear()} [Site Name]. All rights reserved.</p>
    <p><a href="[Facebook]" style="color: #94a3b8;">Facebook</a> | <a href="[Instagram]" style="color: #94a3b8;">Instagram</a></p>
  </div>
</div>`;
    } else if (preset === "marketing") {
      body = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
  <div style="background-color: #f8fafc; padding: 20px; text-align: center;">
    <img src="[Site Logo]" alt="[Site Name] Logo" style="max-width: 150px;" />
  </div>
  
  <div style="padding: 30px;">
    <h2 style="color: #e11d48; text-align: center; font-size: 24px; margin-top: 0;">Special Offer Just For You!</h2>
    <p style="color: #334155; font-size: 16px; line-height: 1.5; text-align: center;">Discover our new exclusive holiday packages with amazing discounts. Don't miss out on your next unforgettable journey.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://[Site Domain]/packages" style="background-color: #e11d48; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Explore Packages</a>
    </div>
    
    <p style="color: #64748b; font-size: 14px; text-align: center;">Ready to travel? Contact our experts today to customize your trip.</p>
  </div>

  <div style="background-color: #0f172a; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} [Site Name]. All rights reserved.</p>
    <p style="margin: 0;">[Address]</p>
    <p style="margin: 10px 0 0 0;"><a href="[Facebook]" style="color: #94a3b8; margin: 0 5px;">Facebook</a> | <a href="[Instagram]" style="color: #94a3b8; margin: 0 5px;">Instagram</a></p>
  </div>
</div>`;
    }
    if (body) {
      setForm({ ...form, body_html: body });
      toast({ title: "Template Loaded", description: "The pre-built design has been applied." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editing) {
        await Entities.email_templates.update(editing.id, form);
        toast({ title: "Success", description: "Template updated" });
      } else {
        await Entities.email_templates.create(form);
        toast({ title: "Success", description: "Template created" });
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = templates.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return <div className="p-8 text-slate-500">Loading templates...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-deep-space flex items-center gap-2"><Mail size={24} className="text-primary" /> Email Templates</h1>
          <p className="text-slate-500 text-sm mt-1">Manage automated email content sent to customers.</p>
        </div>
        <button onClick={openNew} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus size={18} /> New Template
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">Template Name</th>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-deep-space">{t.name}</td>
                  <td className="px-6 py-4 text-slate-600 truncate max-w-xs">{t.subject}</td>
                  <td className="px-6 py-4">
                    {t.active ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full"><Check size={12}/> Active</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-slate-100 text-slate-600 px-2 py-1 rounded-full"><X size={12}/> Inactive</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button onClick={() => openEdit(t)} className="text-primary hover:text-primary/80"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-600"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-500">No templates found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-deep-space">{editing ? "Edit Template" : "New Template"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="templateForm" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Template Name (Internal)</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="e.g., Booking Confirmed" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Subject</label>
                    <input required type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm" placeholder="e.g., Your Booking is Confirmed!" />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm font-medium text-slate-700">HTML Body</label>
                      <select 
                        onChange={(e) => {
                          if (e.target.value) {
                            if (form.body_html && !window.confirm("Replace your current HTML with this pre-built design?")) {
                              e.target.value = "";
                              return;
                            }
                            handleLoadPreset(e.target.value);
                            e.target.value = "";
                          }
                        }}
                        className="text-xs bg-slate-100 border border-slate-200 text-slate-700 py-1 rounded px-2 focus:outline-none focus:ring-1 focus:ring-primary/30"
                      >
                        <option value="">+ Load Pre-built Design...</option>
                        <option value="booking">Booking Update Template</option>
                        <option value="contact">Contact Auto-Reply</option>
                        <option value="marketing">Marketing / Newsletter</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">Available Variables: <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">[Site Name]</code> <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">[Site Logo]</code> <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">[Customer Name]</code> <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">[Booking ID]</code> <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">[Status]</code> <code className="bg-slate-100 px-1 py-0.5 rounded text-primary">[WhatsApp]</code></p>
                    <textarea required value={form.body_html} onChange={e => setForm({...form, body_html: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-sm h-[400px]"></textarea>
                  </div>
                  <div className="flex flex-col">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Live Preview</label>
                    <p className="text-xs text-slate-500 mb-2">See how the email looks on a desktop client.</p>
                    <div className="flex-1 w-full rounded-lg border border-slate-200 overflow-hidden bg-[#f8fafc] flex items-center justify-center h-[400px]">
                      <iframe 
                        title="Email Preview"
                        className="w-full h-full border-none bg-white"
                        srcDoc={form.body_html || '<div style="font-family:sans-serif; padding: 20px; color: #94a3b8; text-align: center; margin-top: 50px;">Preview will appear here...</div>'}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="t-active" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})} className="rounded text-primary focus:ring-primary/20 border-slate-300" />
                  <label htmlFor="t-active" className="text-sm font-medium text-slate-700">Active</label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-200/50 transition-colors">Cancel</button>
              <button type="submit" form="templateForm" disabled={submitting} className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? "Saving..." : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
