'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import ParticipationForm from '../form/ParticipationForm';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
const ParticipationButton = ({
  openControl,
  party_id,
  party_situation,
  isLogin,
  setOpenControl,
  invite_id
}: {
  openControl?: boolean;
  children?: React.ReactNode;
  party_id: string;
  party_situation?: string;
  isLogin?: boolean;
  setOpenControl: Dispatch<SetStateAction<boolean>>;
  invite_id?: string;
}) => {
  const [message, setMessage] = useState<string>('');

  const [display, setDisplay] = useState<boolean>(true);
  const path = usePathname();

  useEffect(() => {
    if (!isLogin) {
      setMessage('로그인이 필요한 서비스입니다.');
    }
    if (party_situation === '모집마감') {
      setMessage('모집이 마감된 파티입니다.');
    }
    if (message !== '' && !path.includes('/recruit')) {
      setDisplay(false);
    }
    if (!openControl) {
      console.log('확인');
      setMessage('');
      setDisplay(true);
    }
  }, [message, party_situation, isLogin, path, openControl]);

  return (
    <>
      <Dialog
        open={openControl}
        onOpenChange={() => {
          if (openControl && path.includes('/recruit')) {
            return setOpenControl(true);
          }
          return setOpenControl(!openControl);
        }}
      >
        <DialogTrigger className="hidden">참가하기</DialogTrigger>
        <DialogContent className="w-[380px] p-0 gap-0">
          <DialogHeader className="flex py-6">
            <DialogTitle className={display ? '' : 'hidden'}>파티 프로필</DialogTitle>
          </DialogHeader>
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
              <div
                className={
                  !display
                    ? `flex flex-col mb-12 gap-2 justify-center self-stretch items-center body-m text-Grey-900`
                    : 'hidden'
                }
              >
                {message === '파티에 참가하신 걸 환영합니다!' ? (
                  <Image src={'/smileCat.svg'} width={73} height={64} alt={message} />
                ) : (
                  <Image src={'/cryingCat.svg'} width={73} height={64} alt={message} />
                )}
                <p>{message}</p>
              </div>
              <ParticipationForm party_id={party_id} setMessage={setMessage} invite_id={invite_id} display={display} />
            </>
          )}
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipationButton;
