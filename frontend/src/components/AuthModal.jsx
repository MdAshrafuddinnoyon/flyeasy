import React, { useState } from "react";
import { X, Mail, Phone, Lock, User as UserIcon, Eye, EyeOff, KeyRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/components/Logo";

export default function AuthModal() {
  const { showAuthModal, setShowAuthModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Email, 2: PIN, 3: New Password
  const [resetPin, setResetPin] = useState("");
  const [newPassword, setNewPassword] = useState("");

  if (!showAuthModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(identifier, password);
      } else {
        await register(name, email, phone, regPassword);
      }
      setShowAuthModal(false);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFlow = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (resetStep === 1) {
        // Step 1: Submit email to get PIN
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setResetStep(2);
      } else if (resetStep === 2) {
        // Step 2: Validate PIN (mock validation in frontend or backend)
        if (resetPin !== "1234") {
          throw new Error("Invalid PIN. Please use 1234 for testing.");
        }
        setResetStep(3);
      } else if (resetStep === 3) {
        // Step 3: Reset password
        const res = await fetch("/api/auth/reset-password", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: identifier, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        // Success
        setIsForgot(false);
        setIsLogin(true);
        setResetStep(1);
        setPassword(newPassword);
        alert("Password reset successfully! You can now login.");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-fade-in border border-slate-200 dark:border-slate-800">
        
        <div className="shrink-0 bg-deep-space dark:bg-black p-5 sm:p-6 text-center relative border-b border-deep-space dark:border-slate-800">
          <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <Logo variant="white" className="mx-auto h-8 mb-2" />
          <p className="text-white/70 text-sm">
            {isForgot ? "Reset your password" : isLogin ? "Welcome back! Please login to your account." : "Create a new account to book your trips."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto">
          {error && <div className="mb-4 text-xs font-semibold bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg border border-red-100 dark:border-red-900/50">{error}</div>}

          {isForgot ? (
            <div className="space-y-4">
              {resetStep === 1 && (
                <>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Enter your registered email</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Mail size={16} /></span>
                      <input type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required className="input pl-9 w-full" placeholder="you@example.com" />
                    </div>
                  </div>
                  <button type="button" onClick={handleResetFlow} disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-primary transition-all">
                    {loading ? "Sending..." : "Send Reset Code"}
                  </button>
                </>
              )}
              {resetStep === 2 && (
                <>
                  <div className="mb-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    For testing purposes, please enter the PIN code: <strong>1234</strong>
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Enter 4-digit PIN</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><KeyRound size={16} /></span>
                      <input type="text" maxLength={4} value={resetPin} onChange={(e) => setResetPin(e.target.value)} required className="input pl-9 w-full tracking-[1em] font-bold text-center" placeholder="••••" />
                    </div>
                  </div>
                  <button type="button" onClick={handleResetFlow} disabled={loading || resetPin.length !== 4} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-primary transition-all">
                    Verify PIN
                  </button>
                </>
              )}
              {resetStep === 3 && (
                <>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">New Password</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Lock size={16} /></span>
                      <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="input pl-9 pr-10 w-full" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="button" onClick={handleResetFlow} disabled={loading || !newPassword} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:bg-primary transition-all">
                    Reset Password
                  </button>
                </>
              )}
              <div className="mt-4 text-center">
                <button type="button" onClick={() => { setIsForgot(false); setResetStep(1); }} className="text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white">
                  Back to Login
                </button>
              </div>
            </div>
          ) : isLogin ? (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email or Phone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Mail size={16} /></span>
                  <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required className="input pl-9 w-full" placeholder="you@example.com or 01700..." />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">Password</label>
                  <button type="button" onClick={() => setIsForgot(true)} className="text-xs font-semibold text-accent dark:text-blue-400 hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Lock size={16} /></span>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="input pl-9 pr-10 w-full" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><UserIcon size={16} /></span>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input pl-9 w-full" placeholder="John Doe" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Mail size={16} /></span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input pl-9 w-full" placeholder="you@example.com" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Phone size={16} /></span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input pl-9 w-full" placeholder="01700..." />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400"><Lock size={16} /></span>
                  <input type={showPassword ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="input pl-9 pr-10 w-full" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {!isForgot && (
            <button type="submit" disabled={loading} className="w-full bg-accent text-white font-semibold py-3 rounded-xl hover:shadow-lg hover:bg-primary transition-all disabled:opacity-70 mt-2">
              {loading ? "Please wait..." : isLogin ? "Login to Portal" : "Create Account"}
            </button>
          )}
          
          {!isForgot && (
            <>
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-200 dark:before:border-slate-700 after:mt-0.5 after:flex-1 after:border-t after:border-slate-200 dark:after:border-slate-700">
                <p className="mx-4 mb-0 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">OR</p>
              </div>

              <div className="space-y-3">
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-medium py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                  Continue with Google
                </button>
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#1864D9] text-white font-medium py-2.5 rounded-xl transition-all shadow-sm border border-[#1877F2]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Continue with Facebook
                </button>
              </div>
              
              <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-accent dark:text-white font-bold hover:underline">
                  {isLogin ? "Register now" : "Login here"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
