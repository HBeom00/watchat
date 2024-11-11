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
        <div className="flex w-full mt-[31.5px] mb-[29.5px] justify-center items-center">
          <div className="flex flex-row gap-1 justify-center items-center text-static-black body-xs ">
            <button onClick={() => setPageNumber(1)} className="p-[10px]" disabled={pageNumber === 1}>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10.75 0.596249L11.8038 1.65L7.20375 6.25L11.8038 10.85L10.75 11.9037L5.09625 6.25L10.75 0.596249ZM1.5 0.5L1.5 12H1.00536e-06L0 0.5L1.5 0.5Z"
                  fill="#2A2A2A"
                />
              </svg>
            </button>
            <button
              onClick={() => setPageNumber((now) => (now !== 1 ? now - 1 : now))}
              className="px-3 py-[10px]"
              disabled={pageNumber === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="13" viewBox="0 0 7 13" fill="none">
                <path
                  d="M2.1075 6.50043L6.7075 11.1004L5.65375 12.1542L0 6.50043L5.65375 0.84668L6.7075 1.90043L2.1075 6.50043Z"
                  fill="#2A2A2A"
                />
              </svg>
            </button>
            {Array.from({ length: pageData })
              .map((arr, i) => {
                return i + 1;
              })
              .map((page) => {
                return (
                  <button
                    className={
                      page === pageNumber
                        ? 'flex w-8 h-8 bg-primary-400 rounded-full justify-center items-center self-stretch text-static-white text-center'
                        : 'flex w-8 h-8 justify-center items-center self-stretch text-center'
                    }
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
              <svg xmlns="http://www.w3.org/2000/svg" width="7" height="13" viewBox="0 0 7 13" fill="none">
                <path
                  d="M4.6 6.50043L0 1.90043L1.05375 0.84668L6.7075 6.50043L1.05375 12.1542L0 11.1004L4.6 6.50043Z"
                  fill="#2A2A2A"
                />
              </svg>
            </button>
            <button
              onClick={() => setPageNumber(pageData ? pageData : 1)}
              className="p-[10px]"
              disabled={pageNumber === pageData}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M1.05375 11.9038L0 10.85L4.6 6.25L0 1.65L1.05375 0.596249L6.7075 6.25L1.05375 11.9038ZM10.3038 12V0.5H11.8038V12H10.3038Z"
                  fill="#2A2A2A"
                />
              </svg>
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
