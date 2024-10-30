'use client';

import Image from 'next/image';
import React from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/Dialog';
import { useInvitedParties } from '@/store/useInvitedParties';
import { useRefuseMutation } from '@/store/useInviteMutation';
import { useFetchUserData } from '@/store/userStore';

const MyInvitedParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 초대받은 파티 가져오기
  const {
    data: invitedParties,
    isPending: pendingInvitedParties,
    isError: errorInvitedParties
  } = useInvitedParties(userId);

  // 초대 거절하기
  const refuseInvite = useRefuseMutation(userId as string);

  console.log('초대된 파티 리스트 => ', invitedParties);

  if (isPending || pendingInvitedParties) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorInvitedParties) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article>
      <h3>초대받은 파티</h3>
      <ul>
        {invitedParties && invitedParties.length > 0 ? (
          invitedParties.map((invite) => (
            <li key={`${invite.invite_id}-${crypto.randomUUID}`}>
              <div>
                <Image
                  src={invite.party_info?.video_image || '이미지가 없습니다'}
                  alt={`${invite.party_info?.video_name} 영상 이미지`}
                  width={50}
                  height={50}
                />
                <div>
                  <p>
                    <span>{invite.party_info?.watch_date.toLocaleString()}</span>
                    <span>{invite.party_info?.start_time.toLocaleString()}</span> 시작
                  </p>
                  {invite.party_info?.media_type === 'tv' && (
                    <p>
                      {invite.party_info.video_name} {invite.party_info.episode_number} 화
                    </p>
                  )}
                  {invite.party_info?.media_type === 'movie' && <p>{invite.party_info.video_name}</p>}
                  <div>
                    <Image
                      src={
                        invite.inviter_user?.profile_img ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
                      }
                      alt={`${invite.inviter_user?.nickname}의 프로필 이미지`}
                      width={50}
                      height={50}
                    />
                    <p>{invite.inviter_user?.nickname}님이 초대하셨습니다.</p>
                  </div>
                  <div>
                    <button>수락하기</button>
                    <Dialog>
                      <DialogTrigger>거절하기</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{invite.inviter_user?.nickname}님의 초대를 정말 거절하시겠습니까?</DialogTitle>
                        </DialogHeader>
                        <button onClick={() => refuseInvite.mutate(invite.invite_id)}>거절하기</button>
                        <DialogClose asChild>
                          <button type="button">취소하기</button>
                        </DialogClose>

                        <DialogDescription></DialogDescription>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>현재 초대받은 파티가 없습니다.</li>
        )}
      </ul>
    </article>
  );
};

export default MyInvitedParty;
