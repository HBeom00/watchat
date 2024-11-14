'use client';

import { useOwnerParty } from '@/utils/myPage/useOwnerParties';
import { useFetchUserData, useFetchUserId } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
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
    <article className="m-auto mb-8 w-[1060px]">
      <div className="flex justify-between mb-4">
        <h3 className="title-m">{pathname === '/my-page' ? '주최한 파티' : `${userParam}님이 주최한 파티`}</h3>
        {ownerParty && ownerParty.length > 5 ? (
          <Link href={viewMoreHref} className="body-s text-[#c2c2c2]">
            더보기
          </Link>
        ) : (
          <></>
        )}
      </div>
      <ul className="flex flex-row gap-5">
        {ownerParty && ownerParty.length > 0 ? (
          ownerParty.slice(0, 5).map((party: MyPagePartyInfo) => {
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

export default MyOwnerParty;
