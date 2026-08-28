import React, { useState } from 'react';
import { Plane, Database, CheckCircle2, Server, Key, User, Loader2 } from 'lucide-react';

export default function InstallationWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    dbHost: 'localhost',
    dbName: 'flyeasy',
    dbUser: '',
    dbPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstall = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
      const res = await fetch(`${apiUrl}/install`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Installation failed');
      }

      setSuccess(true);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reloadApp = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Plane className="w-8 h-8 text-white -rotate-45" />
          </div>
          <h1 className="text-3xl font-bold mb-2">FlyEasy Installation</h1>
          <p className="text-primary-foreground/80">Set up your tourism platform in minutes</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary/10' : 'border-slate-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Welcome</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200 mx-4"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary/10' : 'border-slate-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">Database</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200 mx-4"></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-primary bg-primary/10' : 'border-slate-300'}`}>
                3
              </div>
              <span className="ml-2 font-medium">Finish</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
              <span className="font-bold">Error:</span> {error}
            </div>
          )}

          {step === 1 && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold mb-4">Welcome to FlyEasy!</h2>
              <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                Before getting started, we need some information on the database. You will need to know your database name, username, password, and host before proceeding.
              </p>
              <button 
                onClick={() => setStep(2)}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                Let's go!
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleInstall} className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Database Host</label>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" name="dbHost" value={formData.dbHost} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Database Name</label>
                  <div className="relative">
                    <Database className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" name="dbName" value={formData.dbName} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Database Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="text" name="dbUser" value={formData.dbUser} onChange={handleChange} required
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Database Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input 
                      type="password" name="dbPassword" value={formData.dbPassword} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-800 font-medium">
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium flex items-center"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Installing...</>
                  ) : (
                    'Run Installation'
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center animate-in fade-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Installation Successful!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                FlyEasy has been installed. Your database and all the demo data have been imported. The installer files have been secured.
              </p>
              <button 
                onClick={reloadApp}
                className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                Go to Website
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
