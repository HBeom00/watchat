import { NextButton, PrevButton } from '@/store/useMypageCarouselButton';
import Image from 'next/image';
import arrow_forward_ios from '../../../public/arrow_forward_ios.svg';
import arrow_back_ios from '../../../public/arrow_back_ios.svg';
import { EmblaViewportRefType } from 'embla-carousel-react';

interface MyCarouselProps {
  emblaRef: EmblaViewportRefType;
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
}

export const MyCarousel: React.FC<MyCarouselProps> = ({
  prevBtnDisabled,
  nextBtnDisabled,
  onPrevButtonClick,
  onNextButtonClick
}) => {
  return (
    <div className="embla_controls">
      <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className="absolute top-[50%] -left-10">
        <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-Grey-50 cursor-pointer transition duration-300">
          <Image src={arrow_back_ios} width={12} height={20} alt="arrow_back_ios" />
        </div>
      </PrevButton>
      <NextButton
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
        className="absolute top-[50%] -right-10 rounded-full hover:bg-Grey-50 cursor-pointer transition duration-300"
      >
        <div className="w-10 h-10 flex items-center justify-center">
          <Image src={arrow_forward_ios} width={12} height={20} alt="arrow_forward_ios" />
        </div>
      </NextButton>
    </div>
  );
};
