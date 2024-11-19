import React from 'react';
import { ModalProps } from '@/types/custom';
import Image from 'next/image';

const NotificationModal: React.FC<ModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white rounded-lg  w-[340px] h-[174px] w-max-[340px] h-max-[174px]">
        <button onClick={onClose} className="absolute top-3 right-3 text-Grey-800">
          <Image src="/close.svg" alt="close" width={24} height={24} />
        </button>
        <h2 className="text-center text-[14px] font-Regular py-[16px] mt-[45px]">{message}</h2>
        <div className="flex items-center justify-center ">
          <button
            onClick={onClose}
            className="w-full h-[48px] mt-[30px]  border-t-[1px]  border-t-Grey-300 text-primary-400 font-semibold text-[15px]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
