"use client"; // Mark the component as a Client Component

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ImageMapComponentProps {
  houseType: string; // Define the type for houseType
}

const ImageMapComponent: React.FC<ImageMapComponentProps> = ({ houseType }) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const router = useRouter(); 
 

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = async (area: string) => {
    console.log(`Clicked area: ${area}`); // Debugging log

    if (area === 'kitchen') {
      alert('Navigating to the kitchen page');
      router.push('/kitchen'); // Navigate to the kitchen page
    }

    try {
      const response = await fetch('http://localhost:5000/api/user_choices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_type: area, house_type: houseType }), // Send both room_type and house_type
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Data saved:', result);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleAreaClick = () => {
    router.push('/gallery'); // Navigate to the gallery page
  };

  return (
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
          href="/gallery" // This is optional; handled by onClick
          coords="791,46,755,11" // Coordinates for the clickable area
          shape="rect"
          onClick={handleAreaClick} // Handle the click event
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

      {/* Example of a clickable area for the kitchen */}
      <div
        className={`absolute ${hoveredArea === 'kitchen' ? 'bg-orange-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('kitchen')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('kitchen')}
        style={{ left: '552px', top: '341px', width: '180px', height: '131px', zIndex: 10 }}
      />

     
      
    </div>
  );
};

export default ImageMapComponent;
