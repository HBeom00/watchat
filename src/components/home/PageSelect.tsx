import Image from 'next/image';
import React, { SetStateAction } from 'react';

const PageSelect = ({
  pageData,
  pageNumber,
  setPageNumber
}: {
  pageData: number | undefined;
  pageNumber: number;
  setPageNumber: (value: SetStateAction<number>) => void;
}) => {
  return (
    <>
      {pageData ? (
        <div className="flex w-full my-[48px] justify-center items-center">
          <div className="flex flex-row gap-1 justify-center items-center text-static-black body-xs ">
            <button onClick={() => setPageNumber(1)} className="p-[10px]" disabled={pageNumber === 1}>
              <Image
                src={`/pageArrow/${pageNumber === 1 ? 'double_left_arrow_disabled' : 'double_left_arrow'}.svg`}
                width={12}
                height={12}
                alt="처음으로"
              />
            </button>
            <button
              onClick={() => setPageNumber((now) => (now !== 1 ? now - 1 : now))}
              className="px-3 py-[10px]"
              disabled={pageNumber === 1}
            >
              <Image
                src={`/pageArrow/${pageNumber === 1 ? 'left_arrow_disabled' : 'left_arrow'}.svg`}
                width={7}
                height={13}
                alt="이전페이지"
              />
            </button>
            {Array.from({ length: pageData })
              .map((arr, i) => {
                return i + 1;
              })
              .map((page) => {
                return (
                  <button
                    className={`flex w-8 h-8 justify-center items-center self-stretch text-center rounded-full ${
                      page === pageNumber ? 'bg-primary-400  text-static-white' : 'hover:bg-Grey-50'
                    }`}
                    key={page}
                    onClick={() => setPageNumber(page)}
                  >
                    {page}
                  </button>
                );
              })}
            <button
              onClick={() => setPageNumber((now) => (now !== pageData ? now + 1 : now))}
              className="px-3 py-[10px]"
              disabled={pageNumber === pageData}
            >
              <Image
                src={`/pageArrow/${pageNumber === pageData ? 'right_arrow_disabled' : 'right_arrow'}.svg`}
                width={7}
                height={13}
                alt="다음페이지"
              />
            </button>
            <button
              onClick={() => setPageNumber(pageData ? pageData : 1)}
              className="p-[10px]"
              disabled={pageNumber === pageData}
            >
              <Image
                src={`/pageArrow/${pageNumber === pageData ? 'double_right_arrow_disabled' : 'double_right_arrow'}.svg`}
                width={12}
                height={12}
                alt="마지막으로"
              />
            </button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default PageSelect;
