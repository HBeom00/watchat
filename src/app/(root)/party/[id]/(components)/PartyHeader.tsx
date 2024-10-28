import Link from 'next/link';
import { partyInfo } from '../page';
import { isMemberExistOnServer } from '@/utils/memberCheckOnServer';
import Image from 'next/image';
import ParticipationButton from '@/components/button/ParticipationButton';
import Owner from '@/components/form/Owner';

const PartyHeader = async ({
  partyData,
  userId,
  end
}: {
  partyData: partyInfo;
  userId: string | null;
  end: boolean;
}) => {
  // 멤버일 경우
  const isMember = await isMemberExistOnServer(partyData.party_id, userId);

  return (
    <div className="flex flex-col gap-7 w-full p-10 justify-center items-center bg-slate-500">
      <div className="flex flex-col gap-9">
        <p>{partyData.video_name}</p>
        <p className="text-4xl mb-8">{partyData.party_name}</p>
        <Image src={partyData.video_image} width={100} height={100} alt={partyData.video_name} />
        {end ? (
          <button>종료됨</button>
        ) : isMember ? (
          <Link href={`/chat/${partyData.party_id}`}>채팅하기</Link>
        ) : (
          <ParticipationButton name="참가하기" party_id={partyData.party_id} />
        )}
      </div>
      {/* 오너이면 렌더링되도록 */}
      {/* partyData.owner_id===userId 일 경우 오너 */}
      <Owner partyNumber={partyData.party_id} partyOwner={partyData.owner_id} />
    </div>
  );
};

export default PartyHeader;
