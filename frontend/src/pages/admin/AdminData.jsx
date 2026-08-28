import React, { useState, useEffect } from "react";
import { Database, Download, Loader2, RefreshCw } from "lucide-react";
import { Entities } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

const ENTITIES = [
{ name: "Package", label: "Packages" },
{ name: "Hotel", label: "Hotels" },
{ name: "Promotion", label: "Promotions" },
{ name: "Airline", label: "Airlines" },
{ name: "Booking", label: "Bookings" },
{ name: "Announcement", label: "Announcements" },
{ name: "SiteContent", label: "Site Content" },
];

export default function AdminData() {
const { toast } = useToast();
const [counts, setCounts] = useState({});
const [loading, setLoading] = useState(true);
const [exporting, setExporting] = useState(null);

const load = async () => {
setLoading(true);
const c = {};
for (const e of ENTITIES) {
try { const list = await base44.asServiceRole.entities[e.name].list(); c[e.name] = list.length; }
catch (err) { c[e.name] = 0; }
}
setCounts(c); setLoading(false);
};
useEffect(() => { load(); }, []);

const exportEntity = async (e) => {
setExporting(e.name);
try {
const list = await base44.asServiceRole.entities[e.name].list();
const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url; a.download = `${e.name}_${new Date().toISOString().slice(0, 10)}.json`;
a.click(); URL.revokeObjectURL(url);
toast({ title: `Exported ${list.length} ${e.label}` });
} catch (err) { toast({ title: "Export failed", variant: "destructive" }); }
finally { setExporting(null); }
};

return (
<div>
<div className="mb-8 flex items-end justify-between gap-4">
<div>
<h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Data & Migration</h1>
<p className="text-slate-500 dark:text-slate-400 mt-1">Record overview and JSON export backups (migration files).</p>
</div>
<button onClick={load} className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:gap-3 transition-all whitespace-nowrap">
<RefreshCw size={16} /> Refresh
</button>
</div>
{loading ? <div className="text-slate-400"><Loader2 className="animate-spin inline" /></div> : (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
{ENTITIES.map((e) => (
<div key={e.name} className="bg-white dark:bg-slate-900 rounded-2xl shadow-float p-5 border border-slate-100 dark:border-slate-800">
<div className="flex items-center gap-3 mb-3">
<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Database size={18} className="text-primary" /></div>
<div>
<div className="font-semibold text-deep-space dark:text-white text-sm">{e.label}</div>
<div className="text-xs text-slate-500 dark:text-slate-400">{counts[e.name] || 0} records</div>
</div>
</div>
<button onClick={() => exportEntity(e)} disabled={exporting === e.name} className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium border border-border dark:border-slate-800 dark:text-slate-300 rounded-xl py-2 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60">
<Download size={14} /> {exporting === e.name ? "Exporting…" : "Export JSON"}
</button>
</div>
))}
</div>
)}
</div>
);
}


