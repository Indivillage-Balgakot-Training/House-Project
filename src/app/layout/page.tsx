"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar'; // Import your Sidebar component

interface ImageMapComponentProps {
  houseType: string;
}

interface Room {
  id: string;
  name: string;
  color_options: string[];
}

const ImageMapComponent: React.FC<ImageMapComponentProps> = ({ houseType }) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState('Welcome'); // Default page
  const router = useRouter();

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

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = async (area: string) => {
    console.log(`Clicked area: ${area}`);
    setCurrentPage(area); // Set current page based on clicked area
    router.push(`/${area}`);

    try {
      const response = await fetch('http://localhost:5000/api/user_choices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_type: area, house_type: houseType }),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const result = await response.json();
      console.log('Data saved:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar to show current page */}
      <Sidebar currentPage={currentPage} />

    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <Image
          src="/image2.jpg"
          alt="Home Section"
          width={800}
          height={600}
          useMap="#image-map"
        />
        <map name="image-map">
          <area
            target=""
            alt="Gallery Area"
            title="Go to Gallery"
            href="/gallery"
            coords="791,46,755,11"
            shape="rect"
            onClick={() => router.push('/gallery')}
          />
        </map>

         {/* Other clickable areas... */}

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

        {/* Render room areas dynamically */}
        {rooms.map(room => (
          <div
            key={room.id}
            className={`absolute ${hoveredArea === room.name ? 'bg-opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter(room.name)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(room.name)}
            style={{ /* position based on your design */ }}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default ImageMapComponent;
