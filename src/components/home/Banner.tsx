"use client"

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'

const Banner = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align:"center" })
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState(0);

 // 화살표로 슬라이드를 넘기는 함수
 const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
 const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setSlidesInView(emblaApi.scrollSnapList().length);
    }

    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi])

  return (
  <div 
  className='embla w-[1060px], h-[360px] relative' 
  ref={emblaRef}
  >
    <div className='embla_container flex w-[100%]'>
      <div className='embla_slide flex justify-center items-center bg-gray-300 '>
        <Image src="" 
        alt='Slide1' width={1060} height={360}/>
      </div>
      <div className='embla_slide'>
      <div className='embla_slide flex justify-center items-center bg-gray-500 '>
        <Image src="" 
        alt='Slide2' width={1060} height={360}/>
      </div>
      </div>
      <div className='embla_slide'>
      <div className='embla_slide flex justify-center items-center bg-gray-700 '>
        <Image src="" 
        alt='Slide3' width={1060} height={360}/>
      </div>
      </div>
      </div>
        {/* 좌우 화살표 버튼 */}
        
        <button 
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
        onClick={scrollPrev}
      >
        ◀
      </button>
      <button 
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
        onClick={scrollNext}
      >
        ▶
      </button>

{/* 점 네비게이션 */}
<div className="flex justify-center mt-4 space-x-2">
        {[...Array(slidesInView)].map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === selectedIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          />
        ))}
      </div>
  </div>
);
};

export default Banner;
