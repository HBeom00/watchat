'use client';

import { Dispatch, SetStateAction, useRef, useState } from 'react';

import type { filter, order } from '@/types/filter';
import DropDownBox from './DropDownBox';
import { useDetectClose } from '@/utils/hooks/useDetectClose';
import MobileSelect from './MobileSelect';
import { useMediaQuery } from '@/utils/hooks/useMediaQuery';

type Props = {
  order: order;
  setOrder: Dispatch<SetStateAction<order>>;
  filter: filter;
  setFilter: Dispatch<SetStateAction<filter>>;
  setPageNumber: Dispatch<SetStateAction<number>>;
};

const SelectDropBox = ({ order, setOrder, filter, setFilter, setPageNumber }: Props) => {
  const isMobile = useMediaQuery('(max-width:480px)');
  // 오더 오픈클로즈
  const orderRef = useRef<HTMLDivElement>(null);
  const [orderOpen, setOrderOpen] = useDetectClose(orderRef, false);

  // 필터 오픈클로즈
  const filterRef = useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = useDetectClose(filterRef, false);

  // 모바일
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  // 정렬 순 배열과 한영 변환 함수
  const orderArr: order[] = ['write_time', 'start_date_time', 'popularity'];
  const orderConversion = (order: order) => {
    if (order === 'write_time') {
      return '최신순';
    }
    if (order === 'start_date_time') {
      return '날짜순';
    }
    if (order === 'popularity') {
      return '인기순';
    }
    return '최신순';
  };

  // 플랫폼 필터 배열과 한영 변환
  const filterArr: filter[] = ['전체', 'Netflix', 'Tving', 'wavve', 'Disney+Plus', 'Coupang', 'Watcha'];
  const filterConversion = (filter: filter) => {
    if (filter === 'Netflix') return '넷플릭스';

    if (filter === 'Tving') return '티빙';
    if (filter === 'wavve') return '웨이브';
    if (filter === 'Disney+Plus') return '디즈니플러스';
    if (filter === 'Coupang') return '쿠팡플레이';
    if (filter === 'Watcha') return '왓챠';
    return '구독 채널';
  };

  return (
    <>
      <div className="py-[32px] mobile:py-[16px]">
        <div className="inline-flex items-center gap-[8px] text-Grey-500 body-s">
          {/* 정렬 드롭다운 박스 */}
          <DropDownBox
            state={order}
            stateArr={orderArr}
            display={orderConversion as (n: string) => string}
            onClick={(n: string) => setOrder(n as order)}
            openRef={orderRef}
            open={orderOpen}
            setOpen={() => {
              setOrderOpen(true);
              setMobileOpen(true);
            }}
          />
          {/* 필터 드롭다운 박스 */}
          <DropDownBox
            state={filter}
            stateArr={filterArr}
            display={filterConversion as (n: string) => string}
            onClick={(n: string) => {
              setFilter(n as filter);
              setPageNumber(1);
            }}
            openRef={filterRef}
            open={filterOpen}
            setOpen={() => {
              setFilterOpen(true);
              setMobileOpen(true);
            }}
          />
        </div>
      </div>
      {/* 모바일용 */}
      {isMobile ? (
        <MobileSelect
          open={mobileOpen}
          setOpen={setMobileOpen}
          order={order}
          filter={filter}
          setOrder={setOrder}
          setFilter={setFilter}
          orderArr={orderArr}
          filterArr={filterArr}
          orderConversion={orderConversion as (n: string) => string}
          filterConversion={filterConversion as (n: string) => string}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default SelectDropBox;
