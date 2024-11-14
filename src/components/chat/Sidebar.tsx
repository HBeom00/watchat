'use client';

import browserClient, { getLoginUserIdOnClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import MemberList from './MemberList';
import { Dialog, DialogClose } from '../ui/Dialog';
import { DialogContent, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import close_img from '../../../public/close.svg';
import Image from 'next/image';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useLiveSubscribe } from '@/utils/hooks/useLiveSubscribe';
import { useOwnerId } from '@/reactQuery/useQuery/chat/useOwnerId';
import { usePartyMemberList } from '@/reactQuery/useQuery/chat/usePartyMemberList';
import { memberScarceSwitch } from '@/utils/memberCheck';

const Sidebar = ({ isVisible, onClose, roomId }: { isVisible: boolean; onClose: () => void; roomId: string }) => {
  const [isSelect, setIsSelect] = useState<'members' | 'party'>('members');
  const [userId, setUserId] = useState<string>('');
  const [userNickname, setUserNickname] = useState<string>('');
  const queryClient = useQueryClient();
  const router = useRouter();

  // 파티 오너 ID 가져오기
  const { data: ownerId } = useOwnerId(roomId);

  // 파티 참여 멤버 가져오기
  const { data: members = [] } = usePartyMemberList(roomId);

  // 실시간 구독 설정 -> team_user_info 테이블
  useLiveSubscribe(roomId);

  // 로그인 유저 아이디 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const user_id: string | null = await getLoginUserIdOnClient();
      if (user_id && user_id !== '') {
        setUserId(user_id);
      }
    };
    fetchUserId();
  }, []);

  // 파티 나가기 기능
  const leavePartyMutation = useMutation({
    mutationFn: async ({ id, nickname }: { id: string; nickname: string }) => {
      await browserClient.from('chat').insert({
        sender_id: id,
        room_id: roomId,
        content: `${nickname}님이 나가셨습니다.`,
        created_at: new Date().toISOString(),
        system_message: true
      });

      await browserClient.from('team_user_profile').delete().eq('party_id', roomId).eq('user_id', id);

      // 모집 마감 시 모집중으로 변환
      await memberScarceSwitch(roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', roomId] });
      queryClient.invalidateQueries({ queryKey: ['isMember', roomId, userId] });
      router.push(`/party/${roomId}`);
    }
  });

  // 멤버 내보내기 기능
  const exitPartyMutation = useMutation({
    mutationFn: async ({ id, nickname }: { id: string; nickname: string }) => {
      await browserClient.from('chat').insert({
        sender_id: id,
        room_id: roomId,
        content: `${nickname}님이 퇴장당하셨습니다.`,
        created_at: new Date().toISOString(),
        system_message: true
      });

      await browserClient.from('team_user_profile').delete().eq('party_id', roomId).eq('user_id', id);
      const { error } = await browserClient.from('party_ban_user').insert({ party_id: roomId, user_id: id });

      if (error) {
        console.log('error', error.message);
      }

      // 모집 마감 시 모집중으로 변환
      await memberScarceSwitch(roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', roomId] });
      queryClient.invalidateQueries({ queryKey: ['isMember', roomId, userId] });
    }
  });

  useEffect(() => {
    setUserNickname(members.filter((el) => el.user_id === userId)[0]?.nickname || '익명');
  }, []);

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
        className="w-[24px] h-[24px] shrink-0 mt-[20px] ml-[20px] mb-[88px] cursor-pointer"
        onClick={onClose}
      />
      {ownerId === userId ? (
        <div className="w-[340px] flex px-[20px] items-start">
          <button
            onClick={() => setIsSelect('members')}
            className={
              isSelect === 'members'
                ? 'flex px-[16px] py-[8px] justify-center items-center border-b-2 border-solid border-Grey-900 text-Grey-900 body-m-bold'
                : 'flex px-[16px] py-[8px] justify-center items-center text-Grey-400 body-m-bold'
            }
          >
            함께보는 멤버
          </button>
          <button
            onClick={() => setIsSelect('party')}
            className={
              isSelect === 'party'
                ? 'flex px-[16px] py-[8px] justify-center items-center border-b-2 border-solid border-Grey-900 text-Grey-900 body-m-bold'
                : 'flex px-[16px] py-[8px] justify-center items-center text-Grey-400 body-m-bold'
            }
          >
            파티관리
          </button>
        </div>
      ) : (
        <div className="w-[340px] flex px-[20px] flex-col items-start">
          <button
            onClick={() => setIsSelect('members')}
            className="flex px-[16px] py-[8px] justify-center items-center border-b-2 border-solid border-Grey-900 body-m-bold"
          >
            함께보는 멤버
          </button>
        </div>
      )}
      <p className="inline-flex px-[20px] py-[16px] flex-col items-start label-l text-Grey-700">{`참여자 ${members.length}명`}</p>
      <MemberList
        members={members}
        isSelect={isSelect}
        ownerId={ownerId}
        roomId={roomId}
        userId={userId}
        exitParty={({ id, nickname }: { id: string; nickname: string }) => exitPartyMutation.mutate({ id, nickname })}
      />
      {ownerId !== userId ? (
        <div className="p-[20px] w-[340px] flex flex-col items-start">
          <Dialog>
            <DialogTrigger className="w-[300px] fixed bottom-[20px] outline-disabled-btn-l flex justify-center items-center gap-[4px] self-stretch">
              파티 탈퇴
            </DialogTrigger>
            <DialogContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              className="w-[350px] p-[16px] bg-white rounded-lg shadow-lg"
            >
              <DialogTitle className="px-[16px] py-[8px"></DialogTitle>
              <DialogDescription className="flex justify-center items-end text-lg font-semibold text-gray-900 mt-[16px] body-m">
                파티를 나가시겠습니까?
              </DialogDescription>
              <div className="flex justify-center items-center mt-[16px] gap-[16px]">
                <div
                  onClick={() => leavePartyMutation.mutate({ id: userId, nickname: userNickname })}
                  className="w-[150px] py-[8px] px-[16px] bg-primary-500 text-white font-bold rounded-md hover:bg-primary-600 transition cursor-pointer text-center"
                >
                  나가기
                </div>
                <DialogClose>
                  <div className="w-[150px] py-[8px] px-[16px] bg-gray-200 text-Grey-400 font-bold rounded-md hover:bg-gray-300 transition">
                    취소
                  </div>
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
