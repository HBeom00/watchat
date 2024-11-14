'use client';

import { useParticipatingParty } from '@/utils/myPage/useParticipatingParty';
import { useFetchUserData, useFetchUserId } from '@/store/userStore';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import doesntExist from '../../../public/closeEyeCat.svg';
import { getViewStatus } from '@/utils/viewStatus';
import MyVerticalCard from './MyVerticalCard';
import { MyPagePartyInfo } from '@/types/myPagePartyInfo';
import { usePathname, useSearchParams } from 'next/navigation';
import { platform } from '@/types/partyInfo';

const MyParticipatingParty = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const userParam = params.get('user');

  const { data: userData, isPending, isError } = useFetchUserData();

  const fetchedUserId = useFetchUserId();

  const userId = pathname === '/my-page' ? userData?.user_id || '' : fetchedUserId || '';

  const viewMoreHref =
    pathname === '/my-page' ? '/my-page/participating-party' : `/profile/participating-party?user=${userParam}`;

  // 참여중인 파티 가져오기
  const {
    data: enjoyingParty,
    isPending: pendingEnjoyingParty,
    isError: errorEnjoyingParty
  } = useParticipatingParty(userId as string);

  if (isPending || pendingEnjoyingParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorEnjoyingParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className="m-auto mb-8 w-[1060px]">
      <div className="flex justify-between mb-4">
        <h3 className="title-m">{pathname === '/my-page' ? '참여한 파티' : `${userParam}님이 참여한 파티`}</h3>
        {enjoyingParty && enjoyingParty.length > 5 ? (
          <Link href={viewMoreHref} className="body-s text-[#c2c2c2]">
            더보기
          </Link>
        ) : (
          <></>
        )}
      </div>

      {/* 카드 리스트 */}

      <ul className="flex flex-row gap-5">
        {enjoyingParty && enjoyingParty.length > 0 ? (
          enjoyingParty.slice(0, 5).map((party: MyPagePartyInfo) => {
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
            <Image src={doesntExist} width={73} height={73} alt="참여한 파티가 없습니다" />
            <p className="body-m text-Grey-600">참여한 파티가 없습니다.</p>
          </li>
        )}
      </ul>
    </article>
  );
};

export default MyParticipatingParty;
