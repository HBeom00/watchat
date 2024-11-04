'use client';

import { useParticipatingParty } from '@/store/useParticipatingParty';
import { useFetchUserData } from '@/store/userStore';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import '@/customCSS/label.css';
import defaultAvatar from '../../../public/38d1626935054d9b34fddd879b084da5.png';

const MyParticipatingParty = () => {
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

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
    <article className="max-w-[1060px] m-auto mb-8">
      <div className="flex justify-between mb-4">
        <h3 className="title-m">참여한 파티</h3>
        <Link href={'/mypage/participating-party'} className="body-s text-[#c2c2c2]">
          더보기
        </Link>
      </div>
      <ul>
        {enjoyingParty && enjoyingParty.length > 0 ? (
          enjoyingParty.map((party) => {
            const viewingStatus = getViewStatus(party); // 시청 상태

            return (
              <Link href={`/party/${party.party_id}`} key={party.party_id}>
                <li>
                  <div>
                    <Image
                      src={
                        party?.video_image ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/noImage.jpg'
                      }
                      alt={`${party?.video_name} 영상 이미지`}
                      width={50}
                      height={50}
                    />
                    <p>{viewingStatus === '모집중' ? party.situation : viewingStatus}</p>
                    <span>{party.startString}</span>
                  </div>
                  <div>
                    {/* 정보 */}
                    <p>
                      {party.video_name}
                      {party.media_type === 'tv' && party.episode_number ? ` ${party.episode_number} 화` : ''}
                    </p>
                    <h3>{party.party_name}</h3>
                  </div>
                  <div>
                    <div>
                      <Image
                        src={party.ownerProfile.profile_img || defaultAvatar}
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
    </article>
  );
};

export default MyParticipatingParty;
