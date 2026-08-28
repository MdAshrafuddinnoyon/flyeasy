import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SiteContent } from "@/lib/api";

export default function ThankYouModal({ 
  open, 
  onOpenChange, 
  title = "Thank You!", 
  message = "Your request has been successfully submitted.", 
  subMessage = "We will get back to you as soon as possible." 
}) {
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    if (open) {
      SiteContent.get().then(data => {
        if (data && data.contact_whatsapp) {
          setWhatsapp(data.contact_whatsapp);
        }
      }).catch(() => {});
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center p-8 bg-white dark:bg-slate-900 border-0 shadow-2xl rounded-3xl">
        <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 size={40} className="animate-in zoom-in duration-500" />
        </div>
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-deep-space dark:text-white mb-2">{title}</DialogTitle>
        </DialogHeader>
        <div className="text-slate-600 dark:text-slate-400 mb-8 space-y-2 text-base">
          <p>{message}</p>
          <p>{subMessage}</p>
        </div>
        
        {whatsapp && (
          <div className="mt-2 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 mb-4">Need immediate assistance?</p>
            <a 
              href={`https://wa.me/${whatsapp.replace(/[^0-9+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-2xl transition-all shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
            
            <button 
              onClick={() => onOpenChange(false)}
              className="w-full mt-3 px-6 py-3 bg-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-medium transition-all"
            >
              Close
            </button>
          </div>
        )}
        
        {!whatsapp && (
          <button 
            onClick={() => onOpenChange(false)}
            className="w-full mt-4 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl transition-all"
          >
            Close
          </button>
        )}
      </DialogContent>
    </Dialog>
  );
}
