'use client';

import Image from 'next/image';
import React, { useState } from 'react';
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
import Link from 'next/link';

const MyInvitedParty = () => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);

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

  // 선택 모드 전환 핸들러
  const selectModeToggleHandler = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedParties([]); // 다중 선택 모드 변경 시 선택 초기화
  };

  // 개별 파티 선택 핸들러
  const partySelectionHandler = (partyId: string) => {
    setSelectedParties((prev) => (prev.includes(partyId) ? prev.filter((id) => id !== partyId) : [...prev, partyId]));
  };

  // 전체 선택 핸들러
  const selectAllHandler = () => {
    const currentVisibleParties = invitedParties?.map((party) => party.invite_id) || [];
    setSelectedParties(currentVisibleParties);
  };

  // 선택된 초대 거절 클릭 핸들러
  const refuseSelectedInvitesHandler = () => {
    selectedParties.forEach((partyId) => refuseInvite.mutate(partyId));
    setSelectedParties([]); // 거절 후 선택 초기화
    setIsSelectionMode(false); // 선택 모드 종료
  };

  if (isPending || pendingInvitedParties) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorInvitedParties) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article>
      <div>
        <h3>초대받은 파티</h3>
        <div>
          <button onClick={selectModeToggleHandler}>선택하기</button>
          <button onClick={selectAllHandler} disabled={!isSelectionMode}>
            모두 선택
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button disabled={!isSelectionMode || selectedParties.length === 0}>거절하기</button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 총 {selectedParties.length}개의 파티 초대를 거절하시겠습니까?</DialogTitle>
              </DialogHeader>
              <button onClick={refuseSelectedInvitesHandler}>거절하기</button>
              <DialogClose asChild>
                <button type="button">취소하기</button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <ul>
        {invitedParties && invitedParties.length > 0 ? (
          invitedParties.map((invite) => (
            <Link href={`/party/${invite.party_id}`} key={`${invite.invite_id}-${crypto.randomUUID}`}>
              <li>
                <div>
                  {isSelectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedParties.includes(invite.invite_id)}
                      onChange={() => partySelectionHandler(invite.invite_id)}
                      className="checkbox"
                    />
                  )}
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
            </Link>
          ))
        ) : (
          <li>현재 초대받은 파티가 없습니다.</li>
        )}
      </ul>
    </article>
  );
};

export default MyInvitedParty;
