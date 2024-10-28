import Link from 'next/link';
import { partyInfo } from '../page';
import { getLoginUserIdOnServer } from '@/utils/supabase/server';
import { isMemberExistOnServer } from '@/utils/memberCheckOnServer';
import Image from 'next/image';

const PartyHeader = async ({ partyNumber, partyData }: { partyNumber: string; partyData: partyInfo }) => {
  const userId = await getLoginUserIdOnServer();
  const isMember = await isMemberExistOnServer(partyNumber, userId);
  return (
    <div className="flex flex-col gap-7 w-full p-10 justify-center items-center bg-slate-500">
      <div className="flex flex-col gap-9">
        <p className="text-4xl mb-8">{partyData.party_name}</p>
        <p>{partyData.party_detail}</p>
        <p>{partyData.video_name}</p>
        <Image src={partyData.video_image} width={100} height={100} alt={partyData.video_name} />
        <div className="flex flex-row gap-5">
          <p>플랫폼</p>
          {JSON.parse(partyData.video_platform).map((platform: { name: string; logoUrl: string }) => (
            <Image key={platform.name} src={platform.logoUrl} width={50} height={50} alt={platform.name} />
          ))}
        </div>
        {isMember ? (
          <></>
        ) : (
          <Link href={`/participation/${partyNumber}`} className="bg-blue-500 rounded-xl w-30 h-12 p-4">
            참여하기
          </Link>
        )}
      </div>
    </div>
  );
};

export default PartyHeader;
