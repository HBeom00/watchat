'use client';

import Image from 'next/image';

const Footer = () => {
  const options = 'location=no , toolbar=no , menubar =no, status=no';
  const howToUse = () => {
    window.open('https://www.notion.so/Watchat-13094dc6c14c80a3af88f2a910dd8072', 'watchat 사용법', options);
  };
  const termsOfUse = () => {
    window.open('https://www.notion.so/13094dc6c14c808984fce7846c23ef08', '이용약관', options);
  };
  const personalInformation = () => {
    window.open('https://www.notion.so/13094dc6c14c80459599d85be6ac453d', '개인정보처리방침', options);
  };
  return (
    <div className=" flex justify-between items-start  bottom-0 w-full py-12 px-48 bg-Grey-900 p-10 text-white">
      <div>
        <Image src="/logo.svg" alt="Slide3" width={142} height={24} />
        <div className="flex space-x-[8px] mt-[16px]">
          <p onClick={howToUse} className="cursor-pointer hover:underline">
            서비스 이용약관
          </p>
          <p>|</p>
          <p onClick={termsOfUse} className="cursor-pointer hover:underline">
            개인정보 처리방침
          </p>
          <p>|</p>
          <p onClick={personalInformation} className="cursor-pointer hover:underline">
            서비스 소개
          </p>
        </div>
        <p className="mt-[16px]">@2024 watchat.All rights reserved</p>
      </div>
      <div className="mt-[18px]">
        <div>
          <p className="flex justify-end text-[12px] text-Grey-300">대표이사 ojosama</p>
          <p className="flex justify-end text-[12px] text-Grey-300">이메일 team.watchat@gmail.com</p>
        </div>
        <div className="flex space-x-4 mt-4 justify-end">
          <Image src="/instagram.svg" alt="Slide3" width={24} height={24} />
          <Image src="/Vector.svg" alt="Slide3" width={24} height={24} />
          <Image src="/blog.svg" alt="Slide3" width={24} height={24} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
