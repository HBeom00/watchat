'use client';

import { useDetectClose } from '@/utils/hooks/useDetectClose';
import { transPlatform } from '@/utils/transPlatform';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

const SelectDropBox = () => {
  const orderRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [orderOpen, setOrderOpen] = useDetectClose(orderRef, false);
  const [filterOpen, setFilterOpen] = useDetectClose(filterRef, false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const order = searchParams.get('order');
  const filter = searchParams.get('filter');

  useEffect(() => {
    if (order !== null || filter !== null) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    }
    setOrderOpen(false);
    setFilterOpen(false);
  }, [order, filter]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  return (
    <>
      <div className="inline-flex items-center gap-2 text-Grey-500 body-s" ref={scrollRef}>
        {/* 정렬 드롭다운 박스 */}
        <div ref={orderRef} className="relative z-20">
          <button onClick={() => setOrderOpen(!orderOpen)} className="selectBox">
            <p>{order === 'write_time' ? '최신순' : order === 'start_date_time' ? '날짜순' : '인기순'}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
              <mask id="mask0_1043_34855" maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="16">
                <rect x="0.5" width="16" height="16" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1043_34855)">
                <path
                  d="M8.27503 10.1846L4.50586 6.41539L5.20836 5.71289L8.27503 8.77956L11.3417 5.71289L12.0442 6.41539L8.27503 10.1846Z"
                  fill="#8F8F8F"
                />
              </g>
            </svg>
          </button>
          {orderOpen && (
            <div className="selectDropBox">
              {order !== 'write_time' ? (
                <Link
                  href={'/?' + createQueryString('order', 'write_time') + '#recruitList'}
                  className="selectDropBoxIn"
                >
                  최신순
                </Link>
              ) : (
                <></>
              )}
              {order !== 'start_date_time' ? (
                <Link
                  href={'/?' + createQueryString('order', 'start_date_time')}
                  className={order === 'popularity' ? 'selectDropBoxLast' : 'selectDropBoxIn'}
                >
                  날짜순
                </Link>
              ) : (
                <></>
              )}
              {order !== 'popularity' ? (
                <Link href={'/?' + createQueryString('order', 'popularity')} className="selectDropBoxLast">
                  인기순
                </Link>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
        {/* 필터 드롭다운 박스 */}
        <div ref={filterRef} className="relative z-20">
          <button onClick={() => setFilterOpen(!filterOpen)} className="selectBox">
            <p>{transPlatform(filter)}</p>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
              <mask id="mask0_1043_34855" maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="16">
                <rect x="0.5" width="16" height="16" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1043_34855)">
                <path
                  d="M8.27503 10.1846L4.50586 6.41539L5.20836 5.71289L8.27503 8.77956L11.3417 5.71289L12.0442 6.41539L8.27503 10.1846Z"
                  fill="#8F8F8F"
                />
              </g>
            </svg>
          </button>
          {filterOpen && (
            <div className="selectDropBox">
              {filter !== 'all' ? (
                <Link href={'/?' + createQueryString('filter', 'all')} className="selectDropBoxIn">
                  전체
                </Link>
              ) : (
                <></>
              )}
              {filter !== 'Netflix' ? (
                <Link href={'/?' + createQueryString('filter', 'Netflix')} className="selectDropBoxIn">
                  넷플릭스
                </Link>
              ) : (
                <></>
              )}
              {filter !== 'Tving' ? (
                <Link href={'/?' + createQueryString('filter', 'Tving')} className="selectDropBoxIn">
                  티빙
                </Link>
              ) : (
                <></>
              )}
              {filter !== 'wavve' ? (
                <Link href={'/?' + createQueryString('filter', 'wavve')} className="selectDropBoxIn">
                  웨이브
                </Link>
              ) : (
                <></>
              )}
              {filter !== 'Disney+Plus' ? (
                <Link href={'/?' + createQueryString('filter', 'Disney+Plus')} className="selectDropBoxIn">
                  디즈니플러스
                </Link>
              ) : (
                <></>
              )}
              {filter !== 'Coupang' ? (
                <Link
                  href={'/?' + createQueryString('filter', 'Coupang')}
                  className={filter === 'Watcha' ? 'selectDropBoxLast' : 'selectDropBoxIn'}
                >
                  쿠팡플레이
                </Link>
              ) : (
                <></>
              )}
              {filter !== 'Watcha' ? (
                <Link href={'/?' + createQueryString('filter', 'Watcha')} className="selectDropBoxLast">
                  왓챠
                </Link>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectDropBox;
