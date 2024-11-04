'use client';
import Link from 'next/link';
import LogoutButton from '../button/LogoutButton';
import { useFetchUserData } from '@/store/userStore';
import { RefObject, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const MyProfileButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useDetectClose(ref, false);

  const { data, isLoading } = useFetchUserData();
  if (isLoading) <div>Loading...</div>;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex flex-row items-center justify-center gap-1">
        {data ? (
          <>
            <Image src={data.profile_img} width={40} height={40} alt={data.nickname} />
            <p className="text-static-black body-m-bold">{data.nickname} 님</p>
          </>
        ) : (
          <></>
        )}
        <div className="p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <mask id="mask0_831_18227" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_831_18227)">
              <path d="M12 15L7 10H17L12 15Z" fill="#A8A8A8" />
            </g>
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="absolute bg-white flex flex-col gap-4 w-full justify-center items-center">
          <Link href={'/myPage'} className="border-solid border-Grey-500 border-b-2">
            마이프로필
          </Link>

          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default MyProfileButton;

const useDetectClose = (elem: RefObject<HTMLDivElement>, initialState: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (elem.current !== null && !elem.current.contains(e.target as Node)) {
        setIsOpen(!isOpen);
      }
    };

    if (isOpen) {
      window.addEventListener('click', onClick);
    }

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isOpen, elem]);
  return [isOpen, setIsOpen] as const;
};
