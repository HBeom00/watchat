'use client';
import Link from 'next/link';
import Image from 'next/image';
import ParticipationButton from '@/components/button/ParticipationButton';
import { partyInfo } from '@/types/partyInfo';
import { useQuery } from '@tanstack/react-query';
import { isMemberExist, member } from '@/utils/memberCheck';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useMemberCount } from '@/utils/useMemberCount';
import { chatOpenClose } from '@/utils/chatOpenClose';
import { startTimeString } from '@/utils/startTimeString';
import { useState } from 'react';

const PartyHeader = ({ partyData, end }: { partyData: partyInfo; end: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: userId, isLoading: userLoading } = useQuery({
    queryKey: ['loginUser'],
    queryFn: () => getLoginUserIdOnClient()
  });

  const { data: isMember, isLoading: isMemberLoading } = useQuery({
    queryKey: ['isMember', partyData.party_id, userId],
    queryFn: async () => {
      const isMember = await isMemberExist(partyData.party_id, userId);
      return isMember;
    }
  });

  const { data: memberCount, isLoading: isMemberCounting } = useMemberCount(partyData.party_id);
  const { data: ownerInfo, isLoading } = useQuery({
    queryKey: ['partyOwnerInfo', partyData.party_id],
    queryFn: async () => {
      const response: PostgrestSingleResponse<member[]> = await browserClient
        .from('team_user_profile')
        .select('*')
        .eq('user_id', partyData.owner_id);
      return response.data;
    }
  });

  if (isLoading || userLoading || isMemberLoading || isMemberCounting) {
    return <div>Loading...</div>;
  }

  return (
    <div className="inline-flex w-full items-center pt-8 pl-8 pb-10 relative text-static-white">
      <Image
        src={`https://image.tmdb.org/t/p/original${partyData.backdrop_image}`}
        className="relative brightness-50 -z-10"
        layout="fill"
        style={{ objectFit: 'cover' }}
        alt={partyData.video_name}
      />
      <div className="flex flex-col gap-4 items-start">
        {/* 상단 */}
        <div className="flex flex-col items-start gap-2 self-stretch">
          <p className="self-stretch body-l-bold">{end ? '시청 종료' : startTimeString(partyData.start_date_time)}</p>
          <p className="self-stretch heading-l">{partyData.party_name}</p>
        </div>
        <div className="flex flex-row gap-1 self-stretch body-s">
          <p>{partyData.video_name}</p>
          {partyData.episode_number ? <p>{partyData.episode_number}화</p> : <></>}
        </div>
        {/* 중간 */}
        <div className="flex flex-row gap-1 items-center">
          <p className="label-l-bold">주최자</p>
          {ownerInfo && ownerInfo.length > 0 ? (
            <div className="flex flex-row gap-1">
              <Image
                className="rounded-full"
                src={ownerInfo[0].profile_image}
                width={16}
                height={16}
                alt={`${ownerInfo[0].nickname} 님의 프로필 사진`}
                style={{
                  objectFit: 'cover',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%'
                }}
              />
              <p className="label-l">{ownerInfo[0].nickname}</p>
            </div>
          ) : (
            <></>
          )}
          <p className="body-xs"> | </p>
          <p className="label-l-bold">참여자</p>
          <p className="label-l">{memberCount || 0}명</p>
          <p className="label-l">참여 예정 {`(${memberCount || 0}/${partyData.limited_member})명`}</p>
        </div>
        {/* 하단 */}
        <div>
          {end ? (
            <button className="disabled-btn-m w-[164px]">채팅 종료</button>
          ) : isMember ? (
            <Link
              className={chatOpenClose(partyData) === '시청중' ? 'btn-m w-[164px]' : 'disabled-btn-m w-[164px]'}
              href={`/chat/${partyData.party_id}`}
              onClick={(e) => {
                if (chatOpenClose(partyData) !== '시청중') {
                  e.preventDefault();
                }
              }}
            >
              채팅하기
            </Link>
          ) : (
            <>
              <button onClick={() => setOpen(true)} className="btn-m w-[164px]">
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
      </div>
    </div>
  );
};

export default PartyHeader;
