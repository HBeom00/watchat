'use client';

import { useOwnerParty } from '@/store/useOwnerParties';
import { useFetchUserData } from '@/store/userStore';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MyOwnerParty = () => {
  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 주최중인 파티 가져오기
  const { data: ownerParty, isPending: pandingOwnerParty, isError: errorOwnerParty } = useOwnerParty(userId as string);

  if (isPending || pandingOwnerParty) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorOwnerParty) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article>
      <h3>내가 오너인 파티</h3>
      <ul>
        {ownerParty && ownerParty.length > 0 ? (
          ownerParty.map((party) => {
            const viewingStatus = getViewStatus(party); // 시청 상태

            return (
              <Link href={`/party/${party.party_id}`} key={party.party_id}>
                <li>
                  <div>
                    {/* 영상 이미지 */}
                    <span>{viewingStatus === '시청중' ? '시청중' : party.watch_date ? `모집중` : '시청 예정'}</span>
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
                      {party.media_type === 'tv' && party.episode_number ? `  ${party.episode_number} 화` : ''}
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
          <li>주최한 파티가 없습니다.</li>
        )}
      </ul>
    </article>
  );
};

export default MyOwnerParty;
