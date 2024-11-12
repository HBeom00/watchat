import Image from 'next/image';
import React from 'react';
import WatchingLabel from '../styleComponents/WatchingLabel';
import { Party } from '@/utils/viewStatus';
import PlatformImageCard from '../styleComponents/PlatformImage';
import { platform } from '@/types/partyInfo';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { platformArr } from '@/utils/prefer';
import { useRouter } from 'next/navigation';

type PartyItemProps = {
  party: MyPagePartyInfo; // party 타입 정의에 맞는 타입을 지정
  platform: platform[] | null;
  cutPartyName: string;
  getViewStatus: (party: Party) => string;
};

const MyVerticalCard = ({ party, platform, cutPartyName, getViewStatus }: PartyItemProps) => {
  const router = useRouter();

  return (
    <div className="cursor-pointer" onClick={() => router.push(`/party/${party.party_id}`)}>
      <div className="relative h-[280px] rounded-[4px] overflow-hidden">
        <Image
          src={
            party?.video_image ||
            'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
          }
          alt={`${party?.video_name} 영상 이미지`}
          fill
          className="z-0  group-hover:scale-105 transition duration-300"
        />

        {/* 파티 상태 정보 */}
        <WatchingLabel partyData={party} />

        {/* 플랫폼 정보 */}
        <div className="absolute top-0 right-0">
          {platform ? <PlatformImageCard platform={platformArr[0]} /> : <></>}
        </div>

        {getViewStatus(party) === '시청완료' ? (
          <>
            <div className="absolute  bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-full flex items-center"></div>
            <div
              className="absolute bottom-0 text-white label-l bg-primary-400 w-full h-7 flex justify-center items-center"
              onClick={(e) => {
                e.stopPropagation();
                router.push('/recruit/firstPage');
              }}
            >
              <span>후기 작성하기</span>
            </div>
          </> // 시청완료 : 배경 어둡게 + 후기작성 활성화 (후기작성 페이지 링크 수정해야함)
        ) : getViewStatus(party) === '시청중' ? (
          <></> // 시청중일 때는 아무것도 X
        ) : (
          <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
            <span>{party.startString}</span>
          </div> // 나머지 : 시작시간 표시
        )}
      </div>

      <div>{/* 재생바 */}</div>

      <div className="my-2">
        {/* 정보 */}
        <p className="label-l text-[#757575]">
          {party.video_name}
          {party.media_type === 'tv' && party.episode_number ? `  ${party.episode_number} 화` : ''}
        </p>
        <h3 className="body-l-bold ">{cutPartyName}</h3>
      </div>
      <div>
        <div className="flex">
          <Image
            src={
              party.ownerProfile.profile_image ||
              'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
            }
            alt={`${party.ownerProfile.nickname}의 프로필`}
            width={50}
            height={50}
            style={{
              objectFit: 'cover',
              width: '16px',
              height: '16px',
              borderRadius: '50%'
            }}
          />
          <p className="label-m ml-[6px] after:content-['│'] after:text-[#c2c2c2]">{party.ownerProfile.nickname}</p>
          <p className="label-m">
            <span className="text-primary-400">{party.currentPartyPeople}</span>명 참여 ({party.currentPartyPeople} /{' '}
            {party.limited_member}명)
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyVerticalCard;
