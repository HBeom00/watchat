'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { useCallback } from 'react';
const RecruitFilter = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const filter = searchParams.get('watch');

  const filtering = pathname === '/' || pathname.startsWith('/search');

  return (
    <div
      className={`flex flex-row h-[24px] gap-[24px] items-center title-m
    mobile:gap-[16px] mobile:body-l-bold`}
    >
      <Link
        href={filtering ? pathname + '?' + createQueryString('watch', '') : '/?' + createQueryString('watch', '')}
        className={
          filter === '' || filter === null ? 'text-Grey-900 mobile:text-[16px]' : 'text-Grey-400 mobile:text-[16px]'
        }
      >
        전체
      </Link>
      <Link
        href={
          filtering
            ? pathname + '?' + createQueryString('watch', 'current')
            : '/?' + createQueryString('watch', 'current')
        }
        className={filter === 'current' ? 'text-Grey-900 mobile:text-[16px]' : 'text-Grey-400 mobile:text-[16px]'}
      >
        시청중
      </Link>
      <Link
        href={
          filtering
            ? pathname + '?' + createQueryString('watch', 'recruiting')
            : '/?' + createQueryString('watch', 'recruiting')
        }
        className={filter === 'recruiting' ? 'text-Grey-900 mobile:text-[16px]' : 'text-Grey-400 mobile:text-[16px]'}
      >
        모집중
      </Link>
    </div>
  );
};

export default RecruitFilter;
