'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '@/types/teamUserProfile';
import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import { GiQueenCrown } from 'react-icons/gi';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { follow, unfollow } from '@/store/followUnfollow';

const MemberList = ({
  members,
  isSelect,
  ownerId,
  userId,
  exitParty
}: {
  members: UserInfo[];
  isSelect: string;
  ownerId: string;
  userId: string;
  roomId: string;
  exitParty: (id: string) => void;
}) => {
  const [followStatus, setFollowStatus] = useState<{ [key: string]: boolean }>({});

  // 팔로우 상태 가져오기
  useQuery({
    queryKey: ['followStatus', userId],
    queryFn: async () => {
      const { data, error } = await browserClient.from('follow').select('follow_id').eq('user_id', userId);
      if (error) {
        console.error('팔로우 상태 가져오기 에러:', error);
        return {};
      }

      const followMap = data?.reduce((acc, follow) => {
        acc[follow.follow_id] = true;
        return acc;
      }, {} as { [key: string]: boolean });

      setFollowStatus(followMap || {}); // 상태 업데이트
      return followMap || {}; // 데이터가 없어도 빈 객체 반환
    }
  });

  // 팔로우 및 언팔로우 상태 변경
  const toggleFollow = async (id: string) => {
    const isFollowing = followStatus[id];

    if (isFollowing) {
      await unfollow(userId, id); // 언팔로우 수행
      setFollowStatus((prev) => ({
        ...prev,
        [id]: false
      }));
    } else {
      await follow(userId, id); // 팔로우 수행
      setFollowStatus((prev) => ({
        ...prev,
        [id]: true
      }));
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {members.map((el) => {
        return (
          <div key={el.profile_id} className="flex justify-between items-center">
            <div className="flex items-center">
              <Image
                src={el.profile_image}
                alt={el.profile_image}
                width={30}
                height={30}
                className="rounded-full mr-2"
              />
              <div>
                {el.user_id === ownerId ? (
                  <span className="flex justify-center items-center gap-1">
                    {el.nickname}
                    <GiQueenCrown className="text-yellow-400" />
                  </span>
                ) : (
                  el.nickname
                )}
              </div>
            </div>
            {el.user_id !== userId ? (
              isSelect === 'members' ? (
                <button onClick={() => toggleFollow(el.user_id)}>
                  {followStatus[el.user_id] ? '언팔로우' : '팔로우'}
                </button>
              ) : (
                <Dialog>
                  <DialogTrigger>내보내기</DialogTrigger>
                  <DialogContent>
                    <DialogTitle>{`${el.nickname}님을 추방하시겠습니까?`}</DialogTitle>
                    <div className="flex gap-2 justify-center items-center">
                      <button onClick={() => exitParty(el.user_id)}>내보내기</button>
                      <DialogClose>
                        <button>취소</button>
                      </DialogClose>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default MemberList;
