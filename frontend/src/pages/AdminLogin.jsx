import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, ShieldCheck } from "lucide-react";
import Logo from "@/components/Logo";
import { safeReturnTo } from "@/lib/authReturnTo";
import { SiteContent } from "@/lib/api";

export default function Login() {
const { user, login } = useAuth();
const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminSlug, setAdminSlug] = useState("admin");
  const returnTo = safeReturnTo();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate(`/${adminSlug}`);
      else navigate('/portal');
    }
    SiteContent.get().then(data => setAdminSlug(data.admin_url_slug || 'admin')).catch(() => {});
  }, [user, navigate, adminSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identifier, password);
      navigate(returnTo !== '/' ? returnTo : `/${adminSlug}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Background Image */}
      <img src="/images/hero_mountain_bg.jpg" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[#060720]/80 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 mb-5 shadow-xl border border-white/20">
            <Logo variant="dark" className="h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 mt-2 text-sm">Authorized access only</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-slate-300 text-sm font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  placeholder="admin@flyeasy.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300 text-sm font-medium">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 font-semibold bg-primary hover:bg-primary/90 text-white mt-2" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Logging in...</>
              ) : (
                <><ShieldCheck className="w-4 h-4 mr-2" /> Log In to Dashboard</>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-400 transition-colors">← Back to main site</Link>
          </div>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">FlyEasy Admin Portal · Authorized access only</p>
      </div>
    </div>
  );
}
