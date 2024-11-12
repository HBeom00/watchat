'use client';

import { useFetchUserData } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import '@/customCSS/label.css';
import doesntExist from '../../../public/openEyeCat.svg';
import { useRecommendParty } from '@/store/useRecommendParty';
import { getViewStatus } from '@/utils/viewStatus';
import MyVerticalCard from './MyVerticalCard';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';

export type platform = {
  logoUrl: string;
  name: string;
};

const MyRecommendParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 추천파티 가져오기
  const {
    data: recommendParty,
    isPending: pandingRecommendParty,
    isError: errorRecommendParty
  } = useRecommendParty(userId as string);

  if (isPending || pandingRecommendParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorRecommendParty) {
    console.log('추천 파티', errorRecommendParty);
    console.log('useRecommendParty에서 받은 데이터:', recommendParty);
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className="m-auto mb-8 w-[1060px]">
      <div className="flex justify-between mb-4">
        <h3 className="title-m">이런 파티는 어떠세요?</h3>
        {recommendParty && recommendParty.length > 0 ? (
          <Link href={'/myPage/recommended-party'} className="body-s text-[#c2c2c2]">
            더보기
          </Link>
        ) : (
          <></>
        )}
      </div>
      <ul className="flex flex-row gap-5">
        {recommendParty && recommendParty.length > 0 ? (
          recommendParty.slice(0, 5).map((party: MyPagePartyInfo) => {
            // 각 파티의 video_platform을 가져옴
            const platformArr: platform[] = party.video_platform ? JSON.parse(party.video_platform) : [];

            const viewStatus = getViewStatus;

            return (
              <li key={party.party_id} className=" min-w-[196px] group">
                <MyVerticalCard
                  party={party}
                  userName={party.ownerProfile.nickname}
                  platform={platformArr}
                  partyName={party.party_name}
                  getViewStatus={viewStatus}
                />
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

export default MyRecommendParty;
