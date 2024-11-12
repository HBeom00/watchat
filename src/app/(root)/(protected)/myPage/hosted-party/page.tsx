'use client';

import { useOwnerParty } from '@/store/useOwnerParties';
import { useFetchUserData } from '@/store/userStore';
import Image from 'next/image';
import React, { useState } from 'react';
import '@/customCSS/label.css';
import doesntExist from '../../../../../../public/openEyeCat.svg';
import { getViewStatus } from '@/utils/viewStatus';
import MyVerticalCard from '@/components/mypage/MyVerticalCard';
import PageSelect from '@/components/home/PageSelect';

export type platform = {
  logoUrl: string;
  name: string;
};

const MyOwnerParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 페이지네이션 설정
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSlice = 10;
  const start = (pageNumber - 1) * pageSlice;
  const end = start + pageSlice;

  // 주최중인 파티 가져오기
  const { data: ownerParty, isPending: pendingOwnerParty, isError: errorOwnerParty } = useOwnerParty(userId as string);

  // 페이지 수 불러오기
  const pageCount = ownerParty ? Math.ceil(ownerParty.length / pageSlice) : 1;

  // 플랫폼
  const platformArr: platform[] =
    ownerParty && ownerParty[0]?.video_platform ? JSON.parse(ownerParty[0].video_platform) : [];

  const platform = platformArr.length !== 1 || platformArr[0].logoUrl === '알수없음' ? null : platformArr[0];

  console.log(platform);

  if (isPending || pendingOwnerParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorOwnerParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className="max-w-[1060px] m-auto mb-8">
      <h3 className="title-m  mt-8 mb-4">내가 오너인 파티</h3>
      <ul className="flex flex-row gap-5 flex-wrap">
        {ownerParty && ownerParty.length > 0 ? (
          ownerParty.slice(start, end).map((party) => {
            // 길이가 8자 이상이면 잘라서 말줄임표 추가
            const cutPartyName =
              party.party_name.length > 13 ? party.party_name.slice(0, 13) + '...' : party.party_name;

            // 각 파티의 video_platform을 가져옴
            const platformArr: platform[] = party.video_platform ? JSON.parse(party.video_platform) : [];

            const viewStatus = getViewStatus;

            return (
              <li key={party.party_id} className=" min-w-[196px] group">
                <MyVerticalCard
                  party={party}
                  platform={platformArr}
                  cutPartyName={cutPartyName}
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

      {/* 페이지네이션 */}
      <PageSelect pageData={pageCount} pageNumber={pageNumber} setPageNumber={setPageNumber} />
    </article>
  );
};

export default MyOwnerParty;
