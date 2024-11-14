import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { FollowingUser } from '@/types/followingUser';
import Image from 'next/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unfollow } from '@/utils/myPage/followUnfollow';
import browserClient from '@/utils/supabase/client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type FollowerProps = {
  followerCount: number;
  followerData: FollowingUser[] | null;
  userId: string | undefined;
};

export const FollowModal: React.FC<FollowerProps> = ({ followerCount, followerData, userId }) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

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
  return (
    <Dialog>
      <DialogTrigger>
        <p className="flex flex-row items-center gap-2 body-xs">
          팔로잉 <span className="body-xs-bold text-primary-400">{followerCount}</span>
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
                  <Link
                    href={'/profile/?' + createQueryString('user', `${follower.nickname}`)}
                    className="flex flex-row items-center gap-2"
                  >
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
                  </Link>
                  <button onClick={() => unfollowMutation.mutate(follower.user_id)} className="outline-disabled-btn-s">
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
  );
};
