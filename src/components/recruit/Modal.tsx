import Image from 'next/image';
import React from 'react';

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
      <div className="relative w-full h-full bg-white flex flex-col">
        {/* 상단 바 */}
        <div className="flex items-center justify-between p-4 ">
          <button onClick={onClose} className="flex items-center">
            <Image src="/arrow_back_black.svg" alt="뒤로가기" width={24} height={24} />
          </button>
          <p className="text-[16px] font-semibold">검색하기</p>
          <div style={{ width: '24px', height: '24px' }}></div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
