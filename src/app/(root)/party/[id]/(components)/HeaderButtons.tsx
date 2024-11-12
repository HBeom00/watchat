import ParticipationButton from '@/components/button/ParticipationButton';
import { partyInfo } from '@/types/partyInfo';
import { chatOpenClose } from '@/utils/chatOpenClose';
import { isMemberExist } from '@/utils/memberCheck';
import { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';

const HeaderButtons = ({ end, partyData }: { end: boolean; partyData: partyInfo }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: userId, isLoading: userLoading } = useQuery({
    queryKey: ['loginUser'],
    queryFn: () => getLoginUserIdOnClient()
  });

  const { data: isMember, isLoading: isMemberLoading } = useQuery({
    queryKey: ['isMember', partyData.party_id, userId],
    queryFn: async () => {
      const userId = await getLoginUserIdOnClient();
      const isMember = await isMemberExist(partyData.party_id, userId);
      return isMember;
    }
  });
  if (userLoading || isMemberLoading) <div>Loading......</div>;
  return (
    <div className="flex w-[164px] justify-center items-center text-center">
      {end ? (
        <button className="disabled-btn-m w-full" disabled={true}>
          채팅 종료
        </button>
      ) : (
        <>
          <Link
            className={
              isMember
                ? chatOpenClose(partyData) === '시청중'
                  ? 'flex btn-m w-full justify-center items-center'
                  : 'flex disabled-btn-m w-full justify-center items-center'
                : 'hidden'
            }
            href={`/chat/${partyData.party_id}`}
            onClick={(e) => {
              if (chatOpenClose(partyData) !== '시청중') {
                e.preventDefault();
                alert('시청시간 10분 전부터 입장하실 수 있습니다.');
              }
            }}
          >
            채팅하기
          </Link>
          <button onClick={() => setOpen(true)} className={isMember ? 'hidden' : 'btn-m w-full'}>
            참여하기
          </button>
          <ParticipationButton
            party_id={partyData.party_id}
            party_situation={partyData.situation}
            openControl={open}
            setOpenControl={setOpen}
            isLogin={!!userId}
          />
        </>
      )}
    </div>
  );
};

export default HeaderButtons;
