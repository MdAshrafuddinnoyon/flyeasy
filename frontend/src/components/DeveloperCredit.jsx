import { Phone, Globe, MapPin, MessageCircle } from "lucide-react";

export default function DeveloperCredit({ variant = "dark", className = "" }) {
  const isDark = variant === "dark";
  const textColor = isDark ? "text-slate-400" : "text-slate-300";
  const iconColor = isDark ? "text-slate-500" : "text-slate-400";
  const logoPath = "/images/developer-logo-light.png";

  return (
    <div className={`flex flex-col gap-3 w-full ${className}`}>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${textColor}`}>Maintained By</p>
        <a href="https://websearchbd.com" target="_blank" rel="noreferrer" className="inline-block hover:opacity-80 transition-opacity mb-2">
          <img src={logoPath} alt="Web Search BD" className="h-6 w-auto" />
        </a>
      </div>
      
      <div className={`flex flex-col gap-1.5 text-xs ${textColor}`}>
        <a href="tel:+8801581855238" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Phone size={14} className={iconColor} /> +8801581855238
        </a>
        <a href="https://wa.me/8801581855238" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#25D366] transition-colors">
          <MessageCircle size={14} className={iconColor} /> WhatsApp Support
        </a>
        <a href="https://websearchbd.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
          <Globe size={14} className={iconColor} /> websearchbd.com
        </a>

      </div>
    </div>
  );
}

