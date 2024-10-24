'use client';

import { useUserStore } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

const MyPage = () => {
  const { userData, fetchUserData } = useUserStore();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <>
      {/* 프로필 영역 */}
      <section>
        <Image
          src={
            userData?.profile_img ||
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
          }
          alt="프로필 이미지"
          width={150}
          height={150}
        />
        <h3>{userData?.nickname}</h3>
        <button>팔로잉 255명</button>
        <div>
          <div>
            <span>내 구독 채널</span>
            <span></span>
          </div>
          <div>
            <span>내 취향</span>
            <span></span>
          </div>
        </div>
        <div>
          <Link href={'/mypage/edit'}>프로필 편집</Link>
          <button>파티 모집하기</button>
        </div>
      </section>

      {/* 파티 및 파티원 영역  */}
      <section>
        <article>
          <h3>참여한 파티</h3>
        </article>
        <article>
          <h3>내가 오너인 파티</h3>
        </article>
        <article>
          <h3>초대받은 파티</h3>
        </article>
        <article>
          <h3>최근 함께했던 파티원</h3>
        </article>
      </section>
    </>
  );
};

export default MyPage;
