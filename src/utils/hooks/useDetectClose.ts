'use client';
import { usePathname } from 'next/navigation';
import { RefObject, useEffect, useState } from 'react';

export const useDetectClose = (elem: RefObject<HTMLDivElement>, initialState: boolean) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    const onClick: (e: MouseEvent) => void = (e: MouseEvent) => {
      if (elem.current !== null && !elem.current.contains(e.target as Node)) {
        setIsOpen(!isOpen);
      }
    };

    if (isOpen && !pathname.startsWith('/recruit')) {
      window.addEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isOpen, elem]);
  return [isOpen, setIsOpen] as const;
};
