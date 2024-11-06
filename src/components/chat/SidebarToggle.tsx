'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import menu from '../../../public/menu.svg';
import Image from 'next/image';

const SidebarToggle = ({ roomId }: { roomId: string }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="p-2">
      <Image src={menu} alt="menu" width={24} height={24} onClick={toggleSidebar} className="cursor-pointer" />
      {isSidebarVisible && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none" />}
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} roomId={roomId} />
    </div>
  );
};

export default SidebarToggle;
