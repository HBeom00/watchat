import { useMediaQuery } from '@/utils/hooks/useMediaQuery';
import Image from 'next/image';
import { RefObject } from 'react';

type Props = {
  state: string;
  stateArr: string[];
  display: (n: string) => string;
  onClick: (n: string) => void;
  openRef: RefObject<HTMLDivElement>;
  open: boolean;
  setOpen: () => void;
};

const DropDownBox = ({ state, stateArr, display, onClick, openRef, open, setOpen }: Props) => {
  const isMobile = useMediaQuery('(max-width:480px)');
  return (
    <>
      <div ref={openRef} className={`relative`}>
        <button onClick={setOpen} className="selectBox">
          <p>{display(state)}</p>
          <Image src={'/pageArrow/dropdown_arrow.svg'} width={16} height={16} alt="드롭다운" />
        </button>
        {open && !isMobile && (
          <div className={`selectDropBox w-full`}>
            <div className={`flex flex-col w-full items-center justify-center self-stretch`}>
              {stateArr.map((n, i) => {
                return (
                  <button
                    key={n}
                    className={
                      state !== n
                        ? stateArr.length - 1 === i
                          ? 'selectDropBoxLast'
                          : 'selectDropBoxIn'
                        : stateArr.length - 1 === i
                        ? 'selectingDropBoxLast'
                        : 'selectingDropBoxIn'
                    }
                    onClick={() => onClick(n)}
                  >
                    {display(n) === '구독 채널' ? '전체' : display(n)}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropDownBox;
