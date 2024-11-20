'use client';

import { useFetchUserData } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import doesntExist from '../../../public/recommendCat.svg';
import { useRecommendParty } from '@/utils/myPage/useRecommendParty';
import { getViewStatus } from '@/utils/viewStatus';
import MyVerticalCard from './MyVerticalCard';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { platform } from '@/types/partyInfo';
import ComponentLoading from './ComponentLoading';

const MyRecommendParty = () => {
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기에 따라 더보기 버튼 표시
  useEffect(() => {
    // 화면 크기 변화에 따른 모바일 여부 체크
    const resizeHandler = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    // 화면 크기 체크
    resizeHandler();

    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', resizeHandler);

    // 이벤트 리스너를 제거하여 이벤트 리스너가 리사이즈될 때마다 계속해서 생겨나지 않도록 처리
    return () => window.removeEventListener('resize', resizeHandler);
  }, []);

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
    return (
      <div className="w-[1060px] mx-auto flex flex-col m-full mb-4 h-[400px] mobile:px-[20px]  mobile:h-[350px] mobile:w-full">
        <div>
          <h3 className="title-m">이런 파티는 어떠세요?</h3>
        </div>
        <li className="py-20 flex flex-col justify-center items-center m-auto gap-2">
          <ComponentLoading />
          <p className="body-m text-Grey-600 mt-[20px]">데이터를 불러오는 중 입니다.</p>
        </li>
      </div>
    );
  }
  if (isError || errorRecommendParty) {
    console.error('추천 파티', errorRecommendParty);
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article
      className={`
        m-auto mb-8 w-[1060px]
        mobile:w-full
        `}
    >
      <div className="flex justify-between mb-4 mobile:px-[20px]">
        <h3 className="title-m">이런 파티는 어떠세요?</h3>
        {recommendParty && recommendParty.length > (isMobile ? 2 : 5) ? (
          <Link href={'/my-page/recommended-party'} className="body-s text-[#c2c2c2]">
            더보기
          </Link>
        ) : (
          <></>
        )}
      </div>
      <ul
        className={`flex flex-row gap-5
         mobile:flex-wrap mobile:gap-[10px] mobile:px-[20px]`}
      >
        {recommendParty && recommendParty.length > 5 ? (
          recommendParty.slice(0, window.innerWidth <= 480 ? 2 : 5).map((party: MyPagePartyInfo) => {
            // 각 파티의 video_platform을 가져옴
            const platformArr: platform[] = party.video_platform ? JSON.parse(party.video_platform) : [];

            const viewStatus = getViewStatus;

            return (
              <li
                key={party.party_id}
                className={`min-w-[196px] group
                mobile:min-w-0 mobile:w-[calc(50%-5px)] mobile:flex-shrink-0
                  `}
              >
                <MyVerticalCard
                  party={party}
                  userName={party.ownerProfile.nickname}
                  platform={platformArr}
                  partyName={party.party_name}
                  getViewStatus={viewStatus}
                  videoName={party.video_name}
                />
              </li>
            );
          })
        ) : (
          <li className="py-20 flex flex-col justify-center items-center m-auto gap-2">
            <Image
              src={doesntExist}
              width={73}
              height={73}
              alt="프로필에서 구독한 플랫폼과 관심 장르를 설정해주세요"
              className="mobile:w-[58px] mobile:h-[51px]"
            />
            <p className="body-m text-Grey-600 text-center">
              프로필에서 구독한 플랫폼과
              <br />
              관심 장르를 설정해주세요
            </p>
          </li>
        )}
      </ul>
    </article>
  );
};

export default MyRecommendParty;
