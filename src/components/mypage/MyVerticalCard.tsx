import Image from 'next/image';
import React from 'react';
import WatchingLabel from '../styleComponents/WatchingLabel';
import { Party } from '@/utils/viewStatus';
import PlatformImageCard from '../styleComponents/PlatformImage';
import { platform } from '@/types/partyInfo';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { usePathname, useRouter } from 'next/navigation';
import { cutUserName, cutPartyName } from '@/utils/cutNameAndPartyName';
import editReview from '../../../public/editReview.svg';

type PartyItemProps = {
  party: MyPagePartyInfo; // party 타입 정의에 맞는 타입을 지정
  platform: platform[] | null;
  partyName: string;
  getViewStatus: (party: Party) => string;
  userName: string;
};

const MyVerticalCard = ({ party, platform, partyName, getViewStatus, userName }: PartyItemProps) => {
  const pathname = usePathname();

  const router = useRouter();
  const cutUserNameValue = cutUserName(userName);
  const cutPartyNameValue = cutPartyName(partyName);
  const sevenDaysAfterEndTime = (endTime: string) => {
    const endDate = new Date(endTime);
    endDate.setDate(endDate.getDate() + 7);
    return endDate;
  };
  const currentDate = new Date();

  return (
    <div
      className="cursor-pointer"
      onClick={
        party.privacy_setting === false && pathname !== '/my-page'
          ? () => {}
          : () => router.push(`/party/${party.party_id}`)
      }
    >
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
        {platform && platform[0]?.logoUrl === '알수없음' ? (
          <></>
        ) : (
          <div className="absolute top-0 right-0">
            {platform ? <PlatformImageCard platform={platform[0]} /> : <></>}
          </div>
        )}
        {getViewStatus(party) === '시청완료' &&
        (pathname === '/my-page' ||
          pathname === '/my-page/participating-party' ||
          pathname === '/my-page/hosted-party') ? (
          sevenDaysAfterEndTime(party.end_time) < currentDate ? (
            // 시청 완료 & '/my-page' 중 하나 & 7일 지나지 않음
            <>
              <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-full flex items-center"></div>
              <div className="absolute bottom-0 text-white label-l bg-gray-500 w-full h-7 flex justify-center items-center gap-1">
                <Image src={editReview} width={16} height={16} alt="후기 작성하기" />
                <span>후기 작성일 만료</span>
              </div>
            </>
          ) : (
            // 시청 완료 & '/my-page' 중 하나 & 7일 지남
            <>
              <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-full flex items-center"></div>
              <div
                className="absolute bottom-0 text-white label-l bg-primary-400 w-full h-7 flex justify-center items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push('/recruit/firstPage');
                }}
              >
                <Image src={editReview} width={16} height={16} alt="후기 작성하기" />
                <span>후기 작성하기</span>
              </div>
            </>
          )
        ) : getViewStatus(party) === '시청완료' &&
          !(
            pathname === '/my-page' ||
            pathname === '/my-page/participating-party' ||
            pathname === '/my-page/hosted-party'
          ) ? (
          // 시청 완료 & 다른 페이지인 경우
          <>
            <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-full flex items-center"></div>
            {!party.privacy_setting && (
              // 비공개 설정인 경우 잠금 아이콘 표시
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Image src="/lock.svg" alt="비공개" width={20} height={27} />
              </div>
            )}
          </>
        ) : (
          // 시청 완료 전
          <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
            <span>{party.startString}</span>
          </div>
        )}
      </div>

      <div>{/* 재생바 */}</div>

      <div className="my-2">
        {/* 정보 */}
        <p className="label-l text-[#757575]">
          {party.video_name}
          {party.media_type === 'tv' && party.episode_number ? `  ${party.episode_number} 화` : ''}
        </p>
        <h3 className="body-l-bold ">{cutPartyNameValue}</h3>
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
          <p className="label-m ml-[6px] after:content-['│'] after:text-[#c2c2c2]">{cutUserNameValue}</p>
          <p className="label-m">
            <span className="text-primary-400">{party.currentPartyPeople}</span>명 참여 ({party.currentPartyPeople}/
            {party.limited_member})
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyVerticalCard;
