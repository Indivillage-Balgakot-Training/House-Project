"use client"; // Mark the component as a Client Component

import { useState } from 'react';
import Image from 'next/image';

const ImageMapComponent = () => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = async (area: string, color: string) => {
    console.log(`Clicked area: ${area}, Color: ${color}`); // Debugging log

    switch (area) {
      case 'kitchen':
        setSelectedImage('/kitchen.jpg'); // Ensure this path is correct
        break;
      // Add cases for other areas if needed
      default:
        setSelectedImage(null);
        break;
    }
  

  try {
    const response = await fetch('http://localhost:5000/api/user_choices', { // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: "testUser", room_type: area, color }), // Adjust as necessary
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

  return (
    <div className="relative">
      <Image
        src="/image2.jpg"
        alt="Home Section"
        width={800}
        height={600}
      />
      {/* Other clickable areas... */}

      <div
        className={`absolute ${hoveredArea === 'bedroom' ? 'bg-red-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('bedroom')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('bedroom', 'red')}
        style={{ left: '83px', top: '61px', width: '185px', height: '278px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'openArea' ? 'bg-green-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('openArea')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('openArea', 'green')}
        style={{ left: '268px', top: '59px', width: '119px', height: '280px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'masterBedroom2' ? 'bg-blue-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('masterBedroom2')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('masterBedroom2', 'blue')}
        style={{ left: '388px', top: '58px', width: '163px', height: '281px', zIndex: 10 }}
      />
      <div
        className={`absolute ${hoveredArea === 'masterBedroom1' ? 'bg-yellow-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('masterBedroom1')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('masterBedroom1', 'yellow')}
        style={{ left: '551px', top: '59px', width: '180px', height: '280px', zIndex: 10 }}
      />
     
      <div
        className={`absolute ${hoveredArea === 'guestBathroom' ? 'bg-purple-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('guestBathroom')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('guestBathroom', 'purple')}
        style={{ left: '80px', top: '337px', width: '189px', height: '134px', zIndex: 10 }}
      />


      {/* Example of a clickable area for the kitchen */}
      <div
        className={`absolute ${hoveredArea === 'kitchen' ? 'bg-orange-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('kitchen')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('kitchen','orange')}
        style={{ left: '552px', top: '341px', width: '180px', height: '131px', zIndex: 10 }}
      />

      {/* Conditionally render the selected image */}
      {selectedImage && (
        <div className="absolute inset-0 flex justify-center items-center z-20 bg-black bg-opacity-50">
          <Image
            src={selectedImage}
            alt={hoveredArea || 'Image'}
            layout="responsive"
            width={800}
            height={600}
            className="object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageMapComponent;
