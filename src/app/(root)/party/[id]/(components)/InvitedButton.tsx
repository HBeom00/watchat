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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { unfollow } from '@/store/unfollow';

const InvitedButton = ({ partyNumber, userId }: { partyNumber: string; userId: string }) => {
  const { data: followerDataResult, isPending: pending, isError: error } = useFollowData(userId);
  const queryClient = useQueryClient();

  // 언팔로우 하기
  const mutation = useMutation({
    mutationFn: (followId: string) => unfollow(userId, followId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followingUsers', userId] });
    }
  });

  if (pending) {
    return <div>사용자 정보를 불러오는 중 입니다...</div>;
  }
  if (error) {
    return <div>사용자 정보를 불러오는데 실패했습니다.</div>;
  }

  const { followerCount, followerData } = followerDataResult || { followerCount: 0, followerData: [] };
  return (
    <>
      <Dialog>
        <DialogTrigger>초대하기 [{followerCount}]</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팔로우한 사람</DialogTitle>
          </DialogHeader>
          <ul>
            {followerData && followerData.length > 0 ? (
              followerData.map((follower) => (
                <li key={follower.user_id}>
                  <div>
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
                  <button onClick={() => inviteHandler(partyNumber, userId)}>초대하기</button>
                  <button onClick={() => mutation.mutate(follower.user_id)}>언팔로우</button>
                </li>
              ))
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
