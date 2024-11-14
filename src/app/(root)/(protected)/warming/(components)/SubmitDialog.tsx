import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import React, { useState } from 'react';
import { submit } from './WarmingMemberList';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const SubmitDialog = ({ submitArr, userId, party_id }: { submitArr: submit[]; userId: string; party_id: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  const router = useRouter();

  const done = submitArr.filter((n) => n.temperature !== 0);
  const notDone = !submitArr.some((n) => n.temperature !== 0);

  const submitHandler = async () => {
    setDisabled(true);
    const submitPromises = done.map(async (submitInfo) => {
      const { error } = await browserClient.from('warming').insert({ ...submitInfo });
      if (error) {
        console.log(error.message);
      }
    });
    await Promise.all(submitPromises);
    const { error } = await browserClient
      .from('team_user_profile')
      .update({ warming_end: true })
      .eq('user_id', userId)
      .eq('party_id', party_id);
    if (error) {
      console.log(error.message);
    }
    router.replace('/myPage');
    setDisabled(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={`rounded-[8px] w-full ${notDone ? 'disabled-btn-xl' : 'btn-xl'}`} disabled={notDone}>
        작성 완료
      </DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-[340px] p-0 gap-0">
        <DialogHeader className="flex py-6">
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 w-full items-start">
          <p className="self-stretch text-center body-m text-static-black">{done.length}명의 후기를 작성하셨습니다.</p>
          <p className="self-stretch text-center body-m text-static-black">제출하면 다시 후기를 작성할 수 없습니다.</p>
          <p className="self-stretch text-center body-m text-static-black">
            신뢰할 수 있는 후기를 위해 자세하게 평가해주세요.
          </p>
          <div className="flex flex-row p-4 items-center gap-2 self-stretch w-full">
            <button className="outline-disabled-btn-l w-full" onClick={() => setOpen(false)}>
              취소
            </button>
            <button className="btn-l w-full" onClick={submitHandler} disabled={disabled}>
              제출하기
            </button>
          </div>
        </div>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitDialog;
