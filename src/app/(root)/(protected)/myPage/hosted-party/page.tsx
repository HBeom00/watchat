'use client';

import { useOwnerParty } from '@/store/useOwnerParties';
import { useFetchUserData } from '@/store/userStore';
import { getViewStatus } from '@/utils/viewStatus';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import '@/customCSS/label.css';
import PlatformImageCard from '../../../../../components/styleComponents/PlatformImage';

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
  const pageSlice = 16;
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
            const viewingStatus = getViewStatus(party); // 시청 상태

            // 길이가 8자 이상이면 잘라서 말줄임표 추가
            const cutPartyName =
              party.party_name.length > 13 ? party.party_name.slice(0, 13) + '...' : party.party_name;

            return (
              <li key={party.party_id} className=" min-w-[196px] group">
                <Link href={`/party/${party.party_id}`}>
                  <div className="relative h-[280px] rounded-[4px] overflow-hidden">
                    <Image
                      src={
                        party?.video_image ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/avatar.png'
                      }
                      alt={`${party?.video_name} 영상 이미지`}
                      layout="fill"
                      objectFit="cover"
                      className="z-0  group-hover:scale-105 transition duration-300"
                    />
                    {viewingStatus === '시청중' ? (
                      <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 ">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <p>{viewingStatus}</p>
                      </div>
                    ) : viewingStatus === '모집중' ? (
                      <div className="absolute top-3 left-3  text-sm bg-primary-50 py-1 px-3 rounded-[8px] text-primary-400 label-m-bold">
                        <p>{viewingStatus}</p>
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 text-white text-sm bg-[#424242] py-1 px-3 rounded-[8px] label-m-bold">
                        <p>{viewingStatus}</p>
                      </div>
                    )}

                    {platformArr.length === 1 && <PlatformImageCard platform={platformArr[0]} />}
                  </div>

                  <div>{/* 재생바 */}</div>

                  <div className="my-2">
                    {/* 정보 */}
                    <p className="label-l text-[#757575]">
                      {party.video_name}
                      {party.media_type === 'tv' && party.episode_number ? `  ${party.episode_number} 화` : ''}
                    </p>
                    <h3 className="body-l-bold group-hover:text-primary-400 transition duration-300">{cutPartyName}</h3>
                  </div>
                  <div>
                    <div className="flex">
                      <Image
                        src={
                          party.ownerProfile.profile_img ||
                          'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
                        }
                        alt={`${party.ownerProfile.nickname}의 프로필`}
                        width={50}
                        height={50}
                        style={{
                          objectFit: 'cover',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%'
                        }}
                      />
                      <p className="label-m ml-[6px] after:content-['│'] after:text-[#c2c2c2]">
                        {party.ownerProfile.nickname}
                      </p>
                      <p className="label-m">
                        <span className="text-primary-400">{party.currentPartyPeople}</span>명 참여 (
                        {party.currentPartyPeople} / {party.limited_member}명)
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })
        ) : (
          <li>주최한 파티가 없습니다.</li>
        )}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex w-full mt-[31.5px] mb-[29.5px] justify-center items-center">
        <div className="flex flex-row gap-1 justify-center items-center text-static-black body-xs ">
          <button onClick={() => setPageNumber(1)} className="p-[10px]" disabled={pageNumber === 1}>
            {/* 첫 페이지로 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M10.75 0.596249L11.8038 1.65L7.20375 6.25L11.8038 10.85L10.75 11.9037L5.09625 6.25L10.75 0.596249ZM1.5 0.5L1.5 12H1.00536e-06L0 0.5L1.5 0.5Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
          <button
            onClick={() => setPageNumber((now) => (now > 1 ? now - 1 : now))}
            className="px-3 py-[10px]"
            disabled={pageNumber === 1}
          >
            {/* 이전 페이지로 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="13" viewBox="0 0 7 13" fill="none">
              <path
                d="M2.1075 6.50043L6.7075 11.1004L5.65375 12.1542L0 6.50043L5.65375 0.84668L6.7075 1.90043L2.1075 6.50043Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
          {Array.from({ length: pageCount })
            .map((arr, i) => {
              return i + 1;
            })
            .map((page) => {
              return (
                <button
                  className={
                    page === pageNumber
                      ? 'flex w-8 h-8 bg-primary-400 rounded-full justify-center items-center text-static-white text-center'
                      : 'flex w-8 h-8 justify-center items-center text-center'
                  }
                  key={page}
                  onClick={() => setPageNumber(page)}
                >
                  {page}
                </button>
              );
            })}
          <button
            onClick={() => setPageNumber((now) => (now !== pageCount ? now + 1 : now))}
            className="px-3 py-[10px]"
            disabled={pageNumber === pageCount}
          >
            {/* 다음 페이지로 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="7" height="13" viewBox="0 0 7 13" fill="none">
              <path
                d="M4.6 6.50043L0 1.90043L1.05375 0.84668L6.7075 6.50043L1.05375 12.1542L0 11.1004L4.6 6.50043Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
          <button
            onClick={() => setPageNumber(pageCount ? pageCount : 1)}
            className="p-[10px]"
            disabled={pageNumber === pageCount}
          >
            {/* 마지막 페이지로 */}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M1.05375 11.9038L0 10.85L4.6 6.25L0 1.65L1.05375 0.596249L6.7075 6.25L1.05375 11.9038ZM10.3038 12V0.5H11.8038V12H10.3038Z"
                fill="#2A2A2A"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default MyOwnerParty;
