import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { FollowingUser } from '@/types/followingUser';
import { usePathname, useSearchParams } from 'next/navigation';
import { useOtherUserFollowData } from '@/utils/myPage/getOtherUserFollowList';
import IsMypageFollowList from './IsMypageFollowList';
import IsOtherUserFollowList from './IsOtherUserFollowList';

type FollowerProps = {
  followerCount: number;
  followerData: FollowingUser[] | null;
  userId: string | undefined;
};

export const FollowModal: React.FC<FollowerProps> = ({ followerCount, followerData, userId }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const userParam = searchParams.get('user');

  // 현재 경로가 "/my-page"인지 확인
  const isMyPage = pathname === '/my-page';

  // "/my-page"일 때만 다른 유저의 팔로우 목록을 가져오기 위한 query
  const { data: otherUserFollow } = useOtherUserFollowData(userParam);

  console.log(otherUserFollow);

  // 팔로우 목록 상태 설정: "/my-page"일 경우 다른 유저의 팔로우 목록을 사용
  const followerList = isMyPage ? followerData : otherUserFollow?.followerData ?? [];

  return (
    <Dialog>
      <DialogTrigger>
        <span className="body-xs-bold text-primary-400">{followerCount}</span>
      </DialogTrigger>
      <DialogContent className="w-[340px] pl-5 pr-2 rounded-[8px]">
        <DialogHeader>
          <DialogTitle>팔로우</DialogTitle>
        </DialogHeader>
        <div>
          <p className="pb-2 label-s text-Grey-600">팔로우 {followerCount}명</p>
          {isMyPage ? <IsMypageFollowList userId={userId} followerList={followerList} /> : <IsOtherUserFollowList />}
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
