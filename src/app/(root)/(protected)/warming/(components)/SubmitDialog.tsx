import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import React, { useState } from 'react';

const SubmitDialog = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex py-2 items-center my-[17.5px] text-Grey-400 body-xs-bold">
        작성 완료
      </DialogTrigger>
      <DialogContent className="w-[340px] p-0 gap-0">
        <DialogHeader className="flex py-6">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 w-full items-start">
          <p className="self-stretch text-center body-m text-static-black">명의 후기를 작성하셨습니다.</p>
          <p className="self-stretch text-center body-m text-static-black">제출하면 다시 후기를 작성할 수 없습니다.</p>
          <p className="self-stretch text-center body-m text-static-black">
            신뢰할 수 있는 후기를 위해 자세하게 평가해주세요.
          </p>
          <div className="flex flex-row p-4 items-center gap-2 self-stretch w-full">
            <button className="outline-disabled-btn-l w-full" onClick={() => setOpen(false)}>
              취소
            </button>
            <button className="btn-l w-full">제출하기</button>
          </div>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialog;
