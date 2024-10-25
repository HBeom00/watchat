'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import browserClient from '@/utils/supabase/client';
import { useFetchUserData } from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

const MyPage = () => {
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  type FollowingUser = {
    user_id: string;
    nickname: string;
    profile_img: string;
  };

  // 팔로잉 중인 유저 데이터를 가져옴
  const getFollowerData = async () => {
    console.log('userId => ', userId);

    if (!userId) {
      return { followerCount: 0, followerData: [] }; // userId가 없으면 빈 값 반환
    }

    // 팔로워 수를 가져옴
    const { data, error } = await browserClient.from('follow').select('follow_id').eq('user_id', userId);

    if (error) {
      console.error('팔로워 수를 가져오는데 실패했습니다 => ', error);
      return 0;
    }

    console.log(data);
    console.log(userId);
    // 팔로워수를 followerCount에 담아줌
    const followerCount = data?.length || 0;

    if (followerCount === 0) {
      return { followerCount, followerData: [] }; // 팔로워가 없으면 빈 배열 반환
    }

    // 위에서 가져온 follow_id를 가지고 사용자 정보를 가져오기
    if (followerCount > 0) {
    }
    const followIds = data?.map((f) => f.follow_id as string);

    type followingUserData =
      | {
          user_id: string;
          nickname: string;
          profile_img: string;
        }[]
      | null;

    console.log('팔로우한 사람들 id => ', followIds);
    const { data: followingUserData, error: followingUserError } = await browserClient
      .from('user')
      .select('user_id,nickname,profile_img')
      .in('user_id', followIds);

    const followingUsers: FollowingUser[] | null = followingUserData;

    if (followingUserError) {
      console.error('팔로잉 목록 정보를 가져오는데 실패했습니다 => ', followingUserError);
    }

    console.log('팔로잉 목록정보=> ', followingUsers);
    console.log('팔로우 카운트, 팔로잉 데이터 =>', { followerCount, followerData: followingUsers });

    // 팔로워 정보를 followerData에 담아줌
    return { followerCount, followerData: followingUsers };
  };

  // 팔로잉 데이터를 비동기로 가져오기
  const {
    data: followerDataResult,
    isPending: pending,
    isError: error
  } = useQuery({
    queryKey: ['followingUsers', userId],
    queryFn: getFollowerData
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
                    <button>언팔로우</button>
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
