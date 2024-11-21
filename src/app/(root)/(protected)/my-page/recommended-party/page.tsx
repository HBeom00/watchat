'use client';

import { useFetchUserData } from '@/store/userStore';
import Image from 'next/image';
import React, { useState } from 'react';
import doesntExist from '../../../../../../public/closeEyeCat.svg';
import { useRecommendParty } from '@/utils/myPage/useRecommendParty';
import { getViewStatus } from '@/utils/viewStatus';
import MyVerticalCard from '@/components/mypage/MyVerticalCard';
import PageSelect from '@/components/home/PageSelect';
import { platform } from '@/types/partyInfo';

const RecommendedParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 페이지네이션 설정
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSlice = 10;
  const start = (pageNumber - 1) * pageSlice;
  const end = start + pageSlice;

  // 참여중인 파티 가져오기
  const {
    data: recommendParty,
    isPending: pendingRecommendParty,
    isError: errorRecommendParty
  } = useRecommendParty(userId as string);

  // 페이지 수 불러오기
  const pageCount = recommendParty ? Math.ceil(recommendParty.length / pageSlice) : 1;

  if (isPending || pendingRecommendParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorRecommendParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <section
      className={`m-auto mb-8 w-[1060px]
      mobile:w-full `}
    >
      <h3 className="title-m mt-8 mb-4">이런 파티는 어떠세요?</h3>
      <ul
        className={`flex flex-row gap-5 flex-wrap
         mobile:flex-wrap mobile:gap-x-[10px] mobile:gap-y-[16px] mobile:px-[20px]`}
      >
        {recommendParty && recommendParty.length > 0 ? (
          recommendParty.slice(start, end).map((party) => {
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
              alt="프로필에서 구독한 플랫폼과 
관심 장르를 설정해주세요. "
            />
            <p className="body-m text-Grey-600">
              프로필에서 구독한 플랫폼과
              <br />
              관심 장르를 설정해주세요.
            </p>
          </li>
        )}
      </ul>

      {/* 페이지네이션 */}
      <PageSelect pageData={pageCount} pageNumber={pageNumber} setPageNumber={setPageNumber} />
    </section>
  );
};

export default RecommendedParty;
