import React, { createContext, useContext, useState, useEffect } from 'react';

const TripContext = createContext();

export const useTrip = () => useContext(TripContext);

export const TripProvider = ({ children }) => {
  const [tripItems, setTripItems] = useState(() => {
    const saved = localStorage.getItem('flyeasy_trip');
    return saved ? JSON.parse(saved) : [];
  });

  const [isTripOpen, setIsTripOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('flyeasy_trip', JSON.stringify(tripItems));
  }, [tripItems]);

  const addToTrip = (item) => {
    setTripItems(prev => {
      const exists = prev.find(i => i.id === item.id && i.type === item.type);
      if (exists) {
        return prev;
      }
      return [...prev, { ...item, guests: 1 }];
    });
    setIsTripOpen(true);
  };

  const removeFromTrip = (id) => {
    setTripItems(prev => prev.filter(item => item.id !== id));
  };

  const updateGuests = (id, change) => {
    setTripItems(prev => prev.map(item => {
      if (item.id === id) {
        const newGuests = Math.max(1, (item.guests || 1) + change);
        return { ...item, guests: newGuests };
      }
      return item;
    }));
  };

  const clearTrip = () => {
    setTripItems([]);
  };

  const toggleTrip = () => setIsTripOpen(prev => !prev);

  return (
    <TripContext.Provider value={{
      tripItems,
      addToTrip,
      removeFromTrip,
      updateGuests,
      clearTrip,
      isTripOpen,
      setIsTripOpen,
      toggleTrip
    }}>
      {children}
    </TripContext.Provider>
  );
};
