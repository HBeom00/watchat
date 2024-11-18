import { useDetectClose } from '@/utils/hooks/useDetectClose';
import Image from 'next/image';
import React, { useRef } from 'react';

type Props = { state: string; stateArr: string[]; display: (n: string) => string; onClick: (n: string) => void };

const DropDownBox = ({ state, stateArr, display, onClick }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useDetectClose(ref, false);
  return (
    <>
      <div
        className={`hidden ${
          open &&
          'mobile:flex mobile:fixed mobile:z-40 mobile:top-0 mobile:left-0 mobile:right-0 mobile:bottom-0 mobile:bg-[rgba(0,0,0,0.50)]'
        }`}
      ></div>
      <div ref={ref} className={`relative`}>
        <button onClick={() => setOpen(!open)} className="selectBox">
          <p>{display(state)}</p>
          <Image src={'/pageArrow/dropdown_arrow.svg'} width={16} height={16} alt="드롭다운" />
        </button>
        {open && (
          <div
            className={`selectDropBox w-full
        mobile:h-[250px] mobile:fixed mobile:z-50 mobile:bottom-0 mobile:left-0 mobile:right-0 
        mobile:w-full mobile:rounded-b-none mobile:items-start mobile:justify-start`}
          >
            <div
              className={`hidden flex-row pt-[32px] pb-[16px] px-[20px]
          mobile:flex`}
            ></div>
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
                    onClick={() => onClick(n)}
                  >
                    {display(n) === '구독 채널' ? '전체' : display(n)}
                  </button>
                );
              })}
            </div>
            <div
              onClick={() => setOpen(false)}
              className={`hidden absolute bottom-0 w-full px-[16px] border-solid border-Grey-50 border-t-[1px]
              mobile:flex`}
            >
              <div className="flex py-[12px] px-[24px] justify-center items-center flex-1 text-Grey-400">닫기</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropDownBox;
