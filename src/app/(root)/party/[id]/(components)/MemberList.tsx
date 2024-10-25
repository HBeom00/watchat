import { createClient } from '@/utils/supabase/server';
import MemberProfileCard from './MemberProfile';

const MemberList = async ({ partyNumber }: { partyNumber: string }) => {
  const supabase = createClient();
  // 파티 멤버 정보들을 불러오기
  const { data } = await supabase.from('team_user_profile').select('*').eq('party_id', partyNumber);

  // 클라이언트 로직은 만들었는데 서버 로직은 안 만들었음
  const isMember = true; //로그인한 사용자가 해당 파티에 가입했을 때;
  return (
    <div>
      <p>팀원 정보</p>
      {data && data.length > 0 ? (
        data.map((mem) => {
          return (
            <MemberProfileCard
              key={mem.profile_id}
              partyNumber={partyNumber}
              memberNumber={mem.profile_id}
              isMember={isMember}
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
