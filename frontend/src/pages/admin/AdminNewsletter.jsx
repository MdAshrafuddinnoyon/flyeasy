import React, { useState, useEffect } from "react";
import { Download, Search, Trash2, Loader2, Mail, Send, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Entities, api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/admin/Pagination";

export default function AdminNewsletter() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [search, setSearch] = useState("");
  
  // Date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Broadcast State
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  
  // Copy state
  const [copiedId, setCopiedId] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const data = await Entities.newsletter.list();
      setItems(data.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)));
    } catch (e) {
      console.error(e);
      toast({ title: "Failed to load subscribers", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // Filtering
  const filtered = items.filter((i) => {
    const matchSearch = !search || i.email?.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    
    if (startDate) {
      const itemDate = new Date(i.created_at);
      const start = new Date(startDate);
      if (itemDate < start) return false;
    }
    
    if (endDate) {
      const itemDate = new Date(i.created_at);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (itemDate > end) return false;
    }
    
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate]);

  const handleDelete = async (i) => {
    if (!confirm(`Delete subscriber ${i.email}?`)) return;
    try {
      await Entities.newsletter.remove(i.id);
      toast({ title: "Subscriber deleted" });
      load();
    } catch (e) {
      toast({ title: "Error deleting", variant: "destructive" });
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await api.get('/newsletter-export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'newsletter_subscribers.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast({ title: "Export successful" });
    } catch (err) {
      console.error(err);
      toast({ title: "Export failed", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!subject || !message) return toast({ title: "Subject and message are required", variant: "destructive" });
    
    if (!confirm(`Are you sure you want to send this email to all active subscribers?`)) return;
    
    setSending(true);
    try {
      const res = await api.post('/newsletter-broadcast', { subject, message });
      if (res.data.success) {
        toast({ title: res.data.message });
        setSubject("");
        setMessage("");
      } else {
        toast({ title: res.data.message || res.data.error || "Failed to broadcast", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: err.response?.data?.error || "Failed to broadcast", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const copyEmail = (email, id) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Email copied to clipboard!" });
  };

  const copyAllEmails = () => {
    const allEmails = filtered.map(i => i.email).join(', ');
    navigator.clipboard.writeText(allEmails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    toast({ title: `${filtered.length} emails copied!` });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Newsletter & Broadcast</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-slate-500">{filtered.length} subscribers found</p>
            {filtered.length > 0 && (
              <button 
                onClick={copyAllEmails}
                className="text-sm flex items-center gap-1.5 text-primary hover:text-primary/80 font-medium bg-primary/10 px-3 py-1 rounded-full transition-colors"
              >
                {copiedAll ? <Check size={14} /> : <Copy size={14} />} 
                {copiedAll ? "Copied All" : "Copy All Filtered Emails"}
              </button>
            )}
          </div>
        </div>
        <Button onClick={handleExport} disabled={exporting} className="bg-green-600 hover:bg-green-700 text-white">
          {exporting ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Download size={18} className="mr-2"/>} 
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Broadcast Composer */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sticky top-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Send Email Broadcast</h3>
                <p className="text-sm text-slate-500">Send updates to all subscribers</p>
              </div>
            </div>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <input 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Exclusive Summer Flights Discount!"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your email content here..."
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm resize-none"
                  required
                />
              </div>
              <Button type="submit" disabled={sending || items.length === 0} className="w-full bg-primary hover:bg-primary/90 text-white h-12 rounded-xl text-base font-bold">
                {sending ? <Loader2 size={20} className="animate-spin mr-2" /> : <Send size={20} className="mr-2" />}
                Send to All Subscribers
              </Button>
            </form>
          </div>
        </div>

        {/* Right Column: Subscribers List */}
        <div className="lg:col-span-2">
          
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px] relative">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Search</label>
              <Search size={16} className="absolute left-3 bottom-2.5 text-slate-400" />
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Search email..." 
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Start Date</label>
              <input 
                type="date"
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">End Date</label>
              <input 
                type="date"
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            {(search || startDate || endDate) && (
              <button 
                onClick={() => { setSearch(""); setStartDate(""); setEndDate(""); }}
                className="px-3 py-2 text-sm text-slate-500 hover:text-red-500"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="py-4 px-6 font-semibold">Email</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Subscribed At</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                     <tr><td colSpan="4" className="py-10 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></td></tr>
                  ) : paginated.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-4 px-6 font-medium text-deep-space flex items-center gap-2">
                        {item.email}
                        <button onClick={() => copyEmail(item.email, item.id)} className="text-slate-400 hover:text-primary transition-colors p-1" title="Copy email">
                          {copiedId === item.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        </button>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'subscribed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-500">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button onClick={() => handleDelete(item)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!loading && paginated.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-slate-500">No subscribers match the current filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
