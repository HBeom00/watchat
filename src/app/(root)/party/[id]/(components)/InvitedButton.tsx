'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { inviteHandler } from '@/utils/invite';
import { useFollowData } from '@/store/useFollowData';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const InvitedButton = ({
  partyNumber,
  userId,
  situation
}: {
  partyNumber: string;
  userId: string;
  situation: string;
}) => {
  const [message, setMessage] = useState<string>('');
  const [inviteeId, setInviteeId] = useState<string>('');
  const [display, setDisplay] = useState<boolean>(true);
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

  useEffect(() => {
    if (message !== '') {
      setDisplay(false);
    }
    if (situation === '모집마감') {
      setMessage('모집이 마감된 파티입니다.');
    }
  }, [message, situation]);

  if (pending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  const { followerData } = followerDataResult || { followerCount: 0, followerData: [] };
  return (
    <>
      <Dialog>
        <DialogTrigger className="flex w-[94px] py-[6px] px-3 justify-center items-center rounded-lg border-solid border-Grey-300 border-[1px] text-Grey-400 body-xs-bold">
          초대하기
        </DialogTrigger>
        <DialogContent className="w-[340px] p-0 gap-0">
          <DialogHeader className="flex py-6">
            <DialogTitle className={display ? '' : 'hidden'}>초대하기</DialogTitle>
          </DialogHeader>
          {message === '' ? (
            <ul className="flex flex-col justify-center items-center">
              {followerData && followerData.length > 0 ? (
                <div className="flex flex-col w-full">
                  <div className="flex flex-col py-4 w-full max-h-[317px] items-center gap-[9px] overflow-y-auto custom-scrollbar">
                    {followerData.map((follower) => (
                      <li key={follower.user_id} className="w-full">
                        <label className="flex flex-row w-full px-4 justify-between items-center self-stretch">
                          <div className="flex flex-row items-center gap-2 flex-1">
                            <Image
                              src={
                                follower.profile_img ||
                                'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/avatar.png'
                              }
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
                    <button className="btn-l w-full" onClick={() => inviteHandler(partyNumber, inviteeId, setMessage)}>
                      초대하기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center pt-2 gap-2">
                  <Image src={'/cryingCat.svg'} width={73} height={64} alt="아직 팔로우한 사람이 없습니다" />
                  <li className="pb-12">아직 팔로우한 사람이 없습니다</li>
                </div>
              )}
            </ul>
          ) : (
            <div className="flex flex-col w-full mb-12 gap-2 justify-center self-stretch items-center body-m text-Grey-900">
              {message === '이미 초대장을 보낸 멤버입니다.' ? (
                <Image src={'/inviteCat.svg'} width={73} height={64} alt={message} />
              ) : message === '이미 참여중인 멤버입니다.' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="64" viewBox="0 0 73 64" fill="none">
                  <path
                    d="M70.6159 26.9806C69.0488 23.5074 66.6708 20.482 64.7285 17.154L64.674 17.0632C63.2218 14.6126 61.9027 11.7566 60.7772 8.90665C59.319 5.34874 56.7897 -1.39193 51.5013 0.247858C46.0434 1.87554 41.8017 16.2645 35.6904 16.2524C30.3111 16.2221 24.8412 1.42778 20.0912 0.26601C12.9815 -1.5553 10.8758 11.5085 8.45541 15.6352C5.96245 21.1839 2.79785 25.0383 1.23673 30.714C-4.64472 52.7936 10.8455 63.9937 36.598 63.9937C68.6857 63.9937 78.0041 42.7673 70.6038 26.9685L70.6159 26.9806ZM36.5012 38.9492C37.6024 38.9492 38.498 39.8447 38.498 40.946C38.498 42.0472 37.6024 42.9428 36.5012 42.9428C35.3999 42.9428 34.5044 42.0472 34.5044 40.946C34.5044 39.8447 35.3999 38.9492 36.5012 38.9492ZM28.03 39.1731C25.6217 39.1731 24.3752 37.3276 24.3752 34.6954C24.3752 32.5474 25.3918 29.764 26.8198 27.6159H30.1296C29.1131 29.4977 28.5866 30.9681 28.4717 32.3598C30.2809 32.4748 31.5576 33.7515 31.5576 35.712C31.5576 37.6725 30.1659 39.1731 28.0179 39.1731H28.03ZM41.8078 45.5204C40.6581 47.3478 38.5524 48.5459 36.3741 48.4612C34.2381 48.3764 32.2293 47.1421 31.1946 45.2784C30.6258 44.2558 32.193 43.3421 32.7617 44.3647C33.4939 45.6838 34.9037 46.5914 36.3741 46.6519C37.8929 46.7125 39.4116 45.9258 40.2406 44.6128C40.8638 43.6265 42.431 44.5341 41.8078 45.5265V45.5204ZM45.0873 39.1731C42.6791 39.1731 41.4387 37.3276 41.4387 34.6954C41.4387 32.5474 42.4552 29.764 43.8832 27.6159H47.193C46.1765 29.4977 45.6501 30.9681 45.5351 32.3598C47.302 32.4748 48.621 33.7515 48.621 35.712C48.621 37.6725 47.2294 39.1731 45.0813 39.1731H45.0873Z"
                    fill="#DCDCDC"
                  />
                </svg>
              ) : (
                <Image src={'/cryingCat.svg'} width={73} height={64} alt={message} />
              )}
              <p>{message}</p>
            </div>
          )}
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitedButton;
