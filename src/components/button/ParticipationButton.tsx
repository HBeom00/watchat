'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import ParticipationForm from '../form/ParticipationForm';

const ParticipationButton = ({ party_id }: { party_id: string }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>참가하기</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팔로우한 사람</DialogTitle>
          </DialogHeader>
          <ParticipationForm party_id={party_id} />
          <DialogDescription></DialogDescription>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParticipationButton;
