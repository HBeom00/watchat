'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/Dialog';
import { memberExpulsion } from '@/utils/ownerRights';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

const ExitButton = ({ partyId, userId }: { partyId: string; userId: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // 파티 탈퇴하기
  const mutation = useMutation({
    mutationFn: (userId: string) => memberExpulsion(partyId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partyMember', partyId] });
      queryClient.invalidateQueries({ queryKey: ['isMember', partyId, userId] });
      queryClient.invalidateQueries({ queryKey: ['myParty', userId] });
      queryClient.invalidateQueries({ queryKey: ['memberCount', partyId] });
      setOpen(false);
    }
  });
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="inline-flex py-2 items-center my-[17.5px] text-Grey-400 body-xs-bold">
          참여 취소
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="w-[340px] p-0 gap-0">
          <DialogHeader className="flex py-6">
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full items-start">
            <p className="self-stretch text-center body-m text-static-black">참여를 취소 하시겠습니까?</p>
            <div className="flex flex-row p-4 items-center gap-2 self-stretch w-full">
              <button className="outline-disabled-btn-l w-full" onClick={() => setOpen(false)}>
                취소
              </button>
              <button className="btn-l w-full" onClick={() => mutation.mutate(userId)}>
                나가기
              </button>
            </div>
          </div>
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExitButton;
