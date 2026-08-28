import React, { useState, useEffect } from "react";
import { MessageCircle, Mail, CheckCircle2, Search, Send, Clock, Reply, Download, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/admin/Pagination";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const ITEMS_PER_PAGE = 5;
  const { toast } = useToast();

  const fetchMessages = async () => {
    try {
      const res = await api.get("/email/messages");
      setMessages(res.data);
    } catch (err) {
      toast({ title: "Error loading messages", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, [toast]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await api.post(`/email/reply/${replyingTo.id}`, { replyText });
      toast({ title: "Reply sent successfully" });
      setReplyingTo(null);
      setReplyText("");
      fetchMessages(); // Refresh to show replied status
    } catch (err) {
      toast({ title: "Failed to send reply", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.delete(`/email/messages/${id}`);
      toast({ title: "Message deleted successfully" });
      fetchMessages();
    } catch (err) {
      toast({ title: "Failed to delete message", variant: "destructive" });
    }
  };

  const handleExportCSV = () => {
    if (messages.length === 0) return;
    const headers = ["id", "name", "email", "subject", "message", "replied", "created_at"];
    const csvContent = [
      headers.join(","),
      ...messages.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "messages_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = messages.filter((m) => 
    !search || 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase()) || 
    m.subject?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
          <MessageCircle className="text-primary" /> Contact Messages
        </h1>
        <p className="text-slate-500 mt-1">Manage and reply to inquiries from the Contact Us page.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search by name, email or subject..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
          />
        </div>
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
          <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl animate-pulse" />)}</div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {currentItems.map((m) => (
            <div key={m.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-float p-5">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-deep-space dark:text-white text-lg">{m.name}</h3>
                    {m.replied ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Replied
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span className="flex items-center gap-1"><Mail size={14} /> {m.email}</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {new Date(m.created_at).toLocaleString()}</span>
                  </div>
                  <h4 className="font-semibold text-deep-space dark:text-slate-200 mb-2">Subject: {m.subject || "No Subject"}</h4>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
                    {m.message}
                  </div>
                </div>
                
                <div className="shrink-0 flex md:flex-col gap-2">
                  <button 
                    onClick={() => setReplyingTo(m)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm"
                  >
                    <Reply size={16} /> {m.replied ? "Reply Again" : "Reply"}
                  </button>
                  <a href={`mailto:${m.email}`} className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                    <Mail size={16} /> Direct Email
                  </a>
                  <button onClick={() => handleDelete(m.id)} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-semibold transition-colors text-sm">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-border dark:border-slate-800">
          <p className="text-slate-500">No contact messages yet.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-deep-space dark:text-white flex items-center gap-2">
                <Reply className="text-primary" size={20} /> Reply to {replyingTo.name}
              </h2>
              <button onClick={() => setReplyingTo(null)} className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors">
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto bg-slate-50 dark:bg-slate-950/50">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 shadow-sm text-sm">
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  To: {replyingTo.email} <br/>
                  Subject: Re: {replyingTo.subject}
                </p>
                <div className="text-slate-500 dark:text-slate-400 italic line-clamp-3">"{replyingTo.message}"</div>
              </div>

              <form id="reply-form" onSubmit={handleReplySubmit}>
                <label className="block text-sm font-semibold text-deep-space dark:text-slate-200 mb-2">Your Reply</label>
                <textarea
                  required
                  rows={6}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response here... It will be sent via email."
                  className="w-full px-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </form>
            </div>
            
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
              <button type="button" onClick={() => setReplyingTo(null)} className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" form="reply-form" disabled={sending} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60">
                {sending ? "Sending..." : <><Send size={18} /> Send Reply</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
