'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '@/types/teamUserProfile';
import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../ui/Dialog';
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
              <div className="w-10 h-10">
                <Image
                  src={el.profile_image}
                  alt={el.profile_image}
                  width={40}
                  height={40}
                  className="rounded-[20px] w-full h-full object-cover"
                />
              </div>
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
                  <DialogTrigger className="flex justify-end items-center gap-1 text-Grey-400 font-bold text-xs">
                    내보내기
                  </DialogTrigger>
                  <DialogContent className="w-[350px] p-4 bg-white rounded-lg shadow-lg">
                    <DialogTitle className="px-4 py-2"></DialogTitle>
                    <DialogDescription className="flex justify-center items-end text-lg font-semibold text-gray-900 mt-4 body-m">
                      정말 내보내시겠습니까?
                    </DialogDescription>
                    <div className="flex justify-center items-center mt-4 gap-4">
                      <button
                        className="w-[150px] py-2 px-4 bg-primary-500 text-white font-bold rounded-md hover:bg-primary-600 transition"
                        onClick={() => exitParty(el.user_id)}
                      >
                        내보내기
                      </button>
                      <DialogClose>
                        <button className="w-[150px] py-2 px-4 bg-gray-200 text-Grey-400 font-bold rounded-md hover:bg-gray-300 transition">
                          취소
                        </button>
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
