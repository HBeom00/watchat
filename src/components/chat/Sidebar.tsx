'use client';

import { UserInfo } from '@/types/teamUserProfile';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import MemberList from './MemberList';
import { Dialog, DialogClose } from '../ui/Dialog';
import { DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { useRouter } from 'next/navigation';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

const Sidebar = ({ isVisible, onClose, roomId }: { isVisible: boolean; onClose: () => void; roomId: string }) => {
  const [isSelect, setIsSelect] = useState<string>('members');
  const [userId, setUserId] = useState<string>('');
  const queryClient = useQueryClient();
  const router = useRouter();

  // 파티 오너 ID 가져오기
  const { data: ownerId } = useQuery({
    queryKey: ['ownerId', roomId],
    queryFn: async () => {
      const { data, error } = await browserClient.from('party_info').select('owner_id').eq('party_id', roomId).single();
      if (error) {
        console.error('Error fetching owner ID:', error);
        return '';
      }
      return data?.owner_id;
    }
  });

  // 파티 참여 멤버 가져오기
  const { data: members = [] } = useQuery({
    queryKey: ['members', roomId],
    queryFn: async () => {
      const { data, error } = await browserClient.from('team_user_profile').select().eq('party_id', roomId);
      if (error) {
        console.error('Error fetching members:', error);
        return [];
      }
      return data;
    }
  });

  useEffect(() => {
    const fetchUserId = async () => {
      // 로그인 유저 아이디 가져오기
      const user_id: string | null = await getLoginUserIdOnClient();
      if (user_id && user_id !== '') {
        setUserId(user_id);
      }
    };
    fetchUserId();
  }, []);

  // 실시간 구독 설정
  useEffect(() => {
    const channel: RealtimeChannel = browserClient
      .channel(`team_user_profile`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'team_user_profile' }, (payload) => {
        queryClient.setQueryData<UserInfo[]>(['members', roomId], (oldMembers = []) => [
          ...oldMembers,
          payload.new as UserInfo
        ]);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'team_user_profile' }, (payload) => {
        queryClient.setQueryData<UserInfo[]>(['members', roomId], (oldMembers = []) =>
          oldMembers.filter((member) => member.profile_id !== payload.old.profile_id)
        );
      })
      .subscribe();

    return () => {
      browserClient.removeChannel(channel); // 컴포넌트 언마운트 시 구독 해제
    };
  }, [roomId, queryClient]);

  // 파티 나가기 기능
  const leavePartyMutation = useMutation({
    mutationFn: async (id: string) => {
      await browserClient.from('team_user_profile').delete().eq('party_id', roomId).eq('user_id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', roomId] });
      queryClient.invalidateQueries({ queryKey: ['isMember', roomId, userId] });
      router.push(`/party/${roomId}`);
    }
  });

  // 멤버 내보내기 기능
  const exitPartyMutation = useMutation({
    mutationFn: async (id: string) => {
      await browserClient.from('team_user_profile').delete().eq('party_id', roomId).eq('user_id', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', roomId] });
      queryClient.invalidateQueries({ queryKey: ['isMember', roomId, userId] });
    }
  });

  return (
    <div
      className={`h-full w-[340px] bg-white fixed top-0 right-0 transform transition-transform duration-300 z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <IoMdClose className="w-6 h-6 shrink-0 mt-5 ml-5 mb-[88px] cursor-pointer" onClick={onClose} />
      {ownerId === userId ? (
        <div className="w-[340px] flex px-5 items-start">
          <button
            onClick={() => setIsSelect('members')}
            className={
              isSelect === 'members'
                ? 'flex px-4 py-2 justify-center items-center border-b-2 border-solid border-Grey-900 text-Grey-900 body-m-bold'
                : 'flex px-4 py-2 justify-center items-center text-Grey-400 body-m-bold'
            }
          >
            함께보는 멤버
          </button>
          <button
            onClick={() => setIsSelect('party')}
            className={
              isSelect === 'party'
                ? 'flex px-4 py-2 justify-center items-center border-b-2 border-solid border-Grey-900 text-Grey-900 body-m-bold'
                : 'flex px-4 py-2 justify-center items-center text-Grey-400 body-m-bold'
            }
          >
            파티관리
          </button>
        </div>
      ) : (
        <div className="w-[340px] flex px-5 flex-col items-start">
          <button
            onClick={() => setIsSelect('members')}
            className="flex px-4 py-2 justify-center items-center border-b-2 border-solid border-Grey-900 body-m-bold"
          >
            함께보는 멤버
          </button>
        </div>
      )}
      <p className="inline-flex px-5 py-4 flex-col items-start label-l text-Grey-700">{`참여자 ${members.length}명`}</p>
      <MemberList
        members={members}
        isSelect={isSelect}
        ownerId={ownerId}
        roomId={roomId}
        userId={userId}
        exitParty={(id: string) => exitPartyMutation.mutate(id)}
      />
      {ownerId !== userId ? (
        <Dialog>
          <DialogTrigger>파티 탈퇴</DialogTrigger>
          <DialogContent>
            <DialogTitle>파티를 나가시겠습니까?</DialogTitle>
            <div className="flex gap-2 justify-center items-center">
              <button onClick={() => leavePartyMutation.mutate(userId)}>나가기</button>
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
