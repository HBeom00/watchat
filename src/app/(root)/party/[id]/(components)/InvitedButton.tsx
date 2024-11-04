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
  children,
  partyNumber,
  userId
}: {
  children: React.ReactNode;
  partyNumber: string;
  userId: string;
}) => {
  const [message, setMessage] = useState<string>('');
  const [inviteeId, setInviteeId] = useState<string>('');
  const [display, setDisplay] = useState<boolean>(true);
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

  useEffect(() => {
    if (message !== '') {
      setDisplay(false);
    }
  }, [message]);

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
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="w-[340px] p-0 gap-0 max-h-[363px] overflow-hidden">
          <DialogHeader className="flex py-6">
            {display ? <DialogTitle>팔로우한 사람</DialogTitle> : <></>}
          </DialogHeader>
          {message !== '' ? (
            <ul>
              {followerData && followerData.length > 0 ? (
                <div className="flex flex-col w-full">
                  <div className="flex flex-col py-4 w-full items-center gap-[9px] self-stretch">
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
                <li>아직 팔로우한 사람이 없습니다.</li>
              )}
            </ul>
          ) : (
            <div className="flex flex-col h-16 justify-center self-stretch items-center body-m text-Grey-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="73" height="64" viewBox="0 0 73 64" fill="none">
                <path
                  d="M70.6165 26.9817C69.0493 23.5084 66.6712 20.4829 64.7289 17.1548L64.6744 17.0641C63.2222 14.6134 61.9031 11.7573 60.7776 8.90733C59.3193 5.34934 56.79 -1.39147 51.5014 0.248351C46.0434 1.87607 41.8017 16.2653 35.6902 16.2532C30.3108 16.223 24.8407 1.4283 20.0907 0.266504C12.9808 -1.55485 10.875 11.5093 8.45461 15.636C5.9616 21.1848 2.79693 25.0453 1.23578 30.7151C-4.64579 52.7952 10.8448 63.9956 36.5978 63.9956C68.6862 63.9956 78.0048 42.7687 70.6044 26.9756L70.6165 26.9817ZM28.0296 39.604C25.6213 39.604 24.3748 37.7585 24.3748 35.1263C24.3748 32.9782 25.3914 30.1947 26.8194 28.0466H30.1293C29.1127 29.9285 28.5863 31.3989 28.4713 32.7906C30.2806 32.9056 31.5573 34.1823 31.5573 36.1429C31.5573 38.1034 30.1656 39.604 28.0175 39.604H28.0296ZM36.501 44.9471C35.3997 44.9471 34.5042 44.0515 34.5042 42.9502C34.5042 41.849 35.3997 40.9534 36.501 40.9534C37.6023 40.9534 38.4978 41.849 38.4978 42.9502C38.4978 44.0515 37.6023 44.9471 36.501 44.9471ZM41.4325 35.1263C41.4325 32.9782 42.4491 30.1947 43.8771 28.0466H47.187C46.1705 29.9285 45.644 31.3989 45.5291 32.7906C47.296 32.9056 48.6151 34.1823 48.6151 36.1429C48.6151 38.1034 47.2233 39.604 45.0752 39.604C42.6669 39.604 41.4265 37.7585 41.4265 35.1263H41.4325ZM46.237 52.6318C44.8211 52.6318 43.6714 51.4821 43.6714 50.0662C43.6714 48.9952 45.1357 45.4856 45.8498 43.8276C45.995 43.4888 46.473 43.4888 46.6182 43.8276C47.3323 45.4856 48.7966 49.0012 48.7966 50.0662C48.7966 51.4821 47.6469 52.6318 46.231 52.6318H46.237Z"
                  fill="#DCDCDC"
                />
              </svg>
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
