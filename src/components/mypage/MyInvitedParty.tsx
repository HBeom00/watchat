'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../ui/Dialog';
import { useInvitedParties } from '@/store/useInvitedParties';
import { useRefuseMutation } from '@/store/useInviteMutation';
import { useFetchUserData } from '@/store/userStore';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import { NextButton, PrevButton, usePrevNextButtons } from '@/store/useMypageCarouselButton';
import { getViewStatus } from '@/utils/viewStatus';
import '@/customCSS/label.css';
import defaultAvatar from '../../../public/38d1626935054d9b34fddd879b084da5.png';

const MyInvitedParty = () => {
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedParties, setSelectedParties] = useState<string[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const visibleSlides = 5; // 버튼 클릭시 움직이게 할 슬라이드 아이템 갯수

  const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(
    emblaApi,
    visibleSlides
  );

  // 사용자 데이터 가져오기
  const { data: userData, isPending, isError } = useFetchUserData();
  const userId = userData?.user_id;

  // 초대받은 파티 가져오기
  const {
    data: invitedParties,
    isPending: pendingInvitedParties,
    isError: errorInvitedParties
  } = useInvitedParties(userId);

  // 초대 거절하기
  const refuseInvite = useRefuseMutation(userId as string);

  console.log('초대된 파티 리스트 => ', invitedParties);

  // 선택 모드 전환 핸들러
  const selectModeToggleHandler = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedParties([]); // 다중선택 모드 변경 시 선택 초기화
  };

  // 개별 파티 선택 핸들러
  const partySelectionHandler = (partyId: string) => {
    setSelectedParties((prev) => (prev.includes(partyId) ? prev.filter((id) => id !== partyId) : [...prev, partyId]));
  };

  // 전체 선택 핸들러
  const selectAllHandler = () => {
    const currentVisibleParties = invitedParties?.map((party) => party.invite_id) || [];
    setSelectedParties(currentVisibleParties);
  };

  // 선택된 초대 거절 클릭 핸들러
  const refuseSelectedInvitesHandler = () => {
    selectedParties.forEach((partyId) => refuseInvite.mutate(partyId));
    setSelectedParties([]); // 거절 후 선택 초기화
    setIsSelectionMode(false); // 선택 모드 종료
  };

  if (isPending || pendingInvitedParties) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorInvitedParties) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  if (isPending || pendingInvitedParties) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (isError || errorInvitedParties) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  return (
    <article className="max-w-[1140px] m-auto mb-8">
      <div className="flex justify-between max-w-[1060px] m-auto mb-5">
        <h3 className="title-m">초대받은 파티</h3>
        <div className="flex gap-4 body-xs-bold">
          <button
            onClick={selectModeToggleHandler}
            className={`${isSelectionMode ? ' text-primary-400' : 'text-Grey-700'}`}
          >
            선택하기
          </button>

          {/* 선택하기 클릭시 상세페이지로 넘어가지 않도록 */}

          <button
            onClick={selectAllHandler}
            disabled={!isSelectionMode}
            className={`${isSelectionMode ? 'text-Grey-700' : 'text-Grey-300 cursor-not-allowed'}`}
          >
            모두 선택
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <button
                disabled={!isSelectionMode || selectedParties.length === 0}
                className={`${
                  isSelectionMode && selectedParties.length > 0 ? 'text-Grey-700' : 'text-Grey-300 cursor-not-allowed'
                }`}
              >
                거절하기
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>정말 총 {selectedParties.length}개의 파티 초대를 거절하시겠습니까?</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>
              <button onClick={refuseSelectedInvitesHandler}>거절하기</button>
              <DialogClose asChild>
                <button type="button">취소하기</button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 캐러셀 컨테이너 */}
      <div className="flex flex-row justify-between">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}>
          이전
        </PrevButton>
        <div ref={emblaRef} className="overflow-hidden w-full max-w-[1060px] ">
          <ul className="carousel-container flex items-center gap-5 max-w-[1060px]">
            {invitedParties && invitedParties.length > 0 ? (
              invitedParties.map((invite) => {
                const viewingStatus = getViewStatus(invite.party_info);

                return (
                  <li
                    key={invite.invite_id}
                    className="carousel-item min-w-[250px]"
                    onClick={() => isSelectionMode && partySelectionHandler(invite.invite_id)}
                  >
                    {isSelectionMode ? (
                      <div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            partySelectionHandler(invite.invite_id);
                          }}
                        >
                          <div className="relative rounded-[4px] overflow-hidden h-[148px]">
                            {isSelectionMode && (
                              <input
                                type="checkbox"
                                checked={selectedParties.includes(invite.invite_id)}
                                onChange={() => partySelectionHandler(invite.invite_id)}
                                className="absolute top-2 right-2 z-20 w-4 h-4 cursor-pointer"
                              />
                            )}
                            <Image
                              src={
                                `https://image.tmdb.org/t/p/original${invite.party_info?.backdrop_image}` ||
                                'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/noImage.jpg'
                              }
                              alt={`${invite.party_info?.video_name} 영상 이미지`}
                              layout="fill"
                              objectFit="cover"
                              className="z-0"
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-[rgba(143,143,143,0.25)] to-[rgba(143,143,143,0.00)]"
                              style={{
                                background:
                                  viewingStatus === '시청완료'
                                    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url(https://image.tmdb.org/t/p/original${invite.party_info?.backdrop_image}) lightgray 50% / cover no-repeat`
                                    : 'none'
                              }}
                            ></div>

                            {getViewStatus(invite.party_info) === '시청중' ? (
                              <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 ">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <p>{getViewStatus(invite.party_info)} </p>
                              </div>
                            ) : getViewStatus(invite.party_info) === '모집중' ? (
                              <div className="absolute top-3 left-3  text-sm bg-primary-50 py-1 px-3 rounded-[8px] text-primary-400 label-m-bold">
                                <p>{getViewStatus(invite.party_info)} </p>
                              </div>
                            ) : (
                              <div className="absolute top-3 left-3 text-white text-sm bg-[#424242] py-1 px-3 rounded-[8px] label-m-bold">
                                <p>{getViewStatus(invite.party_info)} </p>
                              </div>
                            )}

                            <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
                              <p>{invite.startString}</p>
                            </div>
                          </div>

                          {/* 하단정보 */}
                          <div>
                            <div className="my-2 border-b">
                              {invite.party_info?.media_type === 'tv' && (
                                <p className="label-l text-[#757575]">
                                  {invite.party_info.video_name} {invite.party_info.episode_number} 화
                                </p>
                              )}
                              {invite.party_info?.media_type === 'movie' && (
                                <p className="label-l text-[#757575]">{invite.party_info.video_name}</p>
                              )}
                              <p className="body-l-bold">{invite.party_info.party_name}</p>
                            </div>
                            <div className="flex">
                              <Image
                                src={invite.inviter_user?.profile_img || defaultAvatar}
                                alt={`${invite.inviter_user?.nickname}의 프로필 이미지`}
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
                                {invite.inviter_user?.nickname}
                              </p>
                              <p className="label-m">
                                <span className="text-primary-400">{invite.currentPartyPeople}</span>명 참여 (
                                {invite.currentPartyPeople}/{invite.party_info.limited_member}명)
                              </p>
                            </div>
                            <button>수락하기</button>
                            <Dialog>
                              <DialogTrigger>거절하기</DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {invite.inviter_user?.nickname}님의 초대를 정말 거절하시겠습니까?
                                  </DialogTitle>
                                </DialogHeader>
                                <button onClick={() => refuseInvite.mutate(invite.invite_id)}>거절하기</button>
                                <DialogClose asChild>
                                  <button type="button">취소하기</button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/party/${invite.party_id}`}>
                        <div onClick={(e) => e.stopPropagation()}>
                          <div className="relative rounded-[4px] overflow-hidden h-[148px]">
                            {isSelectionMode && (
                              <input
                                type="checkbox"
                                checked={selectedParties.includes(invite.invite_id)}
                                onChange={() => partySelectionHandler(invite.invite_id)}
                                className="absolute top-2 right-2 z-20 w-4 h-4 cursor-pointer"
                              />
                            )}
                            <Image
                              src={
                                `https://image.tmdb.org/t/p/original${invite.party_info?.backdrop_image}` ||
                                'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/noImage.jpg'
                              }
                              alt={`${invite.party_info?.video_name} 영상 이미지`}
                              layout="fill"
                              objectFit="cover"
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-[rgba(143,143,143,0.25)] to-[rgba(143,143,143,0.00)]"
                              style={{
                                background:
                                  viewingStatus === '시청완료'
                                    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url(https://image.tmdb.org/t/p/original${invite.party_info?.backdrop_image}) lightgray 50% / cover no-repeat`
                                    : 'none'
                              }}
                            ></div>
                            {getViewStatus(invite.party_info) === '시청중' ? (
                              <div className="absolute top-3 left-3 text-white label-m-bold bg-primary-400 py-1 px-3 rounded-[8px] flex flex-row items-center gap-1 ">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <p>{getViewStatus(invite.party_info)} </p>
                              </div>
                            ) : getViewStatus(invite.party_info) === '모집중' ? (
                              <div className="absolute top-3 left-3  text-sm bg-primary-50 py-1 px-3 rounded-[8px] text-primary-400 label-m-bold">
                                <p>{getViewStatus(invite.party_info)} </p>
                              </div>
                            ) : (
                              <div className="absolute top-3 left-3 text-white text-sm bg-[#424242] py-1 px-3 rounded-[8px] label-m-bold">
                                <p>{getViewStatus(invite.party_info)} </p>
                              </div>
                            )}
                            <div className="absolute bottom-0 text-white label-l pl-3 bg-[rgba(0,0,0,0.5)] w-full h-7 flex items-center">
                              <p>{invite.startString}</p>
                            </div>
                          </div>
                          <div>
                            <div className="my-2 border-b">
                              {invite.party_info?.media_type === 'tv' && (
                                <p className="label-l text-[#757575]">
                                  {invite.party_info.video_name} {invite.party_info.episode_number} 화
                                </p>
                              )}
                              {invite.party_info?.media_type === 'movie' && (
                                <p className="label-l text-[#757575]">{invite.party_info.video_name}</p>
                              )}
                              <p className="body-l-bold">{invite.party_info.party_name}</p>
                            </div>
                            <div className="flex">
                              <Image
                                src={invite.inviter_user?.profile_img || defaultAvatar}
                                alt={`${invite.inviter_user?.nickname}의 프로필 이미지`}
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
                                {invite.inviter_user?.nickname}
                              </p>
                              <p className="label-m">
                                <span className="text-primary-400">{invite.currentPartyPeople}</span>명 참여 (
                                {invite.currentPartyPeople}/{invite.party_info.limited_member}명)
                              </p>
                            </div>
                            <button>수락하기</button>
                            <Dialog>
                              <DialogTrigger>거절하기</DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {invite.inviter_user?.nickname}님의 초대를 정말 거절하시겠습니까?
                                  </DialogTitle>
                                </DialogHeader>
                                <button onClick={() => refuseInvite.mutate(invite.invite_id)}>거절하기</button>
                                <DialogClose asChild>
                                  <button type="button">취소하기</button>
                                </DialogClose>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </Link>
                    )}
                  </li>
                );
              })
            ) : (
              <li>현재 초대받은 파티가 없습니다.</li>
            )}
          </ul>
        </div>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}>
          다음
        </NextButton>
      </div>
    </article>
  );
};

export default MyInvitedParty;
