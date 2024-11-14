import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/Dialog';
import { MyTooltip } from './Tooltip';
import { WarmingProgress } from './WarmingProgress';
import Image from 'next/image';
import group from '../../../public/primaryGroup.svg';
import { useWarming } from '@/store/useWarming';

const WarmingModal = (userId: string | undefined) => {
  // if (!userId) {
  //   return null;
  // }
  const { data: totalTemperature } = useWarming(userId);

  return (
    <Dialog>
      <DialogTrigger>
        <div className="flex flex-row gap-[8px] items-center">
          <p className="body-xs">식빵온도</p>
          <MyTooltip />
          <p className="body-xs-bold text-primary-400">{totalTemperature}℃</p>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[340px] gap-0">
        <DialogHeader>
          <DialogTitle className="pb-[16px]">식빵온도</DialogTitle>
        </DialogHeader>
        <div className="flex flex-row justify-between mb-[8px]">
          <span className="body-xs text-Grey-600">따뜻한 빵</span>
          <p className="body-xs-bold text-primary-400">{totalTemperature}℃</p>
        </div>
        <WarmingProgress />
        <ul className="mt-[16px] flex flex-col gap-8px">
          <li className="bg-Grey-50 p-[8px] flex flex-row gap-[16px]">
            <div className="flex flex-row gap-[4px] body-s text-primary-400">
              <Image src={group} width={24} height={24} alt="group" />
              <span>d</span>
            </div>
            <p className="body-s">시간 약속을 잘 지켜요</p>
          </li>
        </ul>
        <DialogDescription></DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default WarmingModal;
