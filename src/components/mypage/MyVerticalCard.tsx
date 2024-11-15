import Image from 'next/image';
import React, { useState } from 'react';
import WatchingLabel from '../styleComponents/WatchingLabel';
import { Party } from '@/utils/viewStatus';
import PlatformImageCard from '../styleComponents/PlatformImage';
import { platform } from '@/types/partyInfo';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { usePathname, useRouter } from 'next/navigation';
import { cutUserName, cutPartyName, cutVideoName } from '@/utils/cutNameAndPartyName';
import editReview from '../../../public/editReview.svg';
import PrivateModal from '../home/PrivateModal';

type PartyItemProps = {
  party: MyPagePartyInfo; // party 타입 정의에 맞는 타입을 지정
  platform: platform[] | null;
  partyName: string;
  getViewStatus: (party: Party) => string;
  userName: string;
  videoName: string;
};

const MyVerticalCard = ({ party, platform, partyName, videoName, getViewStatus, userName }: PartyItemProps) => {
  const pathname = usePathname();

  const router = useRouter();
  const cutUserNameValue = cutUserName(userName);
  const cutPartyNameValue = cutPartyName(partyName);
  const cutVideoNameValue = cutVideoName(videoName);
  const [open, setOpen] = useState<boolean>(false);
  const sevenDaysAfterEndTime = (endTime: string) => {
    const endDate = new Date(endTime);
    endDate.setDate(endDate.getDate() + 7);
    return endDate;
  };
  const currentDate = new Date();

  return (
    <div
      className="cursor-pointer max-w-[196px]"
      onClick={
        party.privacy_setting === false && pathname !== '/my-page'
          ? () => {}
          : () => router.push(`/party/${party.party_id}`)
      }
    >
      <div className="relative h-[280px] rounded-[4px] overflow-hidden " onClick={() => setOpen(true)}>
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
        {
          // 시청 완료 상태일 때
          getViewStatus(party) === '시청완료' ? (
            <>
              {/* 시청 완료 후 처리 */}
              <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-full flex items-center"></div>

              {/* 'my-page' 페이지일 때, 7일이 지난 후 */}
              {(pathname === '/my-page' ||
                pathname === '/my-page/participating-party' ||
                pathname === '/my-page/hosted-party') &&
              sevenDaysAfterEndTime(party.end_time) < currentDate ? (
                <div className="absolute bottom-0 text-white label-l bg-gray-400 w-full h-7 flex justify-center items-center gap-1">
                  <Image src={editReview} width={16} height={16} alt="후기 작성불가" />
                  <span>후기 작성하기</span>
                </div>
              ) : // 'my-page' 페이지일 때, 7일이 지나지 않았으면
              pathname === '/my-page' ||
                pathname === '/my-page/participating-party' ||
                pathname === '/my-page/hosted-party' ? (
                <div
                  className="absolute bottom-0 text-white label-l bg-primary-400 w-full h-7 flex justify-center items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/warming/${party.party_id}`);
                  }}
                >
                  <Image src={editReview} width={16} height={16} alt="후기 작성하기" />
                  <span>후기 작성하기</span>
                </div>
              ) : null}
            </>
          ) : (
            // 시청 완료가 아니고
            <>
              {/* 시청 완료 전 (모집 중) */}
              <>
                {party.privacy_setting ? (
                  // 공개인경우
                  <>
                    <div className="absolute inset-0 flex items-center justify-center z-10"></div>
                    <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
                      <span>{party.startString}</span>
                    </div>
                  </>
                ) : (
                  // 비공개인경우
                  <>
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Image src="/lock.svg" alt="비공개 아님" width={20} height={27} />
                    </div>
                    <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
                      <span>{party.startString}</span>
                    </div>
                  </>
                )}
              </>
              {/* 비공개 설정이면서 모집중일 때 */}
              {!party.privacy_setting && sevenDaysAfterEndTime(party.end_time) < currentDate && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Image src="/lock.svg" alt="비공개" width={20} height={27} />
                  </div>
                </>
              )}

              {/* 비공개 설정이고 시청 완료이거나 7일 지나지 않은 경우 */}
              {!party.privacy_setting && sevenDaysAfterEndTime(party.end_time) < currentDate && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Image src="/lock.svg" alt="비공개" width={20} height={27} />
                  </div>
                </>
              )}
            </>
          )
        }
      </div>

      <div>{/* 재생바 */}</div>

      <div className="my-2">
        {/* 정보 */}
        <p className="label-l text-[#757575]">
          {cutVideoNameValue}
          {party.media_type === 'tv' && party.episode_number
            ? ` 시즌${party.season_number} ${party.episode_number} 화`
            : ''}
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
      <PrivateModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default MyVerticalCard;
