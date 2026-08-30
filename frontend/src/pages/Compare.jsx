import React from "react";
import { useCompare } from "@/context/CompareContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Check, X, MapPin } from "lucide-react";

export default function Compare() {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50">
        <div className="text-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-primary">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-deep-space dark:text-white mb-4">Nothing to Compare</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            You haven't added any items to compare yet. Browse our packages and hotels to find options you like.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/packages" className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:-translate-y-0.5 transition-transform shadow-lg shadow-primary/30">
              Browse Packages
            </Link>
            <Link to="/hotels" className="px-6 py-3 bg-white dark:bg-slate-800 text-deep-space dark:text-white font-semibold rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Browse Hotels
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const type = compareItems[0]?.type || 'item';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 py-12 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-2 transition-colors">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 className="text-3xl lg:text-4xl font-bold text-deep-space dark:text-white">Compare {type}s</h1>
          </div>
          <button
            onClick={clearCompare}
            className="flex items-center gap-2 px-4 py-2 text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-xl transition-colors font-medium text-sm"
          >
            <Trash2 size={16} /> Clear All
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-float">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 w-48 shrink-0">
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Features</span>
                  </th>
                  {compareItems.map(item => (
                    <th key={item.id} className="p-6 border-b border-l border-slate-100 dark:border-slate-800 min-w-[300px] w-1/3">
                      <div className="relative">
                        <button 
                          onClick={() => removeFromCompare(item.id)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 dark:bg-red-500/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
                        >
                          <X size={16} />
                        </button>
                        <div className="aspect-video rounded-xl overflow-hidden mb-4 border border-slate-100 dark:border-slate-800">
                          <img src={item.image || "/images/placeholder.jpg"} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-lg font-bold text-deep-space dark:text-white line-clamp-2 mb-2">{item.title}</h3>
                        <div className="text-2xl font-bold text-primary">৳{(item.price || 0).toLocaleString()}</div>
                        {type === 'flight' ? (
                          <Link 
                            to={`/flights?origin=${item.origin || ''}&destination=${item.destination || ''}`} 
                            className="mt-4 block w-full py-2.5 text-center bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-deep-space dark:text-white font-semibold rounded-xl transition-colors"
                          >
                            Find Flights
                          </Link>
                        ) : (
                          <Link 
                            to={`/${type}s/${item.id}`} 
                            className="mt-4 block w-full py-2.5 text-center bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-deep-space dark:text-white font-semibold rounded-xl transition-colors"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </th>
                  ))}
                  {/* Fill empty columns if less than 3 */}
                  {[...Array(3 - compareItems.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="p-6 border-b border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 min-w-[300px] w-1/3">
                      <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8">
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                          <span className="text-2xl">+</span>
                        </div>
                        <span className="text-sm font-medium">Add another item</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                    Type
                  </td>
                  {compareItems.map(item => (
                    <td key={item.id} className="p-4 px-6 border-b border-l border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 capitalize">
                      {item.type}
                    </td>
                  ))}
                  {[...Array(3 - compareItems.length)].map((_, i) => <td key={`e1-${i}`} className="p-4 px-6 border-b border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></td>)}
                </tr>
                {type === 'package' && (
                  <tr>
                    <td className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      Duration
                    </td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-4 px-6 border-b border-l border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        {item.duration || 'N/A'}
                      </td>
                    ))}
                    {[...Array(3 - compareItems.length)].map((_, i) => <td key={`e2-${i}`} className="p-4 px-6 border-b border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></td>)}
                  </tr>
                )}
                {type === 'hotel' && (
                  <tr>
                    <td className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                      Rating
                    </td>
                    {compareItems.map(item => (
                      <td key={item.id} className="p-4 px-6 border-b border-l border-slate-100 dark:border-slate-800 text-amber-500 font-bold">
                        {item.rating || 'N/A'} ★
                      </td>
                    ))}
                    {[...Array(3 - compareItems.length)].map((_, i) => <td key={`e3-${i}`} className="p-4 px-6 border-b border-l border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"></td>)}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
