import React, { useState } from "react";
import { Search, Bell, Mail, CheckCircle2 } from "lucide-react";
import DeveloperCredit from "@/components/DeveloperCredit";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Entities } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function PortalHeader({ user }) {
  const [showNotifs, setShowNotifs] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const all = await Entities.notifications.list();
      return all.filter(n => n.user_email === user.email).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
    },
    refetchInterval: 10000, // Poll every 10 seconds for real-time feel
    enabled: !!user?.email
  });

  const markAsRead = useMutation({
    mutationFn: (id) => Entities.notifications.update(id, { is_read: 1 }),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float p-4 flex items-center gap-3 mb-6 border border-slate-100 dark:border-slate-800">
      <div className="relative flex-1 max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input
          placeholder="Search bookings, destinations..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-border dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 dark:text-white"
        />
      </div>
      <div className="flex items-center gap-2 ml-auto relative">

        <button 
          className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 relative" 
          aria-label="Notifications"
          onClick={() => setShowNotifs(!showNotifs)}
        >
          <Bell size={18} />
          {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />}
        </button>

        {showNotifs && (
          <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 border border-border dark:border-slate-800 shadow-float-lg rounded-2xl overflow-hidden z-50">
            <div className="p-3 border-b border-border dark:border-slate-800 flex justify-between items-center">
              <span className="font-bold text-sm text-deep-space dark:text-white">Notifications</span>
              <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{unreadCount} new</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No notifications yet.</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={cn("p-3 border-b border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer", !n.is_read && "bg-primary/5 dark:bg-primary/10")}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-semibold text-sm text-deep-space dark:text-white leading-tight mb-1">{n.title}</div>
                      {!n.is_read && (
                        <button onClick={(e) => { e.stopPropagation(); markAsRead.mutate(n.id); }} className="text-primary hover:text-primary/80 shrink-0" title="Mark as read">
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-1">{n.message}</div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        <a href="mailto:support@flyeasytourism.com" className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hidden sm:flex" aria-label="Messages">
          <Mail size={18} />
        </a>
        <div className="flex items-center gap-2 pl-2 border-l border-border dark:border-slate-800">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user?.name || "User"} className="w-10 h-10 rounded-full object-cover border-2 border-primary/20" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hidden sm:block">
            <div className="text-sm font-semibold text-deep-space dark:text-white leading-tight">{user?.name || "Traveller"}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{user?.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

