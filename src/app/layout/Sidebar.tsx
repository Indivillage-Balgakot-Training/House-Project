"use client";

import React from 'react';
import { FaHome, FaThLarge, FaBuilding, FaUtensils } from 'react-icons/fa';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BiSolidFoodMenu } from "react-icons/bi";
import { useRouter } from 'next/navigation';

interface SidebarProps {
  currentPage: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Define the valid keys for the pages
type PageKeys = 'welcome' | 'houses' | 'layout' | 'kitchen';

const Sidebar: React.FC<SidebarProps> = ({ currentPage, isOpen, toggleSidebar }) => {
  const router = useRouter();

  // Map of pages to their paths
  const pages: Record<PageKeys, string> = {
    welcome: '/',
    houses: '/gallery',
    layout: '/layout',
    kitchen: '/kitchen',
  };

  const handleNavigation = (page: PageKeys) => {
    router.push(pages[page]);  // Navigate using the mapped path
    toggleSidebar();            // Close the sidebar
  };

  return (
    <div className={`sidebar__wrapper relative h-screen bg-gray-200 text-black p-6 transition-transform duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div className="flex items-center mb-6">
        <span className={`mr-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <BiSolidFoodMenu />
        </span>
        {isOpen && (
          <h2 className="text-2xl font-bold transition-opacity duration-300">
            MENU
          </h2>
        )}
        <button className="btn ml-auto" onClick={toggleSidebar} aria-label={isOpen ? "Close sidebar" : "Open sidebar"}>
          {isOpen ? <MdKeyboardArrowLeft /> : <MdKeyboardArrowRight />}
        </button>
      </div>
      <ul className="space-y-4">
        {[
          { id: 'welcome' as PageKeys, icon: <FaHome />, label: 'Welcome' },
          { id: 'houses' as PageKeys, icon: <FaThLarge />, label: 'Houses' },
          { id: 'layout' as PageKeys, icon: <FaBuilding />, label: 'Layout' },
          { id: 'kitchen' as PageKeys, icon: <FaUtensils />, label: 'Kitchen' },
        ].map(({ id, icon, label }) => (
          <li
            key={id}
            className={`flex items-center cursor-pointer p-2 rounded-lg transition-all duration-200 ${currentPage === id ? 'bg-gray-500' : 'hover:bg-gray-500'}`}
            onClick={() => handleNavigation(id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigation(id)}
          >
            <span className={`mr-2 transition-opacity duration-300`} style={{ opacity: isOpen ? 1 : 0.7 }}>
              {icon}
            </span>
            {isOpen && <span>{label}</span>} {/* Show label only if sidebar is open */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
