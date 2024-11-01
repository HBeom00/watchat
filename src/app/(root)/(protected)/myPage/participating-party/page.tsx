'use client';

import { useParticipatingParty } from '@/store/useParticipatingParty';
import { useFetchUserData } from '@/store/userStore';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

const ParticipatingParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 페이지네이션 설정
  const [pageNumber, setPageNumber] = useState<number>(1);
  const pageSlice = 16;
  const start = (pageNumber - 1) * pageSlice;
  const end = start + pageSlice;

  // 참여중인 파티 가져오기
  const {
    data: enjoyingParty,
    isPending: pendingEnjoyingParty,
    isError: errorEnjoyingParty
  } = useParticipatingParty(userId as string);

  // 페이지 수 불러오기
  const pageCount = enjoyingParty ? Math.ceil(enjoyingParty.length / pageSlice) : 1;

  if (isPending || pendingEnjoyingParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorEnjoyingParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <section>
      <h3>참여한 파티</h3>
      <ul>
        {enjoyingParty && enjoyingParty.length > 0 ? (
          enjoyingParty.slice(start, end).map((party) => {
            const viewingStatus = getViewStatus(party); // 시청 상태

            return (
              <Link href={`/party/${party.party_id}`} key={party.party_id}>
                <li>
                  <div>
                    {/* 영상 이미지 */}
                    <span>
                      <span>{viewingStatus === '시청중' ? '시청중' : party.watch_date ? `모집중` : '시청 예정'}</span>
                    </span>
                  </div>
                  <div>{/* 재생바 */}</div>
                  <div>
                    {/* 정보 */}
                    <p>
                      {viewingStatus === '시청중'
                        ? '시청중'
                        : party.watch_date
                        ? `${new Date(party.watch_date).toLocaleString()} 시작`
                        : '시청 예정'}
                    </p>
                    <p>
                      {party.video_name}
                      {party.media_type === 'tv' && party.episode_number ? ` ${party.episode_number} 화` : ''}
                    </p>
                    <h3>{party.party_name}</h3>
                  </div>
                  <div>
                    <div>
                      <Image
                        src={
                          party.ownerProfile.profile_img ||
                          'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
                        }
                        alt={`${party.ownerProfile.nickname}의 프로필`}
                        width={50}
                        height={50}
                      />
                      <span>{party.ownerProfile.nickname}</span>
                    </div>
                    <span>
                      ({party.currentPartyPeople} / {party.limited_member})
                    </span>
                  </div>
                </li>
              </Link>
            );
          })
        ) : (
          <li>참가중인 파티가 없습니다.</li>
        )}
      </ul>
      <div className="flex flex-row gap-10 p-10 justify-center items-center text-xl font-bold">
        {Array.from({ length: pageCount })
          .map((arr, i) => {
            return i + 1;
          })
          .map((page) => {
            return (
              <button key={page} onClick={() => setPageNumber(page)}>
                {page}
              </button>
            );
          })}
      </div>
    </section>
  );
};

export default ParticipatingParty;