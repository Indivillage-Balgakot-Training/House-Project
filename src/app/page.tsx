"use client"; // Add this line to mark the component as a Client Component

import { useState } from 'react';
import Image from 'next/image';

const ImageMapComponent = () => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  return (
    <div className="relative">
      <Image
        src="/image2.jpg"
        alt="Home Section"
        width={800} // Adjust width as needed
        height={600} // Adjust height as needed
      />
      <div
        className={`absolute ${hoveredArea === 'bedroom' ? 'bg-red-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('bedroom')}
        onMouseLeave={handleMouseLeave}
        style={{ left: '83px', top: '61px', width: '185px', height: '278px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'openArea' ? 'bg-green-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('openArea')}
        onMouseLeave={handleMouseLeave}
        style={{ left: '268px', top: '59px', width: '119px', height: '280px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'masterBedroom2' ? 'bg-blue-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('masterBedroom2')}
        onMouseLeave={handleMouseLeave}
        style={{ left: '388px', top: '58px', width: '163px', height: '281px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'masterBedroom1' ? 'bg-yellow-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('masterBedroom1')}
        onMouseLeave={handleMouseLeave}
        style={{ left: '551px', top: '59px', width: '191px', height: '280px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'kitchen' ? 'bg-orange-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('kitchen')}
        onMouseLeave={handleMouseLeave}
        style={{ left: '552px', top: '341px', width: '188px', height: '131px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'guestBathroom' ? 'bg-purple-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('guestBathroom')}
        onMouseLeave={handleMouseLeave}
        style={{ left: '80px', top: '337px', width: '189px', height: '134px', zIndex: 10 }}
      />
    </div>
  );
};

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative h-screen w-full">
      <Image 
        src="/image1.jpg" 
        alt="My Image" 
        layout="fill" 
        objectFit="cover" 
        className="absolute inset-0 cursor-pointer" 
        onClick={handleImageClick} // Open modal on click
      />

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-20" 
          onClick={handleCloseModal}
        >
          <div className="relative">
            <ImageMapComponent /> {/* Use the ImageMapComponent here */}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
