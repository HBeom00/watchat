'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ComponentLoading: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null); // 컨테이너 참조

  useEffect(() => {
    const container = containerRef.current;

    // container가 null이면 실행 중단
    if (!container) return;

    // container 내의 .dot 요소만 선택
    const dots = container.querySelectorAll('.dot');

    // 애니메이션 할 요소가 없으면 실행 중단
    if (dots.length === 0) return;

    const timeline = gsap.timeline({ repeat: -1 });

    timeline
      .to(dots, {
        y: -10, // 위로 이동
        duration: 0.5,
        ease: 'power1.inOut',
        stagger: 0.2 // 점 3개가 순서대로
      })
      .to(dots, {
        y: 0, // 원래 위치로 돌아오기
        duration: 0.5,
        ease: 'power1.inOut',
        stagger: 0.2
      });

    return () => {
      timeline.kill(); // 컴포넌트 unmount 시 타임라인 정리
    };
  }, []);

  return (
    <div ref={containerRef} className="flex justify-center items-center">
      <div className="dot w-2 h-2 bg-primary-400 rounded-full mx-1"></div>
      <div className="dot w-2 h-2 bg-primary-400 rounded-full mx-1"></div>
      <div className="dot w-2 h-2 bg-primary-400 rounded-full mx-1"></div>
    </div>
  );
};

export default ComponentLoading;
