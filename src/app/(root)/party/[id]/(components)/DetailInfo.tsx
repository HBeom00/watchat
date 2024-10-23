import { createClient } from "@/utils/supabase/server";
import MemberProfileCard from "./MemberProfile";

const DetailInfo = async ({ partyNumber }: { partyNumber: string }) => {
  const supabase = createClient();
  const { data } = await supabase
    .from("team_user_profile")
    .select("*")
    .eq("party_id", partyNumber);

  return (
    <div className="flex flex-col w-full h-96 justify-center items-center bg-slate-400">
      <div>
        <p>영상 상세정보</p>
      </div>

      <div>
        <p>팀원 정보</p>
        {data && data.length > 0 ? (
          data.map((mem) => {
            return (
              <MemberProfileCard
                key={mem.profile_id}
                partyNumber={partyNumber}
                memberNumber={"멤버넘버"}
              />
            );
          })
        ) : (
          <p>멤버가 없습니다</p>
        )}
      </div>
    </div>
  );
};

export default DetailInfo;
