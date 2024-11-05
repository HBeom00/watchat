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
        <DialogContent className="w-[340px] p-0 gap-0 max-h-[363px] overflow-hidden">
          <DialogHeader className="flex py-6">
            <DialogTitle className={display ? '' : 'hidden'}>팔로우한 사람</DialogTitle>
          </DialogHeader>
          {message === '' ? (
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
            <div className="flex flex-col w-full mb-12 gap-2 justify-center self-stretch items-center body-m text-Grey-900">
              {message === '이미 초대장을 보낸 멤버입니다.' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none">
                  <g clipPath="url(#clip0_893_58335)">
                    <path
                      d="M62.4045 23.8133C61.0308 20.7479 58.9462 18.0776 57.2436 15.1404L57.1959 15.0603C55.9229 12.8974 54.7666 10.3767 53.78 7.86135C52.5017 4.72116 50.2845 -1.2281 45.6487 0.219161C40.8644 1.65574 37.1461 14.3553 31.7889 14.3447C27.0735 14.318 22.2786 1.26055 18.1148 0.235182C11.8824 -1.37229 10.0366 10.1577 7.91491 13.7999C5.7296 18.6971 2.95552 22.099 1.58705 27.1083C-3.56859 46.5957 10.0101 56.4809 32.5846 56.4809C60.7125 56.4809 68.8809 37.7465 62.3939 23.8026L62.4045 23.8133ZM25.0739 34.5743C22.9628 34.5743 21.8702 32.9455 21.8702 30.6224C21.8702 28.7265 22.7613 26.2699 24.013 24.374H26.9144C26.0233 26.0349 25.5619 27.3326 25.4611 28.561C27.047 28.6624 28.1662 29.7893 28.1662 31.5196C28.1662 33.2499 26.9462 34.5743 25.0633 34.5743H25.0739ZM32.4997 37.9067C31.5343 37.9067 30.7493 37.1164 30.7493 36.1444C30.7493 35.1724 31.5343 34.382 32.4997 34.382C33.4651 34.382 34.2501 35.1724 34.2501 36.1444C34.2501 37.1164 33.4651 37.9067 32.4997 37.9067ZM40.0263 34.5743C37.9152 34.5743 36.8279 32.9455 36.8279 30.6224C36.8279 28.7265 37.719 26.2699 38.9708 24.374H41.8721C40.981 26.0349 40.5196 27.3326 40.4188 28.561C41.9676 28.6624 43.1239 29.7893 43.1239 31.5196C43.1239 33.2499 41.904 34.5743 40.021 34.5743H40.0263Z"
                      fill="#DCDCDC"
                    />
                    <path
                      d="M47.4001 41.7675L19.0017 39.1827C17.7287 39.0652 16.6095 40.0105 16.4928 41.2922L14.9121 58.8837C14.7955 60.1654 15.7343 61.2922 17.0073 61.4097L45.4058 63.9945C46.6788 64.112 47.7979 63.1667 47.9146 61.885L49.4953 44.2935C49.612 43.0118 48.6731 41.885 47.4001 41.7675ZM45.0026 46.6273C43.0454 47.6794 41.0882 48.7315 39.1362 49.7782C38.2929 50.2321 37.4495 50.6861 36.6062 51.1347C35.8158 51.5566 35.0361 52.0372 34.1822 52.3309C32.4318 52.929 30.8564 52.1974 29.4615 51.1293C26.4169 48.8009 23.5155 46.2535 20.5505 43.8182C19.8556 43.2468 20.6619 42.0933 21.362 42.67C23.1919 44.176 25.0219 45.6767 26.8518 47.1827C27.7376 47.909 28.6234 48.6407 29.5092 49.367C30.3101 50.0238 31.1747 50.7875 32.1931 51.0706C33.2486 51.3643 34.1928 50.8302 35.0998 50.3443C36.1129 49.8049 37.126 49.2548 38.1338 48.7154C40.2236 47.5939 42.3134 46.4671 44.4086 45.3456C45.2095 44.9184 45.7983 46.2001 45.0026 46.622V46.6273Z"
                      fill="#F5F5F5"
                    />
                    <path
                      d="M14.1951 59.6264C17.7925 59.6264 20.7087 56.6903 20.7087 53.0683C20.7087 49.4464 17.7925 46.5103 14.1951 46.5103C10.5978 46.5103 7.68164 49.4464 7.68164 53.0683C7.68164 56.6903 10.5978 59.6264 14.1951 59.6264Z"
                      fill="#E8E8E8"
                    />
                    <path
                      d="M49.828 59.6264C53.4253 59.6264 56.3415 56.6903 56.3415 53.0683C56.3415 49.4464 53.4253 46.5103 49.828 46.5103C46.2306 46.5103 43.3145 49.4464 43.3145 53.0683C43.3145 56.6903 46.2306 59.6264 49.828 59.6264Z"
                      fill="#E8E8E8"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_893_58335">
                      <rect width="64" height="64" fill="white" transform="translate(0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="64" viewBox="0 0 73 64" fill="none">
                  <g clipPath="url(#clip0_893_38450)">
                    <path
                      d="M70.6165 26.9817C69.0493 23.5084 66.6712 20.4829 64.7289 17.1548L64.6744 17.0641C63.2222 14.6134 61.9031 11.7573 60.7776 8.90733C59.3193 5.34934 56.79 -1.39147 51.5014 0.248351C46.0434 1.87607 41.8017 16.2653 35.6902 16.2532C30.3108 16.223 24.8407 1.4283 20.0907 0.266504C12.9808 -1.55485 10.875 11.5093 8.45461 15.636C5.9616 21.1848 2.79693 25.0453 1.23578 30.7151C-4.64579 52.7952 10.8448 63.9956 36.5978 63.9956C68.6862 63.9956 78.0048 42.7687 70.6044 26.9756L70.6165 26.9817ZM28.0296 39.604C25.6213 39.604 24.3748 37.7585 24.3748 35.1263C24.3748 32.9782 25.3914 30.1947 26.8194 28.0466H30.1293C29.1127 29.9285 28.5863 31.3989 28.4713 32.7906C30.2806 32.9056 31.5573 34.1823 31.5573 36.1429C31.5573 38.1034 30.1656 39.604 28.0175 39.604H28.0296ZM36.501 44.9471C35.3997 44.9471 34.5042 44.0515 34.5042 42.9502C34.5042 41.849 35.3997 40.9534 36.501 40.9534C37.6023 40.9534 38.4978 41.849 38.4978 42.9502C38.4978 44.0515 37.6023 44.9471 36.501 44.9471ZM41.4325 35.1263C41.4325 32.9782 42.4491 30.1947 43.8771 28.0466H47.187C46.1705 29.9285 45.644 31.3989 45.5291 32.7906C47.296 32.9056 48.6151 34.1823 48.6151 36.1429C48.6151 38.1034 47.2233 39.604 45.0752 39.604C42.6669 39.604 41.4265 37.7585 41.4265 35.1263H41.4325ZM46.237 52.6318C44.8211 52.6318 43.6714 51.4821 43.6714 50.0662C43.6714 48.9952 45.1357 45.4856 45.8498 43.8276C45.995 43.4888 46.473 43.4888 46.6182 43.8276C47.3323 45.4856 48.7966 49.0012 48.7966 50.0662C48.7966 51.4821 47.6469 52.6318 46.231 52.6318H46.237Z"
                      fill="#DCDCDC"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_893_38450">
                      <rect width="73.0097" height="64" fill="white" transform="translate(-0.00488281)" />
                    </clipPath>
                  </defs>
                </svg>
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
