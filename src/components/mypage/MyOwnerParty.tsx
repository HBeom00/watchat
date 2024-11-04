'use client';

import { useOwnerParty } from '@/store/useOwnerParties';
import { useFetchUserData } from '@/store/userStore';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import '@/customCSS/label.css';
import defaultAvatar from '../../../public/38d1626935054d9b34fddd879b084da5.png';

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
    <article className="max-w-[1060px] m-auto mb-8">
      <div className="flex justify-between mb-4">
        <h3 className="title-m">내가 오너인 파티</h3>
        <Link href={'/mypage/hosted-party'} className="body-s text-[#c2c2c2]">
          더보기
        </Link>
      </div>
      <ul className="flex flex-row gap-5">
        {ownerParty && ownerParty.length > 0 ? (
          ownerParty.map((party) => {
            const viewingStatus = getViewStatus(party); // 시청 상태

            return (
              <li key={party.party_id}>
                <Link href={`/party/${party.party_id}`}>
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
                    <p>
                      {viewingStatus === '시청중' ? (
                        <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 ">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <p>{getViewStatus(party)} </p>
                        </div>
                      ) : (
                        viewingStatus
                      )}
                    </p>
                    <div>
                      {getViewStatus(party) === '시청중' ? (
                        <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 ">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <p>{getViewStatus(party)} </p>
                        </div>
                      ) : getViewStatus(party) === '모집중' ? (
                        <div className="absolute top-3 left-3  text-sm bg-primary-50 py-1 px-3 rounded-[8px] text-primary-400 label-m-bold">
                          <p>{getViewStatus(party)} </p>
                        </div>
                      ) : (
                        <div className="absolute top-3 left-3 text-white text-sm bg-[#424242] py-1 px-3 rounded-[8px] label-m-bold">
                          <p>{getViewStatus(party)} </p>
                        </div>
                      )}
                    </div>
                    <span>{party.startString}</span>
                  </div>
                  <div>
                    {/* 정보 */}
                    <p>
                      {party.video_name}
                      {party.media_type === 'tv' && party.episode_number ? `  ${party.episode_number} 화` : ''}
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
                </Link>
              </li>
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
