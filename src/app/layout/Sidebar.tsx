// Sidebar.tsx
//"use client"; // Mark this as a Client Component

import React, { useState } from 'react';
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
    <div className="w-1/4 bg-gray-200 text-white p-4 ">
      <h2 className="text-xl text-black">MENU</h2>
      <ul className="mt-4">
        <li className="cursor-pointer hover:text-gray-400 text-black">
          <Link href="/">Welcome</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-400 text-black">
          <Link href="/gallery">Houses</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-400 text-black">
          <Link href="/layout">Layout</Link>
        </li>
        <li className="cursor-pointer hover:text-gray-400 text-black">
          <Link href="/kitchen">Kitchen</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
