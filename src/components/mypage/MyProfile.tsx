'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import Image from 'next/image';
import Link from 'next/link';
import { useFetchUserData } from '@/store/userStore';
import { useFollowData } from '@/store/useFollowData';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unfollow } from '@/store/followUnfollow';
import browserClient from '@/utils/supabase/client';

const MyProfile = () => {
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
  const unfollowMutation = useMutation({
    mutationFn: async (followId: string) => {
      // 언팔로우 호출
      await unfollow(userId as string, followId);

      // 언팔로우한 유저를 ban_recommend 테이블에 추가
      const { error } = await browserClient.from('ban_recommend').insert([
        {
          id: crypto.randomUUID(),
          user_id: userId,
          banned_user: followId
        }
      ]);

      if (error) {
        console.error('ban_recommend 테이블에 추가 실패 =>', error.message);
        throw new Error('언팔로우 후 차단 추가 실패'); // 에러 발생 시 상위 catch로 전파
      }
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ['followingUsers', userId] });
        queryClient.invalidateQueries({ queryKey: ['recommendedUser', userId] });
      }
    }
  });

  const { followerCount, followerData } = followerDataResult || { followerCount: 0, followerData: [] };

  if (isPending || pending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
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
      <article>
        <div>
          <h3>닉네임: {userData?.nickname}</h3>
          <Link href={'/mypage/edit'}>프로필 편집</Link>
        </div>
        <div>
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
                      <button onClick={() => unfollowMutation.mutate(follower.user_id)}>언팔로우</button>
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
            <span>플랫폼</span>
            <span>{userData?.platform}</span>
          </div>
          <div>
            <span>장르</span>
            <ul>
              {userData?.genre.map((genre, index) => (
                <li key={index}>{genre}</li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
};

export default MyProfile;
