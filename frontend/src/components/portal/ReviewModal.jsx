import React, { useState, useEffect } from "react";
import { Star, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function ReviewModal() {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await api.get('/api/reviews/pending');
        if (res.data && res.data.length > 0) {
          setPendingReviews(res.data);
          setOpen(true);
        }
      } catch (err) {
        console.error("Failed to fetch pending reviews", err);
      }
    };
    fetchPending();
  }, []);

  if (!open || pendingReviews.length === 0) return null;

  const currentBooking = pendingReviews[currentIndex];

  const handleSkip = () => {
    // Just move to the next one or close
    if (currentIndex < pendingReviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setRating(5);
      setText("");
    } else {
      setOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/reviews', {
        booking_id: currentBooking.booking_id,
        item_id: currentBooking.item_id,
        item_type: currentBooking.item_type,
        rating,
        text
      });
      toast({ title: "Review submitted! Thank you." });
      
      handleSkip(); // Move to next or close
    } catch (err) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md p-6 sm:p-8 overflow-hidden animate-fade-in border border-slate-200 dark:border-slate-800">
        
        <button onClick={handleSkip} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-deep-space dark:text-white mb-2">Rate Your Experience</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            You recently completed a trip with us. How was your experience with <strong>{currentBooking.item_title}</strong>?
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={`${star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 dark:fill-slate-800 text-slate-300 dark:text-slate-700"}`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Tell us more (optional)</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you love? What could be improved?"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-70"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              Submit Review
            </button>
          </div>
        </form>

        {pendingReviews.length > 1 && (
          <div className="mt-4 text-center text-xs text-slate-400">
            {currentIndex + 1} of {pendingReviews.length} pending reviews
          </div>
        )}
      </div>
    </div>
  );
}
