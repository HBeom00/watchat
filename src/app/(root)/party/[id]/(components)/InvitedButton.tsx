'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { defaultImage } from '@/constants/image';
import { useFollowData } from '@/utils/myPage/useFollowData';
import { inviteHandler } from '@/utils/invite';

const InvitedButton = ({
  partyNumber,
  userId,
  situation
}: {
  partyNumber: string;
  userId: string;
  situation: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [inviteeId, setInviteeId] = useState<string>('');
  const [display, setDisplay] = useState<boolean>(true);
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

  useEffect(() => {
    if (!(followerDataResult && followerDataResult.followerCount > 0)) {
      setMessage('아직 팔로우한 사람이 없습니다');
    }
    if (message !== '') {
      setDisplay(false);
    }
    if (situation === '모집마감') {
      setMessage('모집이 마감된 파티입니다.');
    }
    if (!open) {
      setMessage('');
      setDisplay(true);
      setInviteeId('');
    }
  }, [message, situation, open, followerDataResult]);

  if (pending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  const { followerData } = followerDataResult || { followerCount: 0, followerData: [] };
  return (
    <>
      <div ref={containerRef} className="relative">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="flex w-[94px] py-[6px] px-3 justify-center items-center rounded-lg border-solid border-Grey-300 border-[1px] text-Grey-400 body-xs-bold">
            초대하기
          </DialogTrigger>
          <DialogPortal container={containerRef.current}>
            <DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
            <DialogPrimitive.Content
              className={`fixed left-[50%] top-[50%] w-[340px] z-50 rounded-[8px] translate-x-[-50%] translate-y-[-50%] bg-static-white transform
               ${
                 display &&
                 'mobile:top-[inherit] mobile:bottom-0 mobile:w-full mobile:rounded-b-none mobile:translate-y-[0%]'
               }`}
            >
              {/* 헤더 */}
              <DialogHeader
                className={`flex flex-row w-full justify-between items-center self-stretch text-static-black text-center body-m-bold
                ${display ? 'p-[24px_16px_16px_16px]' : 'p-[16px_16px_8px_16px]'}
                mobile:py-[24px] mobile:px-[16px]`}
              >
                <div className="w-[24px] h-[24px]"></div>
                <DialogTitle className={display ? '' : 'hidden'}>초대하기</DialogTitle>
                <DialogPrimitive.Close>
                  <span className="sr-only">Close</span>
                  <Image src={'/modal/modal_close.svg'} width={24} height={24} alt="닫기" />
                </DialogPrimitive.Close>
              </DialogHeader>
              {/* 내용 */}
              {display ? (
                <ul className="flex flex-col justify-center items-center">
                  {followerData && followerData.length > 0 ? (
                    <div className="flex flex-col w-full">
                      <div className="flex flex-col py-4 w-full max-h-[317px] items-center gap-[9px] overflow-y-auto custom-scrollbar">
                        {followerData.map((follower) => (
                          <li key={follower.user_id} className="w-full">
                            <label className="flex flex-row w-full px-4 justify-between items-center self-stretch">
                              <div className="flex flex-row items-center gap-2 flex-1">
                                <Image
                                  src={follower.profile_img || defaultImage}
                                  alt={`${follower.nickname} 님의 프로필 사진`}
                                  width={40}
                                  height={40}
                                  style={{
                                    objectFit: 'cover',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%'
                                  }}
                                />
                                <span>{follower.nickname}</span>
                              </div>
                              <input
                                type="radio"
                                name="invitee"
                                value={follower.user_id}
                                onClick={() => setInviteeId(follower.user_id)}
                              />
                            </label>
                          </li>
                        ))}
                      </div>
                      <div className="p-4 w-full">
                        <button
                          className={inviteeId === '' ? 'disabled-btn-l w-full' : 'btn-l w-full'}
                          disabled={inviteeId === ''}
                          onClick={() => inviteHandler(partyNumber, inviteeId, setMessage)}
                        >
                          초대하기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </ul>
              ) : (
                <div className={display ? 'hidden' : 'flex w-full flex-col'}>
                  <div className="flex flex-col w-full pb-[16px] gap-2 justify-center self-stretch items-center body-m text-Grey-900 border-solid border-Grey-200 border-b-[1px]">
                    {message === '이미 초대장을 보낸 멤버입니다.' ? (
                      <Image src={'/inviteCat.svg'} width={73} height={64} alt={message} />
                    ) : message === '이미 참여중인 멤버입니다.' ? (
                      <Image src={'/smileCat.svg'} width={73} height={64} alt={message} />
                    ) : message === '초대하기를 완료했습니다' ? (
                      <></>
                    ) : (
                      <Image src={'/cryingCat.svg'} width={73} height={64} alt={message} />
                    )}
                    <p className={message === '초대하기를 완료했습니다' ? 'py-[16px]' : ''}>{message}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="outline-btn-l flex py-[12px] px-[20px] justify-center items-center gap-[4px] self-stretch rounded-[8px] border-none text-primary-400 body-m-bold"
                  >
                    확인
                  </button>
                </div>
              )}
              <DialogDescription></DialogDescription>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      </div>
    </>
  );
};

export default InvitedButton;
