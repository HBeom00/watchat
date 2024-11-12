import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '../ui/Button';
import infoIcon from '../../../public/info.svg';
import Image from 'next/image';

export const MyTooltip = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Image src={infoIcon} width={16} height={16} alt="툴팁" className="cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent>
          <p>후기에 작성된 평가로 온도가 결정돼요</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
