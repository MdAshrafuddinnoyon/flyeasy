import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Check, X, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";

export default function MediaManagerModal({ open, onOpenChange, onSelect }) {
  const { toast } = useToast();
  const token = localStorage.getItem('flyeasy_token');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        toast({ title: 'Image uploaded successfully' });
        fetchImages();
      } else {
        const data = await res.json();
        toast({ title: data.error || 'Upload failed', variant: 'destructive' });
      }
    } catch (e) {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (filename, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast({ title: 'Image deleted' });
        setImages(images.filter(img => img.filename !== filename));
      } else {
        toast({ title: 'Failed to delete', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network error', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-slate-50 dark:bg-slate-900 border-none rounded-3xl">
        <DialogHeader className="p-6 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-deep-space dark:text-white">
            <ImageIcon className="text-primary" /> Media Manager
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 hide-scrollbar">
          {/* Upload Zone */}
          <div 
            className="border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 rounded-2xl p-8 text-center transition-colors cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleUpload(e.dataTransfer.files[0]);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]);
              }} 
              accept="image/*" 
              className="hidden" 
            />
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 size={40} className="text-primary animate-spin mb-3" />
                <p className="text-primary font-medium text-sm">Uploading...</p>
              </div>
            ) : (
              <div>
                <UploadCloud className="mx-auto text-primary mb-3" size={40} />
                <p className="text-deep-space dark:text-white font-bold text-base mb-1">Click to upload or drag & drop</p>
                <p className="text-slate-500 text-xs">Supports JPG, PNG, WEBP (Max 5MB)</p>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Your Uploads</h3>
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <Loader2 size={30} className="animate-spin" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-16 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No images uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map(img => (
                  <div 
                    key={img.id} 
                    onClick={() => {
                      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
                      onSelect(baseUrl + img.url);
                      onOpenChange(false);
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                  >
                    <img src={import.meta.env.VITE_API_BASE_URL.replace('/api', '') + img.url} alt="Media" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button 
                          onClick={(e) => handleDelete(img.filename, e)}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg text-center flex items-center justify-center gap-1 shadow-lg">
                        <Check size={14} /> Select
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
