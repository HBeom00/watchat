'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import ParticipationForm from '../form/ParticipationForm';

const ParticipationButton = ({ name, party_id }: { name: string; party_id: string }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>{name}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>참가하기</DialogTitle>
          </DialogHeader>
          <ParticipationForm party_id={party_id} />
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipationButton;
