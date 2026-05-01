import React, { createContext, useContext, useState } from "react";

type BookingContextType = {
  isOpen: boolean;
  openBooking: (roomType?: string) => void;
  closeBooking: () => void;
  selectedRoom: string | null;
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const openBooking = (roomType?: string) => {
    if (roomType) setSelectedRoom(roomType);
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false);
    setSelectedRoom(null);
  };

  return (
    <BookingContext.Provider value={{ isOpen, openBooking, closeBooking, selectedRoom }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};
