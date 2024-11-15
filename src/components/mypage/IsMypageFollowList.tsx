import { FollowingUser } from '@/types/followingUser';
import { unfollow } from '@/utils/myPage/followUnfollow';
import browserClient from '@/utils/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback } from 'react';

type IsMypageFollowListProps = {
  userId: string | undefined;
  followerList: FollowingUser[] | null | undefined;
};

const IsMypageFollowList: React.FC<IsMypageFollowListProps> = ({ userId, followerList }) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  // 팔로우 목록을 클릭하면 해당 유저의 프로필로 이동할 수 있게 쿼리스트링을 추가
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
    <ul className="flex flex-col gap-4 h-[328px] overflow-auto custom-scrollbar">
      {followerList && followerList.length > 0 ? (
        followerList.map((follower: FollowingUser) => (
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
  );
};

export default IsMypageFollowList;
