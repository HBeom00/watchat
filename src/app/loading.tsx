'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

const Loading: React.FC = () => {
  useEffect(() => {
    const timeline = gsap.timeline({ repeat: -1 }); // 무한 반복

    timeline
      .to('.dot', {
        y: -10, // 위로 이동
        duration: 0.5,
        ease: 'power1.inOut',
        stagger: 0.2 // 점 3개가 순서대로
      })
      .to('.dot', {
        y: 0, // 원래 위치로 돌아오기
        duration: 0.5,
        ease: 'power1.inOut',
        stagger: 0.2
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="dot w-2 h-2 bg-primary-400 rounded-full mx-1"></div>
      <div className="dot w-2 h-2 bg-primary-400 rounded-full mx-1"></div>
      <div className="dot w-2 h-2 bg-primary-400 rounded-full mx-1"></div>
    </div>
  );
};

export default Loading;
