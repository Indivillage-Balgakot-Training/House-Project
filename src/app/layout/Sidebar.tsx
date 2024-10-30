"use client"; // Mark this as a Client Component

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage }) => {
  const router = useRouter();

  const handleNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <div className="w-64 bg-gray-200 text-black h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">MENU</h2>
      <ul className="space-y-4">
        <li className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${currentPage === 'welcome' ? 'bg-gray-700' : 'hover:bg-gray-500'}`}>
          <Link href="/" onClick={() => handleNavigation('welcome')}>Welcome</Link>
        </li>
        <li className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${currentPage === 'houses' ? 'bg-gray-700' : 'hover:bg-gray-500'}`}>
          <Link href="/gallery" onClick={() => handleNavigation('houses')}>Houses</Link>
        </li>
        <li className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${currentPage === 'layout' ? 'bg-gray-700' : 'hover:bg-gray-500'}`}>
          <Link href="/layout" onClick={() => handleNavigation('layout')}>Layout</Link>
        </li>
        <li className={`cursor-pointer p-2 rounded-lg transition-all duration-200 ${currentPage === 'kitchen' ? 'bg-gray-700' : 'hover:bg-gray-500'}`}>
          <Link href="/kitchen" onClick={() => handleNavigation('kitchen')}>Kitchen</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
