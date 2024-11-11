'use client';

import { UserInfo } from '@/types/teamUserProfile';
import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import MemberList from './MemberList';
import { Dialog, DialogClose } from '../ui/Dialog';
import { DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { useRouter } from 'next/navigation';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import close_img from '../../../public/close.svg';
import Image from 'next/image';
import { DialogDescription } from '@radix-ui/react-dialog';

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
      await browserClient.from('party_ban_user').insert({ party_id: roomId, user_id: id });
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
      <Image
        src={close_img}
        alt="close_img"
        width={24}
        height={24}
        className="w-6 h-6 shrink-0 mt-5 ml-5 mb-[88px] cursor-pointer"
        onClick={onClose}
      />
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
        <div className="p-5 w-[340px] flex flex-col items-start">
          <Dialog>
            <DialogTrigger className="w-[300px] fixed bottom-5 outline-disabled-btn-l flex justify-center items-center gap-1 self-stretch">
              파티 탈퇴
            </DialogTrigger>
            <DialogContent className="w-[350px] p-4 bg-white rounded-lg shadow-lg">
              <DialogTitle className="px-4 py-2"></DialogTitle>
              <DialogDescription className="flex justify-center items-end text-lg font-semibold text-gray-900 mt-4 body-m">
                파티를 나가시겠습니까?
              </DialogDescription>
              <div className="flex justify-center items-center mt-4 gap-4">
                <button
                  onClick={() => leavePartyMutation.mutate(userId)}
                  className="w-[150px] py-2 px-4 bg-primary-500 text-white font-bold rounded-md hover:bg-primary-600 transition"
                >
                  나가기
                </button>
                <DialogClose>
                  <button className="w-[150px] py-2 px-4 bg-gray-200 text-Grey-400 font-bold rounded-md hover:bg-gray-300 transition">
                    취소
                  </button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
    </div>
  );
};

export default Sidebar;
