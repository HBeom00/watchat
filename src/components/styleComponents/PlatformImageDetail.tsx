import { platform } from '@/types/partyInfo';
import Image from 'next/image';

const PlatformImageDetail = ({ platform }: { platform: platform }) => {
  return (
    <div className="flex w-12 h-12 justify-center items-center relative rounded-full bg-static-white border-solid border-Grey-200 border-[0.75px]">
      <Image className="rounded-full p-[3.43px]" src={platform.logoUrl} alt={platform.name} fill />
    </div>
  );
};

export default PlatformImageDetail;
