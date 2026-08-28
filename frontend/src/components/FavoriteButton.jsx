import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

export default function FavoriteButton({ itemId, itemType, className = '' }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && itemId && itemType) {
      api.post('/favorites/check', { items: [{ item_id: itemId, item_type: itemType }] })
        .then(res => {
          if (res.data && res.data[itemId]) {
            setIsFavorite(true);
          }
        })
        .catch(console.error);
    }
  }, [user, itemId, itemType]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent triggering parent links
    e.stopPropagation();
    
    if (!user) {
      toast({ title: 'Please log in to save favorites', variant: 'destructive' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post('/favorites/toggle', { item_id: itemId, item_type: itemType });
      setIsFavorite(res.data.favorited);
      toast({ title: res.data.favorited ? 'Added to favorites' : 'Removed from favorites' });
    } catch (err) {
      toast({ title: 'Failed to update favorite', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={toggleFavorite} 
      disabled={loading}
      className={`flex items-center justify-center p-2 rounded-full transition-all ${
        isFavorite 
          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20' 
          : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-800'
      } ${className}`}
      aria-label="Toggle favorite"
    >
      <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
    </button>
  );
}
