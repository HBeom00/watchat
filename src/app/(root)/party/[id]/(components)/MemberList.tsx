import { createClient } from '@/utils/supabase/server';
import MemberProfileCard from './MemberProfile';
import { isMemberExistOnServer } from '@/utils/memberCheckOnServer';

const MemberList = async ({
  partyNumber,
  userId,
  isOwner
}: {
  partyNumber: string;
  userId: string | null;
  isOwner: boolean;
}) => {
  const supabase = createClient();

  // 파티 멤버 정보들을 불러오기
  const { data }: { data: member[] | null } = await supabase
    .from('team_user_profile')
    .select('*')
    .eq('party_id', partyNumber);

  //로그인한 사용자가 해당 파티에 가입했을 때
  const isMember = await isMemberExistOnServer(partyNumber, userId);
  return (
    <div>
      <p>팀원 정보</p>
      {data && data.length > 0 ? (
        data.map((mem) => {
          return (
            <MemberProfileCard
              key={mem.profile_id}
              partyNumber={partyNumber}
              memberInfo={mem}
              isMember={isMember}
              userId={userId}
              isOwner={isOwner}
            />
          );
        })
      ) : (
        <>
          <p>멤버가 없습니다</p>
        </>
      )}
    </div>
  );
};

export default MemberList;

export type member = { profile_id: string; nickname: string; profile_image: string; user_id: string; party_id: string };
