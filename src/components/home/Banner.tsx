'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { EmblaOptionsType } from 'embla-carousel';
import { useSearchStore } from '@/providers/searchStoreProvider';

type PropType = {
  options?: EmblaOptionsType;
};
const Banner = (props: PropType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(props.options);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState(0);
  const searchText = useSearchStore((state) => state.searchText);

  // 화살표로 슬라이드를 넘기는 함수
  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSlidesInView(emblaApi.scrollSnapList().length);
    };

    emblaApi.on('select', onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <>
      {searchText === '' ? (
        <div className="embla w-full, h-full relative mt-[16px] overflow-hidden" ref={emblaRef}>
          <div className="embla_container flex  ">
            <div className="embla_slide flex flex-none w-full min-w-0 justify-around">
              <Image src="/banner_1.svg" alt="Slide1" width={1060} height={360} />
            </div>
            <div className="embla_slide flex flex-none w-full min-w-0 justify-around">
              <Image src="/banner_2.svg" alt="Slide2" width={1060} height={360} />
            </div>
            <div className="embla_slide flex flex-none w-full min-w-0 justify-around">
              <Image src="/banner_3.svg" alt="Slide3" width={1060} height={360} />
            </div>
            <div className="embla_slide flex flex-none w-full min-w-0 justify-around">
              <Image src="banner_4.svg" alt="Slide3" width={1060} height={360} />
            </div>
          </div>
          {/* 좌우 화살표 버튼 */}

          <button
            className="absolute left-[16px] top-1/2 transform -translate-y-1/2 z-10 hover:bg-white rounded-full w-[40px] h-[40px]"
            onClick={scrollPrev}
          >
            <Image src="/arrow_left_2.svg" alt="User Icon" width={24} height={24} />
          </button>
          <button
            className="absolute right-[16px] top-1/2 transform -translate-y-1/2 z-10 hover:bg-white rounded-full w-[40px] h-[40px]"
            onClick={scrollNext}
          >
            <Image src="/arrow_right_2.svg" alt="User Icon" width={24} height={24} />
          </button>

          {/* 점 네비게이션 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[...Array(slidesInView)].map((_, index) => (
              <button
                key={index}
                className={` rounded-full ${
                  index === selectedIndex ? 'bg-primary-400 w-[24px] h-[4px]' : 'bg-primary-200 w-[4px] h-[4px]'
                }`}
                onClick={() => emblaApi && emblaApi.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Banner;
