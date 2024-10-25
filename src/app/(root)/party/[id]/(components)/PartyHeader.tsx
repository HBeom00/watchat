import Link from 'next/link';
import PlayBar from './PlayBar';
import { partyInfo } from '../page';
import { getLoginUserIdOnServer } from '@/utils/supabase/server';
import { isMemberExistOnServer } from '@/utils/memberCheckOnServer';

const PartyHeader = async ({ partyNumber, partyData }: { partyNumber: string; partyData: partyInfo }) => {
  const userId = await getLoginUserIdOnServer();
  const isMember = await isMemberExistOnServer(partyNumber, userId);
  return (
    <div className="flex flex-col gap-7 w-full h-96 justify-center items-center bg-slate-500">
      <div className="flex flex-row gap-9">
        <p className="text-4xl mb-8">{partyData.party_name}</p>
        <p>{partyData.party_detail}</p>
        <p>{partyData.video_name}</p>
        <p>{partyData.video_platform}</p>
        {/* 데이터가 없을 경우 */}
        <p>{partyData.video_image || '이미지가 없습니다'}</p>
        {isMember ? (
          <></>
        ) : (
          <Link href={`/participation/${partyNumber}`} className="bg-blue-500 rounded-xl w-30 h-12 p-4">
            참여하기
          </Link>
        )}
      </div>
      <PlayBar />
    </div>
  );
};

export default PartyHeader;
