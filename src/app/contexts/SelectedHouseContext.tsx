// contexts/SelectedHouseContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface House {
  house_id: string;
  house_name: string;
  house_image: string;
  description?: string;
}

interface SelectedHouseContextProps {
  selectedHouse: House | null;
  setSelectedHouse: (house: House) => void;
}

const SelectedHouseContext = createContext<SelectedHouseContextProps | undefined>(undefined);

export const useSelectedHouse = (): SelectedHouseContextProps => {
  const context = useContext(SelectedHouseContext);
  if (!context) {
    throw new Error('useSelectedHouse must be used within a SelectedHouseProvider');
  }
  return context;
};

interface SelectedHouseProviderProps {
  children: ReactNode;
}

export const SelectedHouseProvider = ({ children }: SelectedHouseProviderProps) => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);

  return (
    <SelectedHouseContext.Provider value={{ selectedHouse, setSelectedHouse }}>
      {children}
    </SelectedHouseContext.Provider>
  );
};
