'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFetchUserData } from '@/store/userStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { useFollowData } from '@/store/useFollowData';
import { unfollow } from '@/store/unfollow';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const MyPage = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  type FollowingUser = {
    user_id: string;
    nickname: string;
    profile_img: string;
  };

  // 팔로잉 데이터 가져오기
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

  const queryClient = useQueryClient();

  // 언팔로우 하기
  const mutation = useMutation({
    mutationFn: (followId: string) => unfollow(userId as string, followId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followingUsers', userId] });
    }
  });

  if (isPending || pending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  const { followerCount, followerData } = followerDataResult || { followerCount: 0, followerData: [] };
  console.log(followerDataResult);
  console.log(followerCount);
  console.log('팔로워 데이터 => ', followerData);
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
        <h3>닉네임: {userData?.nickname}</h3>

        <Dialog>
          <DialogTrigger>팔로잉 {followerCount}명</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>팔로우한 사람</DialogTitle>
            </DialogHeader>
            <ul>
              {followerData && followerData.length > 0 ? (
                followerData.map((follower: FollowingUser) => (
                  <li key={follower.user_id}>
                    <div>
                      <Image
                        src={
                          follower.profile_img ||
                          'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
                        }
                        alt={`${follower.nickname} 님의 프로필 사진`}
                        width={50}
                        height={50}
                      />
                      <span>{follower.nickname}</span>
                    </div>
                    <button onClick={() => mutation.mutate(follower.user_id)}>언팔로우</button>
                  </li>
                ))
              ) : (
                <li>아직 팔로우한 사람이 없습니다.</li>
              )}
            </ul>
            <DialogDescription></DialogDescription>
          </DialogContent>
        </Dialog>
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
