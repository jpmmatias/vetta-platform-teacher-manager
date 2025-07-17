"use client"	
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  userType: 'teacher' | 'manager';
  setUserType: (type: 'teacher' | 'manager') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<'teacher' | 'manager'>('teacher');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppContext.Provider value={{
      userType,
      setUserType,
      sidebarOpen,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
} 