'use client';

import browserClient from '@/utils/supabase/client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Notify = ({ roomId }: { roomId: string }) => {
  const [specialMessage, setSpecialMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkEventTime = async () => {
      const { data, error } = await browserClient
        .from('party_info')
        .select('watch_date, start_time')
        .eq('party_id', roomId)
        .single();

      if (error) {
        console.error('Error fetching event time:', error);
        return;
      }

      const watchDate = data?.watch_date;
      const startTime = data?.start_time?.split('.')[0];

      if (watchDate && startTime) {
        const eventDateTime = new Date(`${watchDate}T${startTime}`);
        const tenMinutesBefore = new Date(eventDateTime.getTime() - 10 * 60 * 1000);

        const intervalId = setInterval(() => {
          const now = new Date();

          if (now >= eventDateTime) {
            setSpecialMessage('다들 영상을 재생해주세요.');
            clearInterval(intervalId); // 이벤트 시간이 지나면 타이머 중지
          } else if (now >= tenMinutesBefore && now < eventDateTime) {
            setSpecialMessage('곧 영상이 시작합니다. 자리에 착석해 주세요.');
          } else {
            setSpecialMessage('시작 전 입니다.'); // 아무 메시지도 필요하지 않으면 null로 설정
          }
        }, 1000); // 1초마다 확인

        return () => clearInterval(intervalId);
      }
    };

    checkEventTime();
  }, [roomId]);

  return (
    <>
      {specialMessage && (
        <div
          className={`
        w-[700px] p-[16px] flex flex-col items-start bg-Grey-50
        mobile:w-[375px]
        `}
        >
          <div className="flex py-[16px] justify-center items-center self-stretch rounded-lg bg-white box-shadow">
            <div className="flex flex-col justify-center items-center gap-[4px]">
              <Image src="/schedule.svg" alt="schedule" width={24} height={24} className="w-[24px] h-[24px]" />
              <p className="body-xs text-center text-Grey-900">{specialMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notify;
