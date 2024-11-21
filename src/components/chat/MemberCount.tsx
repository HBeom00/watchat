'use client';

import { usePartyMemberList } from '@/reactQuery/useQuery/chat/usePartyMemberList';

const MemberCount = ({ roomId }: { roomId: string }) => {
  // 채팅방에 참여한 유저 정보 가져오기
  const { data: userData = [] } = usePartyMemberList(roomId);

  return <p className="label-m text-Grey-700 border-r-[2px] pr-[5px] mr-[5px]">{`${userData.length}명`}</p>;
};

export default MemberCount;
