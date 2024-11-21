'use client';

import { useDetectClose } from '@/utils/hooks/useDetectClose';
import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';
import menu from '../../../public/menu.svg';

const MobileHamburger: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // 메뉴 상태 관리
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useDetectClose(menuRef, false);

  // 메뉴 옵션 정의
  // 프로필 편집페이지로 이동
  const editProfileHandler = () => {
    router.push('/my-page/edit');
  };

  // 로그아웃
  const { mutate: logoutBtn } = useMutation({
    mutationFn: async () => await browserClient.auth.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userId'] });
      router.push('/login');
    }
  });
  const logoutHander = () => {
    logoutBtn();
  };

  const options = [
    { label: '프로필 수정', onClick: editProfileHandler },
    { label: '로그아웃', onClick: logoutHander }
  ];

  return (
    <div ref={menuRef} className="relative z-20">
      {/* 메뉴 버튼 */}
      <button onClick={() => setMenuOpen(!menuOpen)}>
        <Image src={menu} width={24} height={24} alt="menu" />
      </button>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div
          className={`selectDropBox w-full absolute top-4 right-0 transition-all duration-300 ease-in-out transform ${
            menuOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {options.map((option, index) => (
            <button
              key={index}
              className={index === options.length - 1 ? 'selectDropBoxLast' : 'selectDropBoxIn'}
              onClick={() => {
                option.onClick();
                setMenuOpen(false); // 메뉴 닫기
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileHamburger;
