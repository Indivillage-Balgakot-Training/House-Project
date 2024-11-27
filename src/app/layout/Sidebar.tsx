import React, { useState, useEffect } from 'react';
import { FaHome, FaThLarge, FaBuilding } from 'react-icons/fa';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { BiSolidFoodMenu } from "react-icons/bi";
import { usePathname, useRouter } from 'next/navigation';
import { useSelectedHouse } from '../contexts/SelectedHouseContext';  // Import the context hook

interface SidebarProps {
  currentPage: string;
  isOpen: boolean;
  toggleSidebar: () => void;
}

type PageKeys = 'welcome' | 'houses' | 'layout' | 'kitchen';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();  // Get the current path
  const router = useRouter();  // Access the router for navigation

  // State to track the current page
  const [currentPage, setCurrentPage] = useState<PageKeys>('welcome');
  const { selectedHouse } = useSelectedHouse(); // Access the selected house from the context

  // Map of pages to their paths
  const pages: Record<PageKeys, string> = {
    welcome: '/',
    houses: '/gallery',
    layout: '/layout',
    kitchen: '/kitchen',
  };

  useEffect(() => {
    const path = pathname;
    
    if (!path) return; // Guard against undefined or null path

    // Check which page the path corresponds to and set it as the currentPage
    if (path === '/') setCurrentPage('welcome');
    else if (path.startsWith('/gallery')) setCurrentPage('houses');
    else if (path.startsWith('/layout') && !path.includes('/kitchen')) setCurrentPage('layout');
    else if (path.startsWith('/kitchen')) setCurrentPage('kitchen');
  }, [pathname]);

  // Handle main page navigation
  const handleNavigation = (page: PageKeys) => {
    router.push(pages[page]);
    toggleSidebar(); // Close the sidebar after navigation
  };

  // Determine the available rooms based on the selected house
  const getLayoutRooms = () => {
    if (selectedHouse?.house_name === 'House 2') {
      return ['bedroom', 'kitchen', 'living-room']; // Custom layout for House 2
    } else {
      return ['bedroom', 'open-area', 'master-bedroom1', 'master-bedroom2', 'guest-bathroom', 'kitchen']; // Default layout for other houses
    }
  };


  return (
    <div className={`sidebar__wrapper relative h-screen bg-gray-400 text-black p-6 transition-transform duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
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
          { id: 'welcome', icon: <FaHome />, label: 'Welcome' },
          { id: 'houses', icon: <FaThLarge />, label: 'Houses' },
        ].map(({ id, icon, label }) => (
          <li
            key={id}
            className={`flex items-center cursor-pointer p-1 rounded-lg transition-all duration-200 ${currentPage === id ? 'bg-green-500 text-white scale-105' : 'hover:bg-green-200'}`}
            onClick={() => handleNavigation(id as PageKeys)} // Handle click for main navigation
            role="button"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && handleNavigation(id as PageKeys)}
          >
            <span className={`mr-2 transition-opacity duration-300`} style={{ opacity: isOpen ? 1 : 0.7 }}>
              {icon}
            </span>
            {isOpen && <span className="capitalize">{label}</span>} {/* Label only when open */}
          </li>
        ))}

        {/* Display selected house name below 'Houses' */}
        {selectedHouse && isOpen && (
          <li
            key="selected-house"
            className="flex items-center p-1 rounded-lg transition-all duration-200 text-black"
          >
            <span className="mr-2 pl-6">{selectedHouse.house_name}</span>
          </li>
        )}

        {/* Layout item and submenu directly listed below */}
        <li
          key="layout"
          className={`flex items-center cursor-pointer p-1 rounded-lg transition-all duration-200 ${currentPage === 'layout' ? 'bg-green-500 text-white scale-105' : 'hover:bg-green-200'}`}
          onClick={() => handleNavigation('layout')} // Navigate directly to layout
        >
          <span className={`mr-2 transition-opacity duration-300`} style={{ opacity: isOpen ? 1 : 0.7 }}>
            <FaBuilding />
          </span>
          {isOpen && <span className="capitalize">Layout</span>}
        </li>
      </ul>

      {/* Layout Submenu dynamically based on selected house */}
      {isOpen && selectedHouse && (
        <ul className="mt-2 space-y-2 pl-6">
          {getLayoutRooms().map((subPage) => (
            <li
              key={subPage}
              className={`cursor-pointer p-1 rounded-lg transition-all duration-200 ${pathname.includes(subPage) ? 'bg-green-500 text-white scale-105' : 'hover:bg-green-200'}`}
              onClick={() => handleNavigation(subPage as PageKeys)}
            >
              <span className="capitalize">{subPage.replace('-', ' ')}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
