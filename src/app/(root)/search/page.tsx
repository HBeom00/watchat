import Image from 'next/image';
import React from 'react';

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-2 pt-12 pb-[100px] h-[510px]">
      <Image src={'/searchCat.svg'} width={116} height={100} alt="검색 결과가 없습니다" />
      <div className="flex flex-col gap-1 ">
        <div className="flex flex-row text-center body-l-bold text-Grey-500">
          <p>검색어를 입력해주세요</p>
        </div>
      </div>
    </div>
  );
};

export default page;
