// Sidebar.tsx

import { IoMdClose } from 'react-icons/io';

const Sidebar = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
  return (
    <div
      className={`h-screen w-[300px] bg-white fixed top-0 right-0 transform transition-transform duration-300 z-50 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <IoMdClose className="text-2xl m-4 cursor-pointer" onClick={onClose} />
      <div className="p-4">
        <button>함께보는 멤버</button>
        <button>파티관리</button>
      </div>
    </div>
  );
};

export default Sidebar;
