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
import '@/customCSS/label.css';
import edit from '../../../public/edit.svg';
import { platformArr } from '@/utils/prefer';

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
    <section className="bg-[#f5f5f5] py-8">
      <div className="max-w-[1060px] m-auto flex gap-4 items-center">
        <Image
          src={
            userData?.profile_img ||
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
          }
          alt="프로필 이미지"
          width={100}
          height={100}
          style={{
            objectFit: 'cover',
            width: '100px',
            height: '100px',
            borderRadius: '50%'
          }}
        />
        <article>
          <div className="flex gap-2">
            <h3 className="body-l-bold">{userData?.nickname}</h3>
            <Link href={'/myPage/edit'}>
              <Image src={edit} width={20} height={20} alt="프로필 편집" />
            </Link>
          </div>
          <div className="flex flex-row gap-8">
            <Dialog>
              <DialogTrigger>
                <p className="flex flex-row items-center gap-2 body-xs">
                  팔로잉 <span className="text-primary-400">{followerCount}</span>
                </p>
              </DialogTrigger>
              <DialogContent className="w-[340px] pl-5 pr-2">
                <DialogHeader>
                  <DialogTitle>팔로우</DialogTitle>
                </DialogHeader>
                <div>
                  <p className="pb-2 label-s text-Grey-600">팔로우 {followerCount}명</p>
                  <ul className="flex flex-col gap-4 h-[328px] overflow-auto custom-scrollbar">
                    {followerData && followerData.length > 0 ? (
                      followerData.map((follower: FollowingUser) => (
                        <li key={follower.user_id} className="flex flex-row justify-between pr-1">
                          <div className="flex flex-row items-center gap-2">
                            <Image
                              src={
                                follower.profile_img ||
                                'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
                              }
                              alt={`${follower.nickname} 님의 프로필 사진`}
                              width={50}
                              height={50}
                              style={{
                                objectFit: 'cover',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%'
                              }}
                            />
                            <span className="body-s">{follower.nickname}</span>
                          </div>
                          <button
                            onClick={() => unfollowMutation.mutate(follower.user_id)}
                            className="outline-disabled-btn-s"
                          >
                            팔로우 취소
                          </button>
                        </li>
                      ))
                    ) : (
                      <li>아직 팔로우한 사람이 없습니다.</li>
                    )}
                  </ul>
                </div>
                <DialogDescription></DialogDescription>
              </DialogContent>
            </Dialog>
            <div className="flex flex-row items-center gap-2  body-xs">
              <span>플랫폼</span>
              <ul className="flex flex-row items-center gap-2">
                {userData?.platform.map((platformName, index) => {
                  // platformArr에서 플랫폼 이미지 찾아 넣기
                  const platformImg = platformArr.find((item) => item.name === platformName);

                  return (
                    <li key={index} className="flex items-center">
                      {platformImg ? (
                        <Image
                          src={platformImg.logoUrl}
                          alt={platformImg.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                        />
                      ) : null}
                      {/* <span>{platformImg ? platformImg.name : platformName}</span> */}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-row items-center gap-2  body-xs">
              <span>장르</span>
              <ul className="flex flex-row items-center gap-2">
                {userData?.genre.map((genre, index) => (
                  <li key={index} className="label-outline">
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default MyProfile;
