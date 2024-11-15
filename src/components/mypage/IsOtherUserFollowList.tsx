import { useFetchUserData } from '@/store/userStore';
import { FollowingUser } from '@/types/followingUser';
import { useFollowMutation, useUunfollowMutation } from '@/utils/myPage/followUnfollow';
import { useOtherUserFollowData } from '@/utils/myPage/getOtherUserFollowList';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState } from 'react';

const IsOtherUserFollowList = () => {
  const { data: userData } = useFetchUserData();
  const searchParams = useSearchParams();
  const userParam = searchParams.get('user');
  const [followedUsers, setFollowedUsers] = useState<string[]>([]); //팔로우 상태관리

  const loginUser = userData?.user_id;

  // "/my-page"일 때만 다른 유저의 팔로우 목록을 가져오기 위한 query
  const { data: otherUserFollow } = useOtherUserFollowData(userParam);

  console.log('dkkkkkkkkkkk', otherUserFollow);

  const filteredFollowerData =
    otherUserFollow &&
    otherUserFollow?.followerData?.filter((follower: FollowingUser) => follower.user_id !== loginUser);

  // 팔로우 목록을 클릭하면 해당 유저의 프로필로 이동할 수 있게 쿼리스트링을 추가
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  // 팔로우/언팔로우 훅 사용
  const { mutate: follow } = useFollowMutation(loginUser || '', loginUser as string);
  const { mutate: unfollow } = useUunfollowMutation(loginUser || '', loginUser as string);

  // 팔로우 상태 확인
  const isFollowing = (userId: string) => followedUsers.includes(userId);

  // 팔로우 상태를 토글하는 함수
  const handleFollowToggle = (follower: FollowingUser) => {
    if (isFollowing(follower.user_id)) {
      unfollow(follower.user_id); // 언팔로우
      setFollowedUsers(followedUsers.filter((id) => id !== follower.user_id));
    } else {
      follow(follower.user_id); // 팔로우
      setFollowedUsers([...followedUsers, follower.user_id]);
    }
  };

  return (
    <ul className="flex flex-col gap-4 h-[328px] overflow-auto custom-scrollbar">
      {filteredFollowerData && otherUserFollow.followerData && otherUserFollow.followerData.length > 0 ? (
        otherUserFollow.followerData.map((follower: FollowingUser) => (
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
            {follower.user_id !== loginUser && (
              <button
                className={isFollowing(follower.user_id) ? 'outline-disabled-btn-s' : 'btn-s body-xs text-white'}
                onClick={() => handleFollowToggle(follower)}
              >
                {isFollowing(follower.user_id) ? '팔로우 취소' : '팔로우'}
              </button>
            )}
          </li>
        ))
      ) : (
        <li>아직 팔로우한 사람이 없습니다.</li>
      )}
    </ul>
  );
};

export default IsOtherUserFollowList;
