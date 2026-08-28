import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Entities } from "@/lib/api";
import { Check, X, Star as StarIcon, Trash2, Search, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Pagination from "@/components/admin/Pagination";

export default function AdminReviews() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['package_reviews'],
    queryFn: () => Entities.package_reviews.list(),
  });

  const { data: packages = [] } = useQuery({
    queryKey: ['packages'],
    queryFn: () => Entities.packages.list(),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => Entities.package_reviews.update(id, { status }),
    onSuccess: () => {
      toast({ title: "Review status updated successfully." });
      queryClient.invalidateQueries({ queryKey: ['package_reviews'] });
    },
    onError: (error) => {
      toast({ title: "Failed to update status.", description: error.message, variant: "destructive" });
    }
  });

  const deleteReview = useMutation({
    mutationFn: (id) => Entities.package_reviews.remove(id),
    onSuccess: () => {
      toast({ title: "Review deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ['package_reviews'] });
    },
    onError: (error) => {
      toast({ title: "Failed to delete review.", description: error.message, variant: "destructive" });
    }
  });

  if (isLoading) return <div>Loading reviews...</div>;

  const getPackageName = (id) => packages.find(p => p.id === id)?.title || 'Unknown Package';

  const filtered = reviews.filter(rev => 
    !search || 
    rev.text?.toLowerCase().includes(search.toLowerCase()) || 
    rev.status?.toLowerCase().includes(search.toLowerCase()) ||
    getPackageName(rev.item_id).toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    if (reviews.length === 0) return;
    const headers = ["id", "item_type", "item_id", "package_name", "rating", "text", "status"];
    const csvContent = [
      headers.join(","),
      ...reviews.map(row => {
        const enhancedRow = { ...row, package_name: getPackageName(row.item_id) };
        return headers.map(h => `"${String(enhancedRow[h] ?? '').replace(/"/g, '""')}"`).join(",");
      })
    ].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reviews_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-deep-space dark:text-white">Package Reviews</h1>
          <p className="text-slate-500">Approve, reject, or delete client reviews for packages.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} 
            placeholder="Search reviews..." 
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border dark:border-slate-800 bg-white dark:bg-slate-900 text-deep-space dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/30" 
          />
        </div>
        <button onClick={handleExportCSV} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-200" title="Export CSV">
          <Download size={18} /> <span className="hidden sm:inline">Export CSV</span>
        </button>
      </div>

      <div className="bg-card shadow-float rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Package</th>
                <th className="px-6 py-4 font-semibold">Rating</th>
                <th className="px-6 py-4 font-semibold">Review</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {currentItems.map((rev) => (
                <tr key={rev.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-deep-space dark:text-slate-200">
                    <div className="flex flex-col">
                      <span>{rev.item_type === 'package' ? getPackageName(rev.item_id) : 'Booking Item'}</span>
                      <span className="text-xs text-slate-400 capitalize">{rev.item_type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span>{rev.rating}</span>
                      <StarIcon size={14} className="fill-current" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 max-w-xs truncate" title={rev.text}>
                    {rev.text}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={rev.status === 'approved' ? 'success' : rev.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {rev.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus.mutate({ id: rev.id, status: 'approved' })}
                          className="p-2 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus.mutate({ id: rev.id, status: 'rejected' })}
                          className="p-2 text-amber-600 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => { if(window.confirm('Are you sure you want to delete this review?')) deleteReview.mutate(rev.id) }}
                        className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {filtered.length > 0 && (
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
}
