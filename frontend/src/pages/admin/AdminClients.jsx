import React, { useState, useEffect } from "react";
import { Loader2, Mail } from "lucide-react";
import { Entities } from "@/lib/api";

export default function AdminClients() {
  const [users, setUsers] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [u, b] = await Promise.all([
          base44.asServiceRole.entities.User.list(),
          Entities.bookings.list(),
        ]);
        setUsers(u);
        const c = {};
        b.forEach((bk) => { if (bk.created_by_id) c[bk.created_by_id] = (c[bk.created_by_id] || 0) + 1; });
        setCounts(c);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white">Clients</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Registered users and their booking activity.</p>
      </div>
      {loading ? <div className="text-slate-400"><Loader2 className="animate-spin inline" /></div> : users.length === 0 ? (
        <p className="text-slate-400">No users yet.</p>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float overflow-hidden overflow-x-auto border border-slate-100 dark:border-slate-800">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase min-w-[560px]">
            <div className="col-span-4">User</div>
            <div className="col-span-5">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-1 text-right">Bookings</div>
          </div>
          {users.map((u) => (
            <div key={u.id} className="grid grid-cols-12 gap-4 px-5 py-3 border-t border-border dark:border-slate-800 items-center text-sm min-w-[560px]">
              <div className="col-span-4 flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                  {(u.full_name || u.email || "?").charAt(0).toUpperCase()}
                </div>
                <span className="truncate text-deep-space dark:text-white font-medium">{u.full_name || "—"}</span>
              </div>
              <div className="col-span-5 flex items-center gap-1 text-slate-500 dark:text-slate-400 min-w-0"><Mail size={12} className="shrink-0" /><span className="truncate">{u.email}</span></div>
              <div className="col-span-2"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${u.role === "admin" ? "bg-primary/10 text-primary" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>{u.role}</span></div>
              <div className="col-span-1 text-right font-semibold text-deep-space dark:text-white">{counts[u.id] || 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


