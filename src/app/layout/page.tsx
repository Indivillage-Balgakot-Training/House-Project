"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar'; // Ensure the casing matches

interface ImageMapComponentProps {
  houseType: string; // The houseType will be passed as a prop
}

interface Room {
  id: string;
  name: string;
  coords: string; // Coordinates for the clickable area (left, top, width, height)
  color_options: string[]; // You might want to use this data in the future
}

const ImageMapComponent: React.FC<ImageMapComponentProps> = ({ houseType }) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);  // Array of rooms fetched from the backend
  const [currentPage, setCurrentPage] = useState('Welcome'); // Default page
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch rooms from the backend based on the house type
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`http://localhost:5000/houses/${houseType}/rooms`);
        if (!response.ok) throw new Error('Failed to fetch rooms');
        
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, [houseType]);

  // Handle mouse hover events
  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  // Handle click on areas to set room type and navigate
  const handleClick = async (roomName: string) => {
    console.log(`Clicked area: ${roomName}`);
    setCurrentPage(roomName); // Set current page based on clicked area
    router.push(`/${roomName}`);  // Navigate to the page

    // Send the room type and house type to the backend
    try {
      const response = await fetch('http://localhost:5000/select-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          room_type: roomName,    // Send the room type selected
          house_type: houseType,  // Send the house type selected
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();
      console.log('Room type data saved:', result);  // Log the result after the data is saved
    } catch (error) {
      console.error('Error saving data:', error);
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
{/* Other clickable areas */}
{/* Dynamically rendered clickable areas for rooms */}
{rooms.map((room) => (
              <div
                key={room.id}
                className={`absolute ${hoveredArea === room.name ? 'bg-opacity-50' : 'opacity-0'} transition-opacity duration-300`}
                onMouseEnter={() => handleMouseEnter(room.name)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(room.name)}  // Send room type dynamically
                style={{
                  left: room.coords.split(',')[0] + 'px', 
                  top: room.coords.split(',')[1] + 'px', 
                  width: room.coords.split(',')[2] + 'px', 
                  height: room.coords.split(',')[3] + 'px', 
                  zIndex: 10,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageMapComponent;