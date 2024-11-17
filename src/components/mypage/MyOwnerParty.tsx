'use client';

import { useOwnerParty } from '@/utils/myPage/useOwnerParties';
import { useFetchUserData, useFetchUserId } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import doesntExist from '../../../public/openEyeCat.svg';
import { getViewStatus } from '@/utils/viewStatus';
import MyVerticalCard from './MyVerticalCard';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { usePathname, useSearchParams } from 'next/navigation';
import { platform } from '@/types/partyInfo';

const MyOwnerParty = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const userParam = params.get('user');

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

  const { data: userData, isPending, isError } = useFetchUserData();

  const fetchedUserId = useFetchUserId();

  const userId = pathname === '/my-page' ? userData?.user_id || '' : fetchedUserId || '';

  const viewMoreHref = pathname === '/my-page' ? '/my-page/hosted-party' : `/profile/hosted-party?user=${userParam}`;

  // 주최중인 파티 가져오기
  const { data: ownerParty, isPending: pandingOwnerParty, isError: errorOwnerParty } = useOwnerParty(userId as string);

  if (isPending || pandingOwnerParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorOwnerParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article
      className={`m-auto mb-8 w-[1060px]
      mobile:w-full `}
    >
      <div className="flex justify-between mb-4 mobile:px-[20px] ">
        <h3 className="title-m">{pathname === '/my-page' ? '주최한 파티' : `${userParam}님이 주최한 파티`}</h3>
        {ownerParty && ownerParty.length > (isMobile ? 2 : 5) ? (
          <Link href={viewMoreHref} className="body-s text-[#c2c2c2]">
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
        {ownerParty && ownerParty.length > 0 ? (
          ownerParty.slice(0, window.innerWidth <= 480 ? 2 : 5).map((party: MyPagePartyInfo) => {
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
              alt="주최한 파티가 없습니다"
              className="mobile:w-[58px] mobile:h-[51px]"
            />
            <p className="body-m text-Grey-600">주최한 파티가 없습니다.</p>
          </li>
        )}
      </ul>
    </article>
  );
};

export default MyOwnerParty;
