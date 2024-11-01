import { UserInfo } from '@/types/teamUserProfile';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import MemberList from './MemberList';
import { Dialog, DialogClose } from '../ui/Dialog';
import { DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { useRouter } from 'next/navigation';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';

const Sidebar = ({ isVisible, onClose, roomId }: { isVisible: boolean; onClose: () => void; roomId: string }) => {
  const [isSelect, setIsSelect] = useState<string>('members');
  const [ownerId, setOwnerId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [members, setMembers] = useState<UserInfo[]>([]);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      // 파티 오너 유저 아이디 가져오기
      const { data: ownerData, error: ownerError } = await browserClient
        .from('party_info')
        .select('owner_id')
        .eq('party_id', roomId);
      setOwnerId(ownerData?.[0].owner_id);

      if (ownerError) {
        console.error('Error fetching owner ID:', ownerError);
      }

      // 로그인 유저 아이디 가져오기
      const user_id: string | null = await getLoginUserIdOnClient();
      if (user_id) {
        setUserId(user_id);
      }

      // 파티 참여 유저 정보 불러오기
      const { data: memberData, error: memberError } = await browserClient
        .from('team_user_profile')
        .select()
        .eq('party_id', roomId);

      if (memberData) {
        setMembers(memberData);
      }

      if (memberError) {
        console.error('Error fetching members:', memberError);
      }
    };

    fetchInitialData();

    // 실시간 구독 설정
    const channel: RealtimeChannel = browserClient
      .channel(`team_user_profile`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'team_user_profile' }, (payload) => {
        setMembers((prevMembers) => [...prevMembers, payload.new as UserInfo]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'team_user_profile' }, (payload) => {
        setMembers((prevMembers) => prevMembers.filter((member) => member.profile_id !== payload.old.profile_id));
      })
      .subscribe();

    return () => {
      browserClient.removeChannel(channel); // 컴포넌트 언마운트 시 구독 해제
    };
  }, [roomId]);

  // 참여자 -> 파티 나가기 함수
  const leaveParty = async (id: string) => {
    await browserClient.from('team_user_profile').delete().eq('party_id', roomId).eq('user_id', id);

    setMembers((prevMembers) => prevMembers.filter((el) => el.user_id !== id)); // 로컬 업데이트
    await queryClient.invalidateQueries({ queryKey: ['isMember', roomId, id] });
    router.push(`/party/${roomId}`); // 나간 후 리디렉션
  };

  // 관리자 -> 내보내기 함수
  const exitParty = async (id: string) => {
    await browserClient.from('team_user_profile').delete().eq('party_id', roomId).eq('user_id', id);

    setMembers((prevMembers) => prevMembers.filter((el) => el.user_id !== id)); // 로컬 업데이트
    await queryClient.invalidateQueries({ queryKey: ['isMember', roomId, id] });
  };

  return (
    <div
      className={`h-screen w-[400px] bg-white fixed top-0 right-0 transform transition-transform duration-300 z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <IoMdClose className="text-2xl m-4 cursor-pointer" onClick={onClose} />
      <div>
        {ownerId === userId ? (
          <div className="flex gap-5">
            <button
              onClick={() => setIsSelect('members')}
              className={isSelect === 'members' ? 'underline' : 'no-underline'}
            >
              함께보는 멤버
            </button>
            <button
              onClick={() => setIsSelect('party')}
              className={isSelect === 'party' ? 'underline' : 'no-underline'}
            >
              파티관리
            </button>
          </div>
        ) : (
          <div>
            <button onClick={() => setIsSelect('members')}>함께보는 멤버</button>
          </div>
        )}
      </div>
      <p className="text-gray-400 text-[12px]">{`참여자 ${members.length}명`}</p>
      <div>
        <MemberList
          members={members}
          isSelect={isSelect}
          ownerId={ownerId}
          roomId={roomId}
          userId={userId}
          exitParty={exitParty}
        />
      </div>
      {ownerId !== userId ? (
        <Dialog>
          <DialogTrigger>파티 탈퇴</DialogTrigger>
          <DialogContent>
            <DialogTitle>파티를 나가시겠습니까?</DialogTitle>
            <div className="flex gap-2 justify-center items-center">
              <button onClick={() => leaveParty(userId)}>나가기</button>
              <DialogClose>
                <button>취소</button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default Sidebar;
