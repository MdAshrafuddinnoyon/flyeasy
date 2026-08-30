import React, { useState, useEffect } from "react";
import { Plus, Search, Pencil, Trash2, Save, Loader2, Code, Layout as LayoutIcon } from "lucide-react";
import { Entities, SiteContent } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Pagination from "@/components/admin/Pagination";
import ImagePicker from "@/components/admin/ImagePicker";
import { useSiteContent } from "@/context/SiteContext";

const EMPTY = { title: "", slug: "", content: "", status: "published" };

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState("covers");
  const [siteData, setSiteDataState] = useState({});
  const [savingSite, setSavingSite] = useState(false);
  const { setSiteData } = useSiteContent();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorMode, setEditorMode] = useState("visual");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await Entities.pages.list();
      setPages(data);
      const sData = await SiteContent.get();
      if(sData) setSiteDataState(sData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSaveSite = async () => {
    setSavingSite(true);
    try {
      await SiteContent.update(siteData);
      setSiteData(siteData); // update context
      toast({ title: "Page covers saved successfully" });
    } catch (e) {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setSavingSite(false);
    }
  };

  const filtered = pages.filter(p => !search || p.title?.toLowerCase().includes(search.toLowerCase()));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => { setEditing({ ...EMPTY }); setOpen(true); };
  const openEdit = (p) => { setEditing({ ...EMPTY, ...p }); setOpen(true); };

  const handleSave = async () => {
    if (!editing.title || !editing.slug) {
      toast({ title: "Title and slug are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing.id) {
        await Entities.pages.update(editing.id, editing);
        toast({ title: "Page updated" });
      } else {
        await Entities.pages.create(editing);
        toast({ title: "Page created" });
      }
      setOpen(false);
      load();
    } catch (e) {
      toast({ title: "Error saving page", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(`Delete "${p.title}"?`)) return;
    try {
      await Entities.pages.remove(p.id);
      toast({ title: "Page deleted" });
      load();
    } catch (e) {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm";

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Page Control</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage page covers and custom dynamic pages.</p>
        </div>
        {activeTab === "custom" && (
          <Button onClick={openNew} className="bg-primary hover:bg-primary/90"><Plus size={18} /> Add Page</Button>
        )}
      </div>

      <div className="flex gap-4 border-b border-border dark:border-slate-800 mb-6">
        <button onClick={() => setActiveTab("covers")} className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "covers" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-deep-space dark:hover:text-white"}`}>Built-in Page Covers</button>
        <button onClick={() => setActiveTab("custom")} className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === "custom" ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-deep-space dark:hover:text-white"}`}>Custom Pages</button>
      </div>

      {activeTab === "covers" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-deep-space dark:text-white">Hero Section Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 border-b border-border dark:border-slate-800 pb-8 mb-8">
              <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-sm">
              <h3 className="text-lg font-bold text-deep-space dark:text-white mb-4">Home Page Hero Settings</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Hero Media Type</label>
                  <select
                    value={siteData.home_hero_type || 'image'}
                    onChange={(e) => setSiteDataState(prev => ({...prev, home_hero_type: e.target.value}))}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:border-primary text-deep-space dark:text-white"
                  >
                    <option value="image">Image (Default)</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Hero Media Source</label>
                  {siteData.home_hero_type === 'video' ? (
                    <ImagePicker label="" value={siteData.hero_video_url || ""} onChange={(v) => setSiteDataState(prev => ({...prev, hero_video_url: v}))} />
                  ) : (
                    <ImagePicker value={siteData.hero_image_url || ""} onChange={(v) => setSiteDataState(prev => ({...prev, hero_image_url: v}))} />
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2 max-w-sm">
                  <label className="text-sm font-semibold text-deep-space dark:text-slate-200 flex justify-between">
                    Hero Image Border Radius 
                    <span className="text-primary font-bold">{siteData.hero_border_radius || 40}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="80" 
                    step="4"
                    value={siteData.hero_border_radius || 40} 
                    onChange={(e) => setSiteDataState(prev => ({...prev, hero_border_radius: e.target.value}))} 
                    className="w-full accent-primary" 
                  />
                  <p className="text-xs text-slate-500">Adjust the curve of the floating hero image on the home page.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
                { key: 'flights_hero_url', label: 'Flights Page Hero' },
                { key: 'hotels_hero_url', label: 'Hotels Page Hero' },
                { key: 'packages_hero_url', label: 'Packages Page Hero' },
                { key: 'promotions_hero_url', label: 'Promotions Page Hero' },
                { key: 'about_hero_url', label: 'About Page Hero' },
                { key: 'contact_hero_url', label: 'Contact Page Hero' },
                { key: 'cta_bg_image_url', label: 'Home Page CTA Background' },
                { key: 'process_bg_image_url', label: 'Home Page Process Background' },
                { key: 'not_found_bg_url', label: '404 Error Page Background' },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-sm font-semibold text-deep-space dark:text-slate-200">{field.label}</label>
                  <ImagePicker value={siteData[field.key] || ""} onChange={(v) => setSiteDataState(prev => ({...prev, [field.key]: v}))} />
                </div>
              ))}
            </div>

            <div className="mt-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-deep-space dark:text-white mb-4">Home Page: Services Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Headline</label>
                    <input value={siteData.services_headline || ""} onChange={(e) => setSiteDataState(prev => ({...prev, services_headline: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="e.g. Your Trusted Partner for Flights, Holidays & Travel" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Sub-headline</label>
                    <textarea value={siteData.services_subheadline || ""} onChange={(e) => setSiteDataState(prev => ({...prev, services_subheadline: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="FlyEasy helps you book flights..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Card Title</label>
                    <input value={siteData.services_card_title || ""} onChange={(e) => setSiteDataState(prev => ({...prev, services_card_title: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="Travel stress? Leave it to us" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Card Subtitle</label>
                    <input value={siteData.services_card_subtitle || ""} onChange={(e) => setSiteDataState(prev => ({...prev, services_card_subtitle: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="fly easy" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Card Description</label>
                    <textarea value={siteData.services_card_desc || ""} onChange={(e) => setSiteDataState(prev => ({...prev, services_card_desc: e.target.value}))} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="From affordable flight deals to luxury resorts..." rows={3} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Left Image 1 (Top)</label>
                    <ImagePicker value={siteData.services_img_left_1 || ""} onChange={(v) => setSiteDataState(prev => ({...prev, services_img_left_1: v}))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Left Image 2 (Bottom)</label>
                    <ImagePicker value={siteData.services_img_left_2 || ""} onChange={(v) => setSiteDataState(prev => ({...prev, services_img_left_2: v}))} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-deep-space dark:text-slate-200">Right Image</label>
                    <ImagePicker value={siteData.services_img_right || ""} onChange={(v) => setSiteDataState(prev => ({...prev, services_img_right: v}))} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={handleSaveSite} disabled={savingSite} className="bg-primary hover:bg-primary/90 px-8 py-2.5">
                {savingSite ? <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</> : <><Save size={18} className="mr-2" /> Save Covers</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "custom" && (
        <>
          <div className="relative mb-6 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} placeholder="Search pages..." className={inputCls + " pl-11"} />
          </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl animate-pulse" />)}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <div className="space-y-3">
            {currentItems.map(p => (
              <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-bold text-deep-space dark:text-white text-lg">{p.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-3">
                    <span>/p/{p.slug}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-deep-space dark:text-white flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(p)} className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 mb-4">No custom pages yet.</p>
          <Button onClick={openNew} className="bg-primary"><Plus size={18} /> Create your first page</Button>
        </div>
      )}
      </>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit Page" : "New Page"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-5 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-deep-space dark:text-white mb-2 block">Page Title *</label>
                  <input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inputCls} placeholder="e.g. Terms & Conditions" />
                </div>
                <div>
                  <label className="text-sm font-medium text-deep-space dark:text-white mb-2 block">URL Slug *</label>
                  <div className="flex items-center">
                    <span className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-r-0 border-border dark:border-slate-800 rounded-l-xl text-sm text-slate-500">/p/</span>
                    <input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inputCls + " rounded-l-none"} placeholder="terms-and-conditions" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-deep-space dark:text-white">Page Content (HTML/CSS Supported)</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button onClick={() => setEditorMode('visual')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${editorMode === 'visual' ? 'bg-white dark:bg-slate-700 shadow text-deep-space dark:text-white' : 'text-slate-500 hover:text-deep-space dark:hover:text-white'}`}>
                      <LayoutIcon size={14} /> Visual
                    </button>
                    <button onClick={() => setEditorMode('raw')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${editorMode === 'raw' ? 'bg-white dark:bg-slate-700 shadow text-deep-space dark:text-white' : 'text-slate-500 hover:text-deep-space dark:hover:text-white'}`}>
                      <Code size={14} /> Raw HTML
                    </button>
                  </div>
                </div>
                
                {editorMode === 'visual' ? (
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-border dark:border-slate-800">
                    <ReactQuill theme="snow" value={editing.content} onChange={(val) => setEditing({ ...editing, content: val })} className="h-[400px]" />
                  </div>
                ) : (
                  <textarea 
                    value={editing.content} 
                    onChange={(e) => setEditing({ ...editing, content: e.target.value })} 
                    rows={15} 
                    className={inputCls + " font-mono text-sm"} 
                    placeholder="<div class='custom-style'>\n  <h1>Raw HTML rules!</h1>\n</div>" 
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-deep-space dark:text-white mb-2 block">Status</label>
                <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className={inputCls}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border dark:border-slate-800">
                <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 flex-1 py-6">
                  {saving ? <><Loader2 size={18} className="animate-spin mr-2" /> Saving...</> : <><Save size={18} className="mr-2" /> Save Page</>}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)} className="py-6">Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
