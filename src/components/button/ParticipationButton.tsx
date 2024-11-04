'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import ParticipationForm from '../form/ParticipationForm';
const ParticipationButton = ({
  openControl,
  children,
  party_id,
  party_situation
}: {
  openControl: boolean;
  children: React.ReactNode;
  party_id: string;
  party_situation: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [display, setDisplay] = useState<boolean>(true);
  return (
    <>
      <Dialog open={open || openControl} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-[380px] p-0 gap-0">
          <DialogHeader className="flex py-6">{display ? <DialogTitle>파티 프로필</DialogTitle> : <></>}</DialogHeader>
          <ParticipationForm
            party_id={party_id}
            party_situation={party_situation}
            closeHandler={setOpen}
            setDisplay={setDisplay}
          />
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipationButton;
