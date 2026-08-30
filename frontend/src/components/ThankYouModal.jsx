import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { SiteContent } from "@/lib/api";

export default function ThankYouModal({ 
  open, 
  onOpenChange, 
  title = "Thank You!", 
  message = "Your request has been successfully submitted.", 
  subMessage = "We will get back to you as soon as possible.",
  booking = null
}) {
  const [whatsapp, setWhatsapp] = useState('');
  const [paying, setPaying] = useState(false);

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
          <DialogTitle className="text-3xl font-extrabold text-deep-space dark:text-white text-center mb-2">{title}</DialogTitle>
        </DialogHeader>
        <div className="text-slate-600 dark:text-slate-400 mb-6 space-y-2 text-base text-center">
          <p>{message}</p>
          <p>{subMessage}</p>
        </div>

        {booking && (
          <div className="mt-2 mb-6">
            <p className="text-sm text-slate-500 mb-3 font-medium">Or confirm your booking instantly via Automated Gateway:</p>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Total Amount</span>
                <span className="text-xl font-bold text-primary">৳{Number(booking.total_price).toLocaleString()}</span>
              </div>
              <img src="/images/payment_gateways.jpg" alt="Payment Gateways" className="w-full h-auto rounded-xl mb-4 border border-slate-200 dark:border-slate-700 mix-blend-multiply dark:mix-blend-normal object-cover" style={{maxHeight: '60px'}} />
              <button 
                onClick={async () => {
                  try {
                    setPaying(true);
                    const { api } = await import('@/lib/api');
                    // In a real flow this hits /payment/init with existing booking ID or items
                    // To keep it simple and reusing TripPanel logic:
                    const res = await api.post("/payment/init", { 
                      items: [{ title: booking.package_title, type: booking.item_type, price: booking.total_price }], 
                      customer: { name: booking.customer_name, email: booking.customer_email, phone: booking.customer_phone }, 
                      totalAmount: booking.total_price,
                      bookingId: booking.id
                    });
                    if (res.url) window.location.href = res.url;
                  } catch (e) {
                    setPaying(false);
                  }
                }}
                disabled={paying}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              >
                {paying ? "Redirecting to Secure Gateway..." : "Pay Online Now"}
              </button>
            </div>
          </div>
        )}

        
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
