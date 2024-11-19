'use client';

import { Dispatch, SetStateAction } from 'react';

import type { filter, order } from '@/types/filter';
import DropDownBox from './DropDownBox';

type Props = {
  order: order;
  setOrder: Dispatch<SetStateAction<order>>;
  filter: filter;
  setFilter: Dispatch<SetStateAction<filter>>;
  setPageNumber: Dispatch<SetStateAction<number>>;
};

const SelectDropBox = ({ order, setOrder, filter, setFilter, setPageNumber }: Props) => {
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
    <div className="py-[32px] mobile:py-[16px]">
      <div className="inline-flex items-center gap-[8px] text-Grey-500 body-s">
        {/* 정렬 드롭다운 박스 */}
        <DropDownBox
          state={order}
          stateArr={orderArr}
          display={orderConversion as (n: string) => string}
          onClick={(n: string) => setOrder(n as order)}
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
        />
      </div>
    </div>
  );
};

export default SelectDropBox;
