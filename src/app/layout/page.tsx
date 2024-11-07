"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar'; // Ensure the casing matches

const ImageMapComponent: React.FC = () => {
  const [layoutData, setLayoutData] = useState<any[]>([]); // Array of layout data
  const [hoveredArea, setHoveredArea] = useState<string | null>(null); // Track the area that is being hovered
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  // Fetch layout data
  useEffect(() => {
    const fetchLayoutData = async () => {
      try {
        const layoutResponse = await fetch('http://localhost:5000/layout'); // Fetch from your API
        if (!layoutResponse.ok) throw new Error('Failed to fetch layout data');

        const layoutData = await layoutResponse.json();
        setLayoutData(layoutData);
      } catch (error) {
        console.error('Error fetching layout data:', error);
      }
    };

    fetchLayoutData();
  }, []);

  // Handle mouse enter on an area
  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  // Handle mouse leave from an area
  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  // Handle click on an area and send data to the backend
  const handleClick = async (area: string) => {
    console.log(`Clicked on ${area}`);

    // Send selected room to the backend
    try {
      const response = await fetch('/api/save-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedRoom: area }),
      });

      if (!response.ok) {
        throw new Error('Failed to save selection');
      }

      console.log(`${area} saved successfully!`);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar
        currentPage="layout"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="flex items-center justify-center h-screen">
          <div className="relative">
            <Image
              src="/image2.jpg" // Ensure this image exists
              alt="Home Section"
              width={800}
              height={600}
              useMap="#image-map"
            />
            <map name="image-map">
              {/* Predefined clickable areas */}
              <area
                target="_self"
                alt="Gallery Area"
                title="Go to Gallery"
                href="/gallery"
                coords="791,46,755,11"
                shape="rect"
                onClick={(e) => {
                  e.preventDefault();
                  router.push('/gallery');
                }}
              />
            </map>

            {/* Other clickable areas */}
            <div
              className={`absolute ${hoveredArea === 'bedroom' ? 'bg-red-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
              onMouseEnter={() => handleMouseEnter('bedroom')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('bedroom')}
              style={{ left: '83px', top: '61px', width: '185px', height: '278px', zIndex: 10 }}
            />
            <div
              className={`absolute ${hoveredArea === 'openArea' ? 'bg-green-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
              onMouseEnter={() => handleMouseEnter('openArea')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('openArea')}
              style={{ left: '268px', top: '59px', width: '119px', height: '280px', zIndex: 10 }}
            />
            <div
              className={`absolute ${hoveredArea === 'masterBedroom2' ? 'bg-blue-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
              onMouseEnter={() => handleMouseEnter('masterBedroom2')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('masterBedroom2')}
              style={{ left: '388px', top: '58px', width: '163px', height: '281px', zIndex: 10 }}
            />
            <div
              className={`absolute ${hoveredArea === 'masterBedroom1' ? 'bg-yellow-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
              onMouseEnter={() => handleMouseEnter('masterBedroom1')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('masterBedroom1')}
              style={{ left: '551px', top: '59px', width: '180px', height: '280px', zIndex: 10 }}
            />
            <div
              className={`absolute ${hoveredArea === 'guestBathroom' ? 'bg-purple-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
              onMouseEnter={() => handleMouseEnter('guestBathroom')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('guestBathroom')}
              style={{ left: '80px', top: '337px', width: '189px', height: '134px', zIndex: 10 }}
            />
            <div
              className={`absolute ${hoveredArea === 'kitchen' ? 'bg-orange-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
              onMouseEnter={() => handleMouseEnter('kitchen')}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleClick('kitchen')}
              style={{ left: '552px', top: '341px', width: '180px', height: '131px', zIndex: 10 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMapComponent;
