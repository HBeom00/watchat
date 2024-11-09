'use client';

import { useDetectClose } from '@/utils/hooks/useDetectClose';
import { transPlatform } from '@/utils/transPlatform';
import { Dispatch, SetStateAction, useRef } from 'react';

type Props = {
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  setPageNumber: Dispatch<SetStateAction<number>>;
};

const SelectDropBox = ({ order, setOrder, filter, setFilter, setPageNumber }: Props) => {
  const orderRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [orderOpen, setOrderOpen] = useDetectClose(orderRef, false);
  const [filterOpen, setFilterOpen] = useDetectClose(filterRef, false);

  return (
    <>
      <div className="inline-flex items-center gap-2 text-Grey-500 body-s">
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
            <div className="selectDropBox w-full">
              <button
                className={order !== 'write_time' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setOrder('write_time');
                  setPageNumber(1);
                }}
              >
                최신순
              </button>
              <button
                className={order !== 'start_date_time' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setOrder('start_date_time');
                  setPageNumber(1);
                }}
              >
                날짜순
              </button>
              <button
                className={order !== 'popularity' ? 'selectDropBoxLast' : 'selectingDropBoxLast'}
                onClick={() => {
                  setOrder('popularity');
                  setPageNumber(1);
                }}
              >
                인기순
              </button>
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
              <button
                className={filter !== '전체' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setFilter('전체');
                  setPageNumber(1);
                }}
              >
                전체
              </button>
              <button
                className={filter !== 'Netflix' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setFilter('Netflix');
                  setPageNumber(1);
                }}
              >
                넷플릭스
              </button>
              <button
                className={filter !== 'Tving' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setFilter('Tving');
                  setPageNumber(1);
                }}
              >
                티빙
              </button>
              <button
                className={filter !== 'wavve' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setFilter('wavve');
                  setPageNumber(1);
                }}
              >
                웨이브
              </button>
              <button
                className={filter !== 'Disney+Plus' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setFilter('Disney+Plus');
                  setPageNumber(1);
                }}
              >
                디즈니플러스
              </button>
              <button
                className={filter !== 'Coupang' ? 'selectDropBoxIn' : 'selectingDropBoxIn'}
                onClick={() => {
                  setFilter('Coupang');
                  setPageNumber(1);
                }}
              >
                쿠팡플레이
              </button>
              <button
                className={filter !== 'Watcha' ? 'selectDropBoxLast' : 'selectingDropBoxLast'}
                onClick={() => {
                  setFilter('Watcha');
                  setPageNumber(1);
                }}
              >
                왓챠
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SelectDropBox;
