'use client';

import { useDetectClose } from '@/utils/hooks/useDetectClose';
import { transPlatform } from '@/utils/transPlatform';
import Image from 'next/image';
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
    <div className="py-[32px] mobile:py-[16px]">
      <div className="inline-flex items-center gap-[8px] text-Grey-500 body-s">
        {/* 정렬 드롭다운 박스 */}
        <div ref={orderRef} className="relative z-20">
          <button onClick={() => setOrderOpen(!orderOpen)} className="selectBox">
            <p>{order === 'write_time' ? '최신순' : order === 'start_date_time' ? '날짜순' : '인기순'}</p>
            <Image src={'/pageArrow/dropdown_arrow.svg'} width={16} height={16} alt="정렬" />
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
            <Image src={'/pageArrow/dropdown_arrow.svg'} width={16} height={16} alt="정렬" />
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
    </div>
  );
};

export default SelectDropBox;
