import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flyeasy_compare");
      if (stored) return JSON.parse(stored);
    }
    return [];
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("flyeasy_compare", JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (item) => {
    setCompareItems(prev => {
      if (prev.length > 0 && prev[0].type !== item.type) {
        toast({ title: `You can only compare items of the same type. (Currently comparing ${prev[0].type}s)`, variant: "destructive" });
        return prev;
      }
      if (prev.some(i => i.id === item.id)) {
        toast({ title: "Item already in comparison list!" });
        return prev;
      }
      if (prev.length >= 3) {
        toast({ title: "You can compare up to 3 items at a time.", variant: "destructive" });
        return prev;
      }
      toast({ title: "Added to comparison list!" });
      return [...prev, item];
    });
  };

  const removeFromCompare = (id) => {
    setCompareItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export const useCompare = () => useContext(CompareContext);
