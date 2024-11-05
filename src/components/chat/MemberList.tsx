'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '@/types/teamUserProfile';
import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { follow, unfollow } from '@/store/followUnfollow';
import award_image from '../../../public/award_star.svg';

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
    <div className="w-[340px] px-5 py-2 flex flex-col items-start gap-4">
      {members.map((el) => {
        return (
          <div key={el.profile_id} className="flex justify-between items-center self-stretch gap-2">
            <div className="flex items-center gap-2">
              <Image
                src={el.profile_image}
                alt={el.profile_image}
                width={40}
                height={40}
                className="rounded-[20px] bg-center bg-cover bg-no-repeat"
              />
              <div>
                {el.user_id === ownerId ? (
                  <div className="flex justify-center items-center gap-1 body-s text-Grey-900">
                    {el.nickname}
                    <Image src={award_image} alt="award_image" width={20} height={20} />
                  </div>
                ) : (
                  <p className="body-s text-Grey-900">{el.nickname}</p>
                )}
              </div>
            </div>
            {el.user_id !== userId ? (
              isSelect === 'members' ? (
                <button onClick={() => toggleFollow(el.user_id)} className="btn-s body-xs-bold text-white">
                  {followStatus[el.user_id] ? '언팔로우' : '팔로우'}
                </button>
              ) : (
                <Dialog>
                  <DialogTrigger className="flex justify-end items-center gap-1 body-xs-bold text-Grey-400">
                    내보내기
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>{`${el.nickname}님을 추방하시겠습니까?`}</DialogTitle>
                    <div className="flex gap-2 justify-center items-center">
                      <button className="btn-l body-m-bold" onClick={() => exitParty(el.user_id)}>
                        나가기
                      </button>
                      <DialogClose>
                        <button className="disabled-btn-l body-m-bold text-Grey-400">취소</button>
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
