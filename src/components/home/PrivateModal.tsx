import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import Image from 'next/image';

const PrivateModal = ({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="hidden"></DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-[340px] p-0 gap-0">
        <DialogHeader className="flex py-6">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-[8px] pb-[16px] w-full justify-center items-center border-solid border-Grey-200 border-b-[1px]">
          <Image src={'/inviteCat.svg'} width={73} height={64} alt="비공개" />
          <p className="self-stretch pt-4 text-center body-m text-static-black">초대받은 사람만 입장 가능합니다.</p>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="outline-btn-l flex py-[12px] px-[20px] justify-center items-center gap-[4px] self-stretch rounded-[8px] border-none text-primary-400 body-m-bold"
        >
          확인
        </button>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default PrivateModal;
