'use client';
import { type searchStore, createSearchStateStore } from '@/store/searchStore';
import { createContext, type ReactNode, useContext, useRef } from 'react';
import { useStore } from 'zustand';

export type searchStoreAPI = ReturnType<typeof createSearchStateStore>;

export const SearchContext = createContext<searchStoreAPI | undefined>(undefined);

export type searchProviderProps = { children: ReactNode };

export const SearchProvider = ({ children }: searchProviderProps) => {
  const storeRef = useRef<searchStoreAPI>();
  if (!storeRef.current) {
    storeRef.current = createSearchStateStore();
  }
  return <SearchContext.Provider value={storeRef.current}> {children} </SearchContext.Provider>;
};

export const useSearchContext = <T,>(selector: (store: searchStore) => T): T => {
  const storeContext = useContext(SearchContext);
  if (!storeContext) throw new Error('Missing CartContext.Provider in the tree');
  return useStore(storeContext, selector);
};
