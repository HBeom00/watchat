'use client';
import Link from 'next/link';
import LogoutButton from '../button/LogoutButton';
import { useFetchUserData } from '@/store/userStore';
import { useRef } from 'react';
import Image from 'next/image';
import { useDetectClose } from '@/utils/hooks/useDetectClose';

const MyProfileButton = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useDetectClose(ref, false);

  const { data, isLoading } = useFetchUserData();
  if (isLoading) <div>Loading...</div>;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="flex flex-row items-center justify-center">
        {data ? (
          <div className="flex flex-row gap-3 items-center justify-center">
            <Image
              src={data.profile_img}
              width={40}
              height={40}
              style={{
                objectFit: 'cover',
                width: '40px',
                height: '40px',
                borderRadius: '50%'
              }}
              alt={data.nickname}
            />
            <p className="text-static-black body-m-bold">{data.nickname} 님</p>
          </div>
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
        <div className="selectDropBox right-0">
          <Link href={'/myPage'} className="selectDropBoxIn" onClick={() => setIsOpen(false)}>
            마이프로필
          </Link>

          <LogoutButton setIsOpen={setIsOpen} />
        </div>
      )}
    </div>
  );
};

export default MyProfileButton;
