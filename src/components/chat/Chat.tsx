'use client';

import React, { useEffect, useState, useRef } from 'react';
import SendMessageForm from './SendMessageForm';
import Image from 'next/image';
import { getLoginUserIdOnClient } from '@/utils/supabase/client';
import award_image from '../../../public/award_star.svg';
import { useOwnerId } from '@/reactQuery/useQuery/chat/useOwnerId';
import { usePartyMemberList } from '@/reactQuery/useQuery/chat/usePartyMemberList';
import { useChatMessage } from '@/reactQuery/useQuery/chat/useChatMessage';
import { useLiveMessage } from '@/utils/hooks/useLiveMessage';

export default function Chat({ roomId }: { roomId: string }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [expandedMessages, setExpandedMessages] = useState<{ [key: string]: boolean }>({});
  const messageListRef = useRef<HTMLDivElement | null>(null);

  // 로그인 유저 아이디 가져오기
  useEffect(() => {
    const fetchUserId = async () => {
      const user_id: string | null = await getLoginUserIdOnClient();
      if (user_id) {
        setUserId(user_id);
      }
    };
    fetchUserId();
  }, []);

  // 실시간 메시지 구독 설정
  useLiveMessage(roomId);

  // 파티 소유자 ID 가져오기
  const { data: ownerId } = useOwnerId(roomId);

  // 초기 메세지 불러오기
  const { data: messages = [] } = useChatMessage(roomId);

  // 채팅방에 참여한 유저 정보 가져오기
  const { data: userData = [] } = usePartyMemberList(roomId);

  // 화면 처음 로드될 때 스크롤을 하단으로 설정
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // 긴 메세지 관리
  const toggleExpand = (msgId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  return (
    <div>
      <div ref={messageListRef} className="chatting_height custom-chat-scrollbar overflow-x-hidden">
        {messages.map((msg, index) => {
          const isMyself = msg.sender_id === userId;
          const showProfile =
            index === 0 ||
            messages[index - 1].sender_id !== msg.sender_id ||
            messages[index - 1].system_message === true;
          const createdAt = new Date(msg.created_at);
          createdAt.setHours(createdAt.getHours() + 9);

          const isExpanded = expandedMessages[msg.created_at] || false;
          const shouldShowMoreButton = msg.content.split('\n').length > 6 || msg.content.length > 114;

          return (
            <div key={msg.created_at} className={`message mt-[4px] mb-[3px] ${isMyself ? 'text-right' : 'text-left'}`}>
              {msg.system_message && (
                <div className="flex justify-center items-center my-[16px] body-xs text-Grey-700">{msg.content}</div>
              )}
              {!msg.system_message && showProfile && (
                <div className={`flex items-center px-[16px] gap-[8px] ${isMyself ? 'justify-end' : 'justify-start'}`}>
                  {!isMyself && (
                    <Image
                      src={
                        userData.filter((el) => el.user_id === msg.sender_id)[0]?.profile_image ||
                        'https://mdwnojdsfkldijvhtppn.supabase.co/storage/v1/object/public/profile_image/assets/default_profile.png'
                      }
                      alt="profile_image"
                      width={32}
                      height={32}
                      className="rounded-full w-[32px] h-[32px]"
                    />
                  )}
                  {!isMyself ? (
                    ownerId === msg.sender_id ? (
                      <div className="flex justify-center items-center gap-[4px] body-xs text-Grey-900">
                        {userData.filter((el) => el.user_id === msg.sender_id)[0]?.nickname || '익명'}
                        <Image src={award_image} alt="award_image" width={20} height={20} />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center body-xs text-Grey-900">
                        {userData.filter((el) => el.user_id === msg.sender_id)[0]?.nickname || '익명'}
                      </div>
                    )
                  ) : (
                    ''
                  )}
                </div>
              )}
              {!msg.system_message && (
                <div className={'content mb-[8px]'}>
                  {isMyself ? (
                    <div className="flex justify-end items-end pl-[54px] pr-[16px] gap-[4px]">
                      <span className="text-Grey-600 text-center caption-m">
                        {createdAt.toISOString().slice(11, 16).split('T').join(' ')}
                      </span>
                      <div
                        className={`max-w-[262px] text-start break-keep break-words px-[16px] py-[8px] relative rounded-[19px] bg-primary-400 body-s text-white`}
                      >
                        <div className={!isExpanded && shouldShowMoreButton ? 'line-clamp' : ''}>{msg.content}</div>
                        {!isExpanded && shouldShowMoreButton && (
                          <div className="text-right mt-2 flex justify-end">
                            <button
                              onClick={() => toggleExpand(msg.created_at)}
                              className="flex items-center py-[1px] rounded-[8px]"
                            >
                              <p className="body-s text-primary-200">더보기</p>
                              <Image
                                src="/pageArrow/right_arrow_disabled_chat.svg"
                                alt="right_arrow"
                                width={12}
                                height={12}
                                className="w-[12px] h-[12px] text-primary-200"
                              />
                            </button>
                          </div>
                        )}
                        {isExpanded && (
                          <div className="text-right mt-2 flex justify-end">
                            <button
                              onClick={() => toggleExpand(msg.created_at)}
                              className="flex items-center py-[1px] rounded-[8px]"
                            >
                              <p className="body-s text-primary-200">접기</p>
                              <Image
                                src="/pageArrow/right_arrow_disabled_chat.svg"
                                alt="right_arrow"
                                width={12}
                                height={12}
                                className="w-[12px] h-[12px] text-primary-200"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start items-end px-[54px] gap-[4px]">
                      <div
                        className={`max-w-[262px] text-start break-keep break-words px-[16px] py-[8px] relative rounded-[19px] bg-white body-s text-Grey-500`}
                      >
                        <div className={!isExpanded && shouldShowMoreButton ? 'line-clamp' : ''}>{msg.content}</div>
                        {!isExpanded && shouldShowMoreButton && (
                          <div className="text-right mt-2 flex justify-end">
                            <button
                              onClick={() => toggleExpand(msg.created_at)}
                              className="flex items-center py-[1px] rounded-[8px]"
                            >
                              <p className="body-s text-Grey-300">더보기</p>
                              <Image
                                src="/pageArrow/right_arrow_disabled.svg"
                                alt="right_arrow"
                                width={12}
                                height={12}
                                className="w-[12px] h-[12px] text-primary-200"
                              />
                            </button>
                          </div>
                        )}
                        {isExpanded && (
                          <div className="text-right mt-2 flex justify-end">
                            <button
                              onClick={() => toggleExpand(msg.created_at)}
                              className="flex items-center py-[1px] rounded-[8px]"
                            >
                              <p className="body-s text-Grey-300">접기</p>
                              <Image
                                src="/pageArrow/right_arrow_disabled.svg"
                                alt="right_arrow"
                                width={12}
                                height={12}
                                className="w-[12px] h-[12px] text-primary-200"
                              />
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-Grey-600 text-center caption-m">
                        {createdAt.toISOString().slice(11, 16).split('T').join(' ')}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <SendMessageForm roomId={roomId} />
    </div>
  );
}
