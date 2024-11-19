'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';

import { Dispatch, SetStateAction, useRef, useState } from 'react';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger
} from '../ui/Dialog';
import { filter, order } from '@/types/filter';

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  order: order;
  filter: filter;
  setOrder: Dispatch<SetStateAction<order>>;
  setFilter: Dispatch<SetStateAction<filter>>;
  orderArr: string[];
  filterArr: string[];
  orderConversion: (n: string) => string;
  filterConversion: (n: string) => string;
};

const MobileSelect = ({
  open,
  setOpen,
  order,
  filter,
  setOrder,
  setFilter,
  orderArr,
  filterArr,
  orderConversion,
  filterConversion
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tab, setTab] = useState<'order' | 'filter'>('order');

  // 모바일 용 order filter 구분 함수
  const stateArr = tab === 'order' ? orderArr : filterArr;
  const state = tab === 'order' ? order : filter;
  const display: (n: string) => string =
    tab === 'order' ? (orderConversion as (n: string) => string) : (filterConversion as (n: string) => string);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative hidden
        mobile:flex `}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="hidden">셀렉트</DialogTrigger>
          <DialogPortal container={containerRef.current}>
            {/* 검은 배경 */}
            <DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
            {/* 내용 */}
            <DialogPrimitive.Content className="fixed left-[50%] bottom-0 w-full z-50 rounded-t-[8px] translate-x-[-50%] translate-y-[0%] bg-static-white transform">
              {/* 제목 */}
              <DialogHeader className="hidden">
                <DialogTitle></DialogTitle>
              </DialogHeader>

              <>
                <div
                  className={`selectDropBox w-full
        mobile:h-[288px] mobile:fixed mobile:z-50 mobile:bottom-0 mobile:left-0 mobile:right-0 
        mobile:w-full mobile:rounded-b-none mobile:items-start mobile:justify-start`}
                >
                  <div className="w-[36px] h-[5px] absolute right-[169px] top-[16px] rounded-[2.5px] bg-Grey-100"></div>
                  {/* 탭 */}
                  <div
                    className={`flex flex-row p-[32px_20px_16px_20px] items-start self-stretch body-m-bold text-Grey-400`}
                  >
                    <p
                      onClick={() => setTab('order')}
                      className={`flex p-[8px_16px] justify-center items-center 
                          ${tab === 'order' && 'border-solid border-Grey-900 border-b-[2px] text-Grey-900'}`}
                    >
                      나열순
                    </p>
                    <p
                      onClick={() => setTab('filter')}
                      className={`flex p-[8px_16px] justify-center items-center
                        ${tab === 'filter' && 'border-solid border-Grey-900 border-b-[2px] text-Grey-900'}`}
                    >
                      채널
                    </p>
                  </div>
                  {/* 필터 */}
                  <div
                    className={`flex flex-col w-full items-center justify-center self-stretch
             mobile:flex-row mobile:flex-wrap mobile:items-start mobile:justify-start
             mobile:gap-[8px] mobile:px-[20px]`}
                  >
                    {stateArr.map((n, i) => {
                      return (
                        <button
                          key={n}
                          className={
                            state !== n
                              ? stateArr.length - 1 === i
                                ? 'selectDropBoxLast mobile:body-s'
                                : 'selectDropBoxIn'
                              : stateArr.length - 1 === i
                              ? 'selectingDropBoxLast mobile:body-s'
                              : 'selectingDropBoxIn'
                          }
                          onClick={() => {
                            if (tab === 'order') {
                              setOrder(n as order);
                            } else if (tab === 'filter') {
                              setFilter(n as filter);
                            }
                          }}
                        >
                          {display(n) === '구독 채널' ? '전체' : display(n)}
                        </button>
                      );
                    })}
                  </div>
                  {/* 닫기 */}
                  <div
                    onClick={() => setOpen(false)}
                    className={`flex absolute bottom-0 w-full px-[16px] border-solid border-Grey-50 border-t-[1px]`}
                  >
                    <div className="flex py-[12px] px-[24px] justify-center items-center flex-1 text-Grey-400">
                      닫기
                    </div>
                  </div>
                </div>
              </>
              <DialogDescription></DialogDescription>
            </DialogPrimitive.Content>
          </DialogPortal>
        </Dialog>
      </div>
    </>
  );
};

export default MobileSelect;
