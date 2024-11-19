'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const GoRecruitButton = ({ isLogin }: { isLogin: boolean }) => {
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={(e) => {
          e.preventDefault();
          if (isLogin) {
            router.push('/recruit/firstPage');
            return;
          }
          setOpen(true);
        }}
      >
        <div className="flex flex-col items-center">
          <Image src={'/headerIcon/recruit.svg'} className="hidden mobile:flex" width={24} height={24} alt="모집하기" />
          <p
            className={`body-m-bold text-Grey-900 text-center
          mobile:text-Grey-300 mobile:body-xs-bold`}
          >
            모집하기
          </p>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[340px] p-0 gap-0 rounded-[8px]">
        <DialogHeader className="flex py-6">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 w-full items-start">
          <p className="self-stretch pt-4 text-center body-m text-static-black">로그인이 필요한 서비스입니다.</p>
          <div className="flex flex-row p-4 items-center gap-2 self-stretch w-full">
            <Link
              href={'/login'}
              className="flex btn-l w-full justify-center items-center"
              onClick={() => setOpen(false)}
            >
              로그인
            </Link>
          </div>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default GoRecruitButton;
