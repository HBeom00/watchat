import { platform } from '@/types/partyInfo';
import Image from 'next/image';
import React from 'react';

const PlatformImageCard = ({ platform }: { platform: platform }) => {
  return (
    <div className="flex w-7 h-7 justify-center items-center absolute right-3 top-3 rounded-full z-10 bg-static-white border-solid border-Grey-200 border-[0.438px]">
      <Image className="rounded-full p-[2px]" src={platform.logoUrl} alt={platform.name} layout="fill" />
    </div>
  );
};

export default PlatformImageCard;
