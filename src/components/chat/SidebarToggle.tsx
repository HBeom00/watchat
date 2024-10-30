'use client';

import { useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import Sidebar from './Sidebar';

const SidebarToggle = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <RxHamburgerMenu onClick={toggleSidebar} className="cursor-pointer text-2xl" />

      {isSidebarVisible && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 pointer-events-none" />}

      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} />
    </div>
  );
};

export default SidebarToggle;
