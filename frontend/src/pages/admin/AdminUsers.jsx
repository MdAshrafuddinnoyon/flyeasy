import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Users, UserCog, UserX, Loader2, Search, ShieldAlert, Plus, Pencil, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Pagination from "@/components/admin/Pagination";
import { Download } from "lucide-react";

const EMPTY_USER = { name: "", email: "", phone: "", role: "client", password: "" };

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [mode, setMode] = useState("create"); // create, edit, password
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/auth/users');
      return res.data;
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }) => await api.put(`/auth/users/${id}/role`, { role }),
    onSuccess: () => queryClient.invalidateQueries(['admin-users'])
  });

  const deleteUser = useMutation({
    mutationFn: async (id) => await api.delete(`/auth/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast({ title: "User deleted" });
    }
  });

  const saveUser = useMutation({
    mutationFn: async (payload) => {
      if (mode === "create") return await api.post('/auth/users', payload);
      if (mode === "edit") return await api.put(`/auth/users/${payload.id}`, payload);
      if (mode === "password") return await api.put(`/auth/users/${payload.id}/password`, { password: payload.password });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-users']);
      toast({ title: `User ${mode === 'create' ? 'created' : mode === 'edit' ? 'updated' : 'password reset'} successfully` });
      setOpen(false);
    },
    onError: (err) => {
      toast({ title: "Error saving user", description: err.response?.data?.error || err.message, variant: "destructive" });
    }
  });

  const openCreate = () => { setMode("create"); setEditing({ ...EMPTY_USER }); setOpen(true); };
  const openEdit = (user) => { setMode("edit"); setEditing({ ...user }); setOpen(true); };
  const openPassword = (user) => { setMode("password"); setEditing({ id: user.id, name: user.name, password: "" }); setOpen(true); };

  const handleSave = () => {
    if (mode === "create" && (!editing.name || !editing.password || (!editing.email && !editing.phone))) {
      return toast({ title: "Please fill required fields", variant: "destructive" });
    }
    if (mode === "password" && !editing.password) {
      return toast({ title: "Please enter new password", variant: "destructive" });
    }
    saveUser.mutate(editing);
  };

  const filtered = users.filter(u => 
    (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || "").includes(search)
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    if (users.length === 0) return;
    const headers = ["id", "name", "email", "phone", "role", "created_at"];
    const csvContent = [
      headers.join(","),
      ...users.map(row => headers.map(h => `"${String(row[h] ?? '').replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
            <Users className="text-primary" /> User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage clients and administrators</p>
        </div>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90">
          <Plus size={18} className="mr-2" /> Add User
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-float overflow-hidden border border-slate-100 dark:border-slate-800 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder="Search users by name, email or phone..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-deep-space dark:text-white transition-all"
            />
          </div>
          <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
            <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            <Loader2 className="animate-spin inline mr-2" /> Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-l-xl">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {currentItems.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-deep-space dark:text-white">{user.name}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                      <div>{user.email || 'No email'}</div>
                      <div className="text-xs">{user.phone || 'No phone'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {user.role === 'admin' ? <ShieldAlert size={14} /> : <Users size={14} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right space-x-1.5">
                      <button 
                        onClick={() => openPassword(user)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40 transition-colors"
                        title="Reset Password"
                      >
                        <Key size={14} />
                      </button>
                      <button 
                        onClick={() => openEdit(user)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                        title="Edit Info"
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Change ${user.name}'s role to ${user.role === 'admin' ? 'client' : 'admin'}?`)) {
                            updateRole.mutate({ id: user.id, role: user.role === 'admin' ? 'client' : 'admin' });
                          }
                        }}
                        disabled={updateRole.isPending}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 transition-colors"
                        title="Change Role"
                      >
                        <UserCog size={14} />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
                            deleteUser.mutate(user.id);
                          }
                        }}
                        disabled={deleteUser.isPending}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
                        title="Delete User"
                      >
                        <UserX size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && filtered.length > 0 && (
          <div className="mt-8">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create New User' : mode === 'edit' ? 'Edit User Details' : 'Reset User Password'}
            </DialogTitle>
          </DialogHeader>
          
          {editing && (
            <div className="space-y-4 pt-2">
              {(mode === 'create' || mode === 'edit') && (
                <>
                  <div>
                    <label className="text-sm font-medium text-deep-space mb-1.5 block">Full Name *</label>
                    <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={inputCls} placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-deep-space mb-1.5 block">Email</label>
                      <input type="email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className={inputCls} placeholder="Email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-deep-space mb-1.5 block">Phone</label>
                      <input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className={inputCls} placeholder="Phone number" />
                    </div>
                  </div>
                </>
              )}

              {mode === 'create' && (
                <div>
                  <label className="text-sm font-medium text-deep-space mb-1.5 block">Role</label>
                  <select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className={inputCls}>
                    <option value="client">Client</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              {(mode === 'create' || mode === 'password') && (
                <div>
                  <label className="text-sm font-medium text-deep-space mb-1.5 block">
                    {mode === 'password' ? `New Password for ${editing.name}` : 'Password *'}
                  </label>
                  <input type="password" value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} className={inputCls} placeholder="Enter password" />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSave} disabled={saveUser.isPending} className="bg-primary hover:bg-primary/90 flex-1">
                  {saveUser.isPending ? <><Loader2 size={16} className="animate-spin mr-2" /> Saving...</> : "Save"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
