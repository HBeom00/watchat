'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { useRouter } from 'next/navigation';

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
        className="font-semibold text-[15px] leading-6"
      >
        모집하기
      </DialogTrigger>
      <DialogContent className="w-[340px] p-0 gap-0">
        <DialogHeader className="flex py-6">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 w-full items-start">
          <p className="self-stretch pt-4 text-center body-m text-static-black">로그인이 필요한 서비스입니다.</p>
          <div className="flex flex-row p-4 items-center gap-2 self-stretch w-full">
            <button className="btn-l w-full">로그인</button>
          </div>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default GoRecruitButton;
