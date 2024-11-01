'use client';
import Link from 'next/link';
import Image from 'next/image';
import ParticipationButton from '@/components/button/ParticipationButton';
import Owner from '@/components/form/Owner';
import { partyInfo } from '@/types/partyInfo';
import { useQuery } from '@tanstack/react-query';
import { isMemberExist, member } from '@/utils/memberCheck';
import { useRouter } from 'next/navigation';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import browserClient from '@/utils/supabase/client';
import { useMemberCount } from '@/utils/useMemberCount';
import { chatOpenClose } from '@/utils/chatOpenClose';
import { startTimeString } from '@/utils/startTimeString';

const PartyHeader = ({ partyData, userId, end }: { partyData: partyInfo; userId: string | null; end: boolean }) => {
  const router = useRouter();

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

  if (isLoading || isMemberLoading || isMemberCounting) {
    return <div>Loading...</div>;
  }

  // 버튼 비활성화
  const disabled = chatOpenClose(partyData) === '시청중' ? `/chat/${partyData.party_id}` : '';

  const disabledButtonClassname = chatOpenClose(partyData) === '시청중' ? 'bg-purple-600 p-2' : 'bg-slate-400 p-2';
  return (
    <div className="flex flex-col gap-7 w-full p-10 justify-center items-center bg-slate-500">
      <div className="flex flex-col gap-9">
        <p>{startTimeString(partyData.start_date_time)}</p>
        <p className="text-4xl mb-8">{partyData.party_name}</p>
        <p>{partyData.video_name}</p>
        {partyData.episode_number ? <p>{partyData.episode_number}</p> : <></>}
        <Image src={partyData.video_image} width={100} height={100} alt={partyData.video_name} />
        <div className="flex flex-row gap-5">
          <p>주최자</p>
          {ownerInfo && ownerInfo.length > 0 ? (
            <div>
              <Image src={ownerInfo[0].profile_image} width={50} height={50} alt="오너이미지" />
              <p>{ownerInfo[0].nickname}</p>
            </div>
          ) : (
            <></>
          )}
          <p> | </p>
          <p>참여자 {memberCount || 0}명</p>
        </div>
        {end ? (
          <button>종료됨</button>
        ) : isMember ? (
          <Link className={disabledButtonClassname} href={disabled}>
            채팅하기
          </Link>
        ) : userId ? (
          <ParticipationButton party_id={partyData.party_id} openControl={false}>
            <button>참가하기</button>
          </ParticipationButton>
        ) : (
          <button
            onClick={() => {
              alert('먼저 로그인해주세요');
              router.push('/login');
            }}
          >
            참가하기
          </button>
        )}
      </div>
      {/* 오너이면 렌더링되도록 */}
      {/* partyData.owner_id===userId 일 경우 오너 */}
      <Owner partyNumber={partyData.party_id} partyOwner={partyData.owner_id} />
    </div>
  );
};

export default PartyHeader;
