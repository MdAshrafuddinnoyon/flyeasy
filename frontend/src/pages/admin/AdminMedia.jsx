import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Copy, Check, Trash2, ExternalLink } from 'lucide-react';

export default function AdminMedia() {
  const token = localStorage.getItem('flyeasy_token');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, [token]);

  const fetchImages = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUploadedImages(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadMessage({ text: '', type: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage({ text: 'Image uploaded successfully!', type: 'success' });
        fetchImages();
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setUploadMessage({ text: data.error || 'Upload failed', type: 'error' });
      }
    } catch (err) {
      setUploadMessage({ text: 'Network error occurred', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (url, id) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const removeHistory = async (filename) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/upload/${filename}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchImages();
      } else {
        alert('Failed to delete image');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-deep-space">Media Manager</h1>
        <p className="text-slate-500 mt-1">Upload and manage images for your packages, hotels, and site content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <UploadCloud className="text-primary" /> Upload Image
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-slate-300 hover:bg-slate-50'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setFile(e.dataTransfer.files[0]);
                }
              }}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
                id="file-upload" 
              />
              <label htmlFor="file-upload" className="cursor-pointer block">
                {file ? (
                  <div>
                    <ImageIcon className="mx-auto text-primary mb-2" size={40} />
                    <p className="text-deep-space font-medium text-sm truncate px-4">{file.name}</p>
                    <p className="text-slate-500 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="mx-auto text-slate-400 mb-2" size={40} />
                    <p className="text-slate-600 font-medium text-sm">Click to browse or drag & drop</p>
                    <p className="text-slate-400 text-xs mt-1">Supports JPG, PNG, GIF (Max 5MB)</p>
                  </div>
                )}
              </label>
            </div>

            {file && (
              <button 
                onClick={handleUpload} 
                disabled={isUploading}
                className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Upload File'}
              </button>
            )}

            {uploadMessage.text && (
              <div className={`mt-4 p-3 rounded-xl text-sm font-medium text-center ${uploadMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {uploadMessage.text}
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <ImageIcon className="text-primary" /> Recent Uploads
            </h2>

            {uploadedImages.length === 0 ? (
              <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-200 rounded-2xl">
                No images uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-square">
                    <img src={img.url} alt="Uploaded" className="w-full h-full object-cover" />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-3 p-4">
                      
                      <button 
                        onClick={() => copyToClipboard(img.url, img.id)}
                        className="bg-white text-deep-space px-3 py-2 rounded-lg text-xs font-bold w-full flex items-center justify-center gap-1 hover:bg-slate-100"
                      >
                        {copiedId === img.id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />} 
                        {copiedId === img.id ? 'Copied URL!' : 'Copy URL'}
                      </button>
                      
                      <div className="flex gap-2 w-full">
                        <a href={img.url} target="_blank" rel="noreferrer" className="flex-1 bg-white/20 text-white hover:bg-white/30 p-2 rounded-lg flex items-center justify-center">
                          <ExternalLink size={16} />
                        </a>
                        <button onClick={() => removeHistory(img.id)} className="flex-1 bg-red-500/80 text-white hover:bg-red-500 p-2 rounded-lg flex items-center justify-center">
                          <Trash2 size={16} />
                        </button>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

