import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Trash2, Check, X, Loader2, Video, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/components/ui/use-toast";

export default function MediaManagerModal({ open, onOpenChange, onSelect }) {
  const { toast } = useToast();
  const token = localStorage.getItem('flyeasy_token');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Bulk Selection
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  const fetchImages = async (currentPage = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload?page=${currentPage}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setImages(data.data);
          setTotalPages(data.totalPages);
          setPage(data.page);
        } else {
          setImages(data); // Fallback for old API
          setTotalPages(1);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchImages(page);
    }
  }, [open, page]);

  useEffect(() => {
    if (!open) {
      // Reset state when closed
      setIsSelectMode(false);
      setSelectedFiles([]);
      setPage(1);
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
        toast({ title: 'Media uploaded successfully' });
        fetchImages(1); // Go to page 1 to see the new upload
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

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFiles.length} item(s)?`)) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/bulk-delete`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filenames: selectedFiles })
      });
      if (res.ok) {
        toast({ title: 'Media deleted successfully' });
        setSelectedFiles([]);
        setIsSelectMode(false);
        fetchImages(page);
      } else {
        toast({ title: 'Failed to delete', variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setDeleting(false);
    }
  };

  const isVideo = (filename) => {
    return filename && (filename.endsWith('.mp4') || filename.endsWith('.webm'));
  };

  const handleItemClick = (img) => {
    if (isSelectMode) {
      if (selectedFiles.includes(img.filename)) {
        setSelectedFiles(selectedFiles.filter(f => f !== img.filename));
      } else {
        setSelectedFiles([...selectedFiles, img.filename]);
      }
    } else {
      const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
      onSelect(baseUrl + img.url);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-slate-50 dark:bg-slate-900 border-none rounded-3xl">
        <DialogHeader className="p-6 pb-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shrink-0 flex flex-row items-center justify-between">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-deep-space dark:text-white">
            <ImageIcon className="text-primary" /> Media Manager
          </DialogTitle>
          <div className="flex gap-2 items-center mr-8">
            {isSelectMode ? (
              <>
                <button 
                  onClick={() => setIsSelectMode(false)}
                  className="px-3 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBulkDelete}
                  disabled={selectedFiles.length === 0 || deleting}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Delete ({selectedFiles.length})
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsSelectMode(true)}
                className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-deep-space dark:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <CheckSquare size={16} /> Select Multiple
              </button>
            )}
          </div>
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
            onClick={() => !isSelectMode && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleUpload(e.target.files[0]);
              }} 
              accept="image/*,video/*" 
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
                <p className="text-slate-500 text-xs">Supports Images (JPG, PNG, WEBP) & Videos (MP4, WEBM). Max 20MB</p>
              </div>
            )}
          </div>

          {/* Gallery */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Uploads</h3>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-20 text-slate-400">
                <Loader2 size={30} className="animate-spin" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-16 text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                No media files found.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {images.map(img => {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL.replace('/api', '');
                    const isSelected = selectedFiles.includes(img.filename);
                    const isVid = isVideo(img.filename);

                    return (
                      <div 
                        key={img.id} 
                        onClick={() => handleItemClick(img)}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-primary shadow-md' 
                            : 'border-transparent bg-slate-100 dark:bg-slate-800 hover:border-primary/50 hover:shadow-lg'
                        }`}
                      >
                        {isVid ? (
                          <video 
                            src={baseUrl + img.url} 
                            className="w-full h-full object-cover" 
                            muted playsInline 
                          />
                        ) : (
                          <img 
                            src={baseUrl + img.url} 
                            alt={img.filename} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                          />
                        )}
                        
                        {/* Type Icon overlay */}
                        {isVid && (
                          <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-lg">
                            <Video size={14} />
                          </div>
                        )}

                        {/* Selection check */}
                        {isSelectMode && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-primary border-primary text-white' : 'border-white/50 bg-white/20'}`}>
                              {isSelected && <Check size={16} />}
                            </div>
                          </div>
                        )}
                        
                        {!isSelectMode && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                            <span className="bg-primary text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                              Select
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-deep-space dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm font-medium text-slate-500">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-deep-space dark:text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
