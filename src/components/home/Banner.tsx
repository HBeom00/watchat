'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const Banner = () => {
  const params = useSearchParams();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState(0);

  const filter = params.get('watch');
  const searchText = params.get('search');

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  // 자동 슬라이드 설정
  useEffect(() => {
    if (!emblaApi) return;

    const autoScroll = () => emblaApi.scrollNext();
    const interval = setInterval(autoScroll, 3000); // 3초마다 자동 슬라이드 이동

    // 슬라이드가 선택될 때마다 상태 업데이트
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSlidesInView(emblaApi.scrollSnapList().length);
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, [emblaApi]);

  const options = 'location=no , toolbar=no , menubar =no, status=no';

  const howToUse = () => {
    window.open(
      'https://honorable-navy-810.notion.site/Watchat-136dbe6b3f7580df8ab0da274b276df9?pvs=4',
      'watchat 사용법',
      options
    );
  };
  const howToJoin = () => {
    window.open('https://honorable-navy-810.notion.site/Step-2-af09e8195ee44ad8beca2d1fc65f8236', '참여하기', options);
  };
  const howToRecuit = () => {
    window.open('https://honorable-navy-810.notion.site/Step-3-97b156c2053c43d380fa20b5ba2a9a47', '모집하기', options);
  };
  const howToFollow = () => {
    window.open(
      'https://honorable-navy-810.notion.site/step-4-f4c22aecb9b54bcba08579d610652473',
      '메이트만들기',
      options
    );
  };

  return (
    <>
      {(searchText === '' || searchText === null) && (filter === '' || filter === null) ? (
        <div className="embla  relative mt-[16px] overflow-hidden" ref={emblaRef}>
          <div className="embla_container flex">
            <div className="embla_slide banner ">
              <Image
                src="/banner/banner_1.jpg"
                alt="Slide1"
                width={1060}
                height={360}
                onClick={howToJoin}
                className="block mobile:hidden"
              />
              <Image
                src="/banner/mobile_banner_1.jpg"
                alt="Slide1"
                width={335}
                height={360}
                onClick={howToJoin}
                className="hidden mobile:block"
              />
            </div>

            <div className="embla_slide banner block mobile:hidden">
              <Image
                src="/banner/banner_2.jpg"
                alt="Slide2"
                width={1060}
                height={360}
                onClick={howToRecuit}
                className="block mobile:hidden"
              />
              <Image
                src="/banner/mobile_banner_2.jpg"
                alt="Slide2"
                width={335}
                height={360}
                onClick={howToRecuit}
                className="hidden mobile:block"
              />
            </div>

            <div className="embla_slide banner block mobile:hidden">
              <Image
                src="/banner/banner_3.jpg"
                alt="Slide3"
                width={1060}
                height={360}
                onClick={howToFollow}
                className="block mobile:hidden"
              />
              <Image
                src="/banner/mobile_banner_3.jpg"
                alt="Slide3"
                width={335}
                height={360}
                onClick={howToFollow}
                className="hidden mobile:block"
              />
            </div>

            <div className="embla_slide banner block mobile:hidden">
              <Image
                src="/banner/banner_4.jpg"
                alt="Slide4"
                width={1060}
                height={360}
                onClick={howToUse}
                className="block mobile:hidden"
              />
              <Image
                src="/banner/mobile_banner_4.jpg"
                alt="Slide4"
                width={335}
                height={360}
                onClick={howToUse}
                className="hidden mobile:block"
              />
            </div>
          </div>

          {/* 좌우 화살표 버튼 */}
          <button
            className="absolute left-[16px] top-1/2 transform -translate-y-1/2 z-10 hover:bg-white rounded-full w-[40px] h-[40px] flex justify-center items-center mobile:hidden"
            onClick={scrollPrev}
          >
            <Image src="/arrow_left_2.svg" alt="User Icon" width={24} height={24} />
          </button>
          <button
            className="absolute right-[16px] top-1/2 transform -translate-y-1/2 z-10 hover:bg-white rounded-full w-[40px] h-[40px] flex justify-center items-center mobile:hidden"
            onClick={scrollNext}
          >
            <Image src="/arrow_right_2.svg" alt="User Icon" width={24} height={24} className="ml-[5px]" />
          </button>

          {/* 점 네비게이션 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[...Array(slidesInView)].map((_, index) => (
              <button
                key={index}
                className={`rounded-full ${
                  index === selectedIndex ? 'bg-primary-400 w-[24px] h-[4px]' : 'bg-primary-200 w-[4px] h-[4px]'
                }`}
                onClick={() => emblaApi && emblaApi.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Banner;
