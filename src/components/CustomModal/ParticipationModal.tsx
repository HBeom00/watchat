'use client';

import { Dispatch, RefObject, SetStateAction, useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import getBanUsers from '@/utils/participation/BanUsers';
import { getLoginUserIdOnClient } from '@/utils/supabase/client';

import ParticipationForm from '../form/ParticipationForm';

const ParticipationModal = ({
  children,
  open,
  party_id,
  party_situation,
  isLogin,
  setOpen,
  openRef,
  isMember,
  invite_id
}: {
  children?: React.ReactNode;
  open: boolean;
  party_id: string;
  party_situation?: string;
  isLogin: boolean;
  isMember?: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openRef: RefObject<HTMLDivElement>;
  invite_id?: string;
}) => {
  const [message, setMessage] = useState<string>('');

  const [display, setDisplay] = useState<boolean>(true);
  const path = usePathname();

  const { data: ban } = useQuery({
    queryKey: ['ban', party_id],
    queryFn: async () => {
      const userId = await getLoginUserIdOnClient();
      const response = await getBanUsers(party_id);

      return (response && response.some((n) => n.user_id === userId)) || false;
    }
  });

  useEffect(() => {
    if (!isLogin) {
      setMessage('로그인이 필요한 서비스입니다.');
    }
    if (ban) {
      setMessage('참가할 수 없는 파티입니다.');
    }
    if (party_situation === '모집마감') {
      setMessage('모집이 마감된 파티입니다.');
    }
    if (message !== '' && !path.includes('/recruit')) {
      setDisplay(false);
    }
    if (!open) {
      setMessage('');
      setDisplay(true);
    }
  }, [message, party_situation, isLogin, path, open, ban]);

  return (
    <>
      <div className={`${open && 'flex fixed z-40 top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.50)]'}`}></div>
      <div ref={openRef} className={`relative w-full ${(isMember && open) || !isMember ? '' : 'hidden'}`}>
        {children}
        {open && (
          <div
            className={`fixed left-[50%] top-[50%] w-[340px] z-50 rounded-[8px] translate-x-[-50%] translate-y-[-50%] bg-static-white transform
          mobile:top-[inherit] mobile:bottom-0 mobile:w-full mobile:rounded-b-none mobile:translate-y-[0%]`}
          >
            {/* 헤더 */}
            <div
              className={`flex flex-row w-full justify-between items-center self-stretch text-static-black text-center body-m-bold
          ${display ? 'p-[24px_16px_16px_16px]' : 'p-[16px_16px_8px_16px]'}
          mobile:py-[24px] mobile:px-[16px]`}
            >
              <div className="w-[24px] h-[24px]"></div>
              <div className={display ? '' : 'hidden'}>참가하기</div>
              <div onClick={() => setOpen(false)}>
                <Image src={'/modal/modal_close.svg'} width={24} height={24} alt="닫기" />
              </div>
            </div>
            {/* 내용 */}
            {message === '로그인이 필요한 서비스입니다.' ? (
              <div className="flex flex-col gap-4 pt-4 justify-center self-stretch items-center body-m text-Grey-900">
                <p className="self-stretch text-center">{message}</p>
                <div className="flex items-center self-stretch p-4">
                  <Link href="/login" className="btn-l w-full text-center">
                    로그인
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className={!display ? 'flex w-full flex-col' : 'hidden'}>
                  <div className="flex w-full flex-col pb-[16px] gap-2 justify-center self-stretch items-center body-m text-Grey-900 border-solid border-Grey-200 border-b-[1px]">
                    {message === '파티에 참가하신 걸 환영합니다!' ? (
                      <Image src={'/smileCat.svg'} width={73} height={64} alt={message} />
                    ) : (
                      <Image src={'/cryingCat.svg'} width={73} height={64} alt={message} />
                    )}
                    <p>{message}</p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="outline-btn-l flex py-[12px] px-[20px] justify-center items-center gap-[4px] self-stretch rounded-[8px] border-none text-primary-400 body-m-bold"
                  >
                    확인
                  </button>
                </div>
                <ParticipationForm
                  party_id={party_id}
                  setMessage={setMessage}
                  invite_id={invite_id}
                  display={display}
                />
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ParticipationModal;
