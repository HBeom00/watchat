'use client';

import { useDetectClose } from '@/utils/hooks/useDetectClose';
import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useRef } from 'react';

const MobileHamburger: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  // 메뉴 상태 관리
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useDetectClose(menuRef, false);
  const [selectedLabel, setSelectedLabel] = useState<string>('메뉴 선택');

  // 메뉴 옵션 정의
  const editProfileHandler = () => {
    setSelectedLabel('프로필 수정');
    router.push('/my-page/edit');
  };

  const { mutate: logoutBtn } = useMutation({
    mutationFn: async () => await browserClient.auth.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userId'] });
      router.push('/login');
    }
  });

  const logoutHander = () => {
    setSelectedLabel('로그아웃');
    logoutBtn();
  };

  const options = [
    { label: '프로필 수정', onClick: editProfileHandler },
    { label: '로그아웃', onClick: logoutHander }
  ];

  return (
    <div ref={menuRef} className="relative z-20">
      {/* 메뉴 버튼 */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="selectBox flex items-center justify-between w-full">
        <p>{selectedLabel}</p>
        <Image src={'/pageArrow/dropdown_arrow.svg'} width={16} height={16} alt="메뉴 열기" />
      </button>

      {/* 드롭다운 메뉴 */}
      {menuOpen && (
        <div className="selectDropBox w-full">
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
