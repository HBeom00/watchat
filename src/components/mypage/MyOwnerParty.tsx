'use client';

import { useOwnerParty } from '@/store/useOwnerParties';
import { useFetchUserData } from '@/store/userStore';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import '@/customCSS/label.css';
import PlatformImageCard from '../styleComponents/PlatformImage';
import doesntExist from '../../../public/openEyeCat.svg';

export type platform = {
  logoUrl: string;
  name: string;
};

const MyOwnerParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 주최중인 파티 가져오기
  const { data: ownerParty, isPending: pandingOwnerParty, isError: errorOwnerParty } = useOwnerParty(userId as string);

  // 플랫폼
  const platformArr: platform[] =
    ownerParty && ownerParty[0]?.video_platform ? JSON.parse(ownerParty[0].video_platform) : [];

  const platform = platformArr.length !== 1 || platformArr[0].logoUrl === '알수없음' ? null : platformArr[0];

  console.log(platform);

  if (isPending || pandingOwnerParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorOwnerParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className="m-auto mb-8 w-[1060px]">
      <div className="flex justify-between mb-4">
        <h3 className="title-m">내가 오너인 파티</h3>
        {ownerParty && ownerParty.length > 0 ? (
          <Link href={'/myPage/hosted-party'} className="body-s text-[#c2c2c2]">
            더보기
          </Link>
        ) : (
          <></>
        )}
      </div>
      <ul className="flex flex-row gap-5">
        {ownerParty && ownerParty.length > 0 ? (
          ownerParty.slice(0, 5).map((party) => {
            const viewingStatus = getViewStatus(party); // 시청 상태
            return (
              <li key={party.party_id} className=" min-w-[196px]">
                <Link href={`/party/${party.party_id}`}>
                  <div className="relative h-[280px] rounded-[4px] overflow-hidden">
                    <Image
                      src={
                        party?.video_image ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/noImage.jpg'
                      }
                      alt={`${party?.video_name} 영상 이미지`}
                      layout="fill"
                      objectFit="cover"
                      className="z-0"
                    />

                    {viewingStatus === '시청중' ? (
                      <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 ">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <p>{viewingStatus}</p>
                      </div>
                    ) : viewingStatus === '모집중' ? (
                      <div className="absolute top-3 left-3  text-sm bg-primary-50 py-1 px-3 rounded-[8px] text-primary-400 label-m-bold">
                        <p>{viewingStatus}</p>
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 text-white text-sm bg-[#424242] py-1 px-3 rounded-[8px] label-m-bold">
                        <p>{viewingStatus}</p>
                      </div>
                    )}

                    <div className="absolute top-0 right-0">
                      {platform ? <PlatformImageCard platform={platform} /> : <></>}
                    </div>

                    <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
                      <span>{party.startString}</span>
                    </div>
                  </div>
                  <div className="my-2">
                    {/* 정보 */}
                    <p className="label-l text-[#757575]">
                      {party.video_name}
                      {party.media_type === 'tv' && party.episode_number ? `  ${party.episode_number} 화` : ''}
                    </p>
                    <h3 className="body-l-bold">{party.party_name}</h3>
                  </div>
                  <div>
                    <div className="flex">
                      <Image
                        src={
                          party.ownerProfile.profile_img ||
                          'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
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
                      <p className="label-m ml-[6px] after:content-['│'] after:text-[#c2c2c2]">
                        {party.ownerProfile.nickname}
                      </p>
                      <p className="label-m">
                        <span className="text-primary-400">{party.currentPartyPeople}</span>명 참여 (
                        {party.currentPartyPeople} / {party.limited_member}명)
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <li className="py-20 flex flex-col justify-center items-center m-auto gap-2">
            <Image src={doesntExist} width={73} height={73} alt="주최한 파티가 없습니다" />
            <p className="body-m text-Grey-600">주최한 파티가 없습니다.</p>
          </li>
        )}
      </ul>
    </article>
  );
};

export default MyOwnerParty;
