'use client';

import { isMemberExist, member } from '@/utils/memberCheck';
import { memberExpulsion } from '@/utils/ownerRights';
import browserClient from '@/utils/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';

const MemberProfileCard = ({
  partyNumber,
  memberInfo,
  userId,
  isOwner
}: {
  partyNumber: string;
  memberInfo: member;
  userId: string | null;
  isOwner: boolean;
}) => {
  // 내 정보에서는 초대하기와 팔로우 불필요함
  const myInfo = memberInfo.user_id === userId;
  const queryClient = useQueryClient();

  //로그인한 사용자가 해당 파티에 가입했을 때
  const { data: isMember, isLoading: isMemberLoading } = useQuery({
    queryKey: ['isMember', partyNumber],
    queryFn: async () => await isMemberExist(partyNumber, userId)
  });

  if (isMemberLoading) {
    return <div>Loading...</div>;
  }
  // 나가기
  const homecoming = async () => {
    const { error } = await browserClient
      .from('team_user_profile')
      .delete()
      .eq('party_id', partyNumber)
      .eq('user_id', userId);
    if (error) {
      console.log(error.message);
    }
    // isMember 유효성 초기화하기
    await queryClient.invalidateQueries({ queryKey: ['partyMember'] });
  };

  return (
    <div>
      <div>
        <p>닉네임:{memberInfo.nickname}</p>
        <Image src={memberInfo.profile_image} width={100} height={100} alt="프로필이미지" />
        {isMember && !myInfo && !isOwner ? <button className="bg-blue-400 p-4">팔로우버튼</button> : <></>}
        {myInfo ? (
          <button
            onClick={async () => {
              await homecoming();
            }}
          >
            나가기
          </button>
        ) : (
          <></>
        )}
        {isOwner ? (
          <button onClick={async () => await memberExpulsion(memberInfo.profile_id, partyNumber)}>강퇴하기</button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default MemberProfileCard;
