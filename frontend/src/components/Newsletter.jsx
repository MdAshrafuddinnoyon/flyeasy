import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Entities } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [msg, setMsg] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      await Entities.newsletter.create({ email, status: 'subscribed' });
      
      setStatus("success");
      setShowSuccessModal(true);
      setEmail("");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setStatus("error");
      const errorMsg = err.response?.data?.error || err.message;
      setMsg(errorMsg.includes("Duplicate") || errorMsg.includes("ER_DUP_ENTRY") ? "You are already subscribed!" : "An error occurred. Please try again.");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-visible">
      <div className="max-w-5xl mx-auto relative">
        
        {/* Main Card */}
        <div className="relative rounded-[2rem] bg-gradient-to-r from-[#e5f019] to-[#a4a919] shadow-2xl w-full flex items-center justify-between min-h-[350px]">
          
          {/* Content */}
          <div className="relative z-10 p-10 sm:p-12 md:p-16 md:w-3/5 w-full flex flex-col justify-center">
            <h2 className="text-4xl sm:text-5xl md:text-[3.5rem] font-semibold text-black leading-[1.1] tracking-tight mb-3">
              Subscribe Our<br />Newsletter Now!
            </h2>
            <p className="text-black/80 font-medium text-lg sm:text-xl mb-8">
              For latest updates & Promotions
            </p>
            
            <form onSubmit={handleSubmit} className="relative w-full max-w-sm mt-2">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 bg-[#dbe618]/50 sm:bg-[#d4df18] p-1 rounded-3xl sm:rounded-full border border-black/5 shadow-inner transition-all w-full">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full sm:flex-1 bg-transparent px-6 py-3 sm:py-0 outline-none text-black placeholder:text-black/50 font-medium focus:ring-0 border-none"
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full sm:w-auto bg-black text-white px-8 py-3.5 sm:py-3 rounded-full font-bold text-xs tracking-wider hover:bg-black/80 transition-colors flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : status === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    "SUBSCRIBE"
                  )}
                </button>
              </div>
              {msg && (
                <p className={`absolute -bottom-8 left-4 text-sm font-bold ${status === "success" ? "text-green-800" : "text-red-700"}`}>
                  {msg}
                </p>
              )}
            </form>
          </div>

          {/* Airplane Image / Illustration */}
          {/* Mobile: Below the text */}
          <div className="md:hidden relative w-full h-48 rounded-b-[2rem] mt-4 flex justify-end items-end">
            <img 
              src="/images/newsletter-plane-transparent.png" 
              alt="Airplane" 
              className="absolute -right-4 -bottom-4 w-[90%] object-contain"
            />
          </div>

          {/* Desktop: Breaking out of the container on top, right, bottom */}
          <div className="absolute top-1/2 right-[-5%] -translate-y-[45%] w-1/2 lg:w-[50%] h-[130%] pointer-events-none hidden md:block z-20">
            <img 
              src="/images/newsletter-plane-transparent.png" 
              alt="Airplane" 
              className="w-full h-full object-contain scale-125"
              style={{ filter: 'drop-shadow(-10px 15px 15px rgba(0,0,0,0.2))' }}
            />
          </div>

        </div>
      </div>
      
      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center flex flex-col items-center py-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} className="text-green-600" />
          </div>
          <DialogHeader className="flex flex-col items-center">
            <DialogTitle className="text-2xl font-bold">Thank You!</DialogTitle>
            <DialogDescription className="text-base text-slate-500 max-w-[250px] mx-auto mt-2">
              You have successfully subscribed to our newsletter. We'll keep you updated!
            </DialogDescription>
          </DialogHeader>
          <button 
            onClick={() => setShowSuccessModal(false)}
            className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-black/90 transition-colors"
          >
            Close
          </button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
