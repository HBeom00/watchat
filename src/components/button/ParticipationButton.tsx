'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import ParticipationForm from '../form/ParticipationForm';
const ParticipationButton = ({
  openControl,
  children,
  party_id
}: {
  openControl: boolean;
  children: React.ReactNode;
  party_id: string;
}) => {
  const [open, setOpen] = useState(false);
  console.log('파티아이디', party_id);
  return (
    <>
      <Dialog open={open || openControl} onOpenChange={() => setOpen(true)}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>참가하기</DialogTitle>
          </DialogHeader>
          <ParticipationForm party_id={party_id} closeHandler={setOpen} />
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipationButton;
