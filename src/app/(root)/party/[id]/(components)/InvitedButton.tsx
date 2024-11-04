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
import { useState } from 'react';

const InvitedButton = ({
  children,
  partyNumber,
  userId
}: {
  children: React.ReactNode;
  partyNumber: string;
  userId: string;
}) => {
  const [inviteeId, setInviteeId] = useState<string>('');
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팔로우한 사람</DialogTitle>
          </DialogHeader>
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
                            width={50}
                            height={50}
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
                <button onClick={() => inviteHandler(partyNumber, inviteeId)}>초대하기</button>
              </div>
            ) : (
              <li>아직 팔로우한 사람이 없습니다.</li>
            )}
          </ul>
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InvitedButton;
