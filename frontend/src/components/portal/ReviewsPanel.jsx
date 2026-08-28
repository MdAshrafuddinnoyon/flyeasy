import React, { useState } from "react";
import { Star, Check, AlertCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Reviews } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export default function ReviewsPanel({ user, bookings }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const { data: reviews = [] } = useQuery({
    queryKey: ['my_reviews', user.id],
    queryFn: async () => {
      return await Reviews.getMine();
    },
  });

  const submitReview = useMutation({
    mutationFn: (newReview) => Reviews.create(newReview),
    onSuccess: () => {
      toast({ title: "Review submitted! Awaiting approval." });
      setReviewingId(null);
      setRating(5);
      setText("");
      queryClient.invalidateQueries({ queryKey: ['my_reviews'] });
    },
    onError: () => toast({ title: "Failed to submit review", variant: "destructive" })
  });

  const completedBookings = bookings.filter(b => b.status === "completed");
  
  const getReviewForBooking = (bookingId) => reviews.find(r => r.booking_id === bookingId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-deep-space dark:text-white flex items-center gap-2">
          <Star size={24} className="text-primary" /> My Reviews
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Review your completed trips and share your experience.</p>
      </div>

      <div className="space-y-4">
        {completedBookings.length === 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center border border-slate-100 dark:border-slate-800 shadow-float">
            <AlertCircle size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">You don't have any completed trips to review yet.</p>
          </div>
        )}

        {completedBookings.map((b) => {
          const existingReview = getReviewForBooking(b.id);
          const isReviewing = reviewingId === b.id;

          return (
            <div key={b.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-float flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="font-semibold text-deep-space dark:text-white text-lg">{b.package_title || b.item_type}</div>
                <div className="text-sm text-slate-500 mb-4">Completed on: {new Date(b.travel_date).toLocaleDateString()}</div>
                
                {existingReview ? (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < existingReview.rating ? "fill-current" : "text-slate-300 dark:text-slate-600"} />
                        ))}
                      </div>
                      <Badge variant={existingReview.status === 'approved' ? 'success' : existingReview.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {existingReview.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{existingReview.text}"</p>
                  </div>
                ) : isReviewing ? (
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className={`p-1 ${rating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}>
                          <Star size={20} className={rating >= star ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Write your review here..."
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-24"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => submitReview.mutate({ booking_id: b.id, item_id: b.package_id || b.id, item_type: b.item_type || 'package', rating, text })} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors" disabled={submitReview.isPending || !text}>
                        {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
                      </button>
                      <button onClick={() => setReviewingId(null)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReviewingId(b.id)} className="px-4 py-2 bg-primary/10 text-primary text-sm font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors">
                    Write a Review
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
