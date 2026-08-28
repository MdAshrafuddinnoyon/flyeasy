import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import MediaManagerModal from './MediaManagerModal';

export default function ImagePicker({ value, onChange, label = "Image URL", className = "" }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className={className}>
      <label className="text-sm font-medium text-deep-space dark:text-slate-200 mb-1.5 block">
        {label}
      </label>
      
      <div className="flex flex-col gap-3">
        {/* Preview Area */}
        {value ? (
          <div className="relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-white/90 text-deep-space text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-white"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="bg-red-500/90 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-600 shadow-sm"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="w-full max-w-xs h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors hover:bg-primary/5"
          >
            <ImageIcon size={24} className="mb-2" />
            <span className="text-sm font-medium">Select or Upload Image</span>
          </button>
        )}

        {/* Fallback Input (readonly) */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={value || ""}
            readOnly
            placeholder="No image selected"
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-border dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed focus:outline-none"
          />
        </div>
      </div>

      <MediaManagerModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSelect={(url) => onChange(url)} 
      />
    </div>
  );
}
