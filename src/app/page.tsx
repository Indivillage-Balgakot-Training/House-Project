"use client"; // Add this line to mark the component as a Client Component

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
    // Set the selected image based on the area clicked
    switch (area) {
      case 'kitchen':
        setSelectedImage('/kichen.jpg'); // Set the image path for the kitchen
        break;
      // Add cases for other areas if needed
      default:
        setSelectedImage(null);
        break;
    }

    try {
      const response = await fetch('http://localhost:5000/api/areas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ area, color }),
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
      {/* ... other clickable areas ... */}

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
        style={{ left: '551px', top: '59px', width: '191px', height: '280px', zIndex: 10 }}
      />
      

      <div
        className={`absolute ${hoveredArea === 'kitchen' ? 'bg-orange-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('kitchen')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('kitchen', 'orange')}
        style={{ left: '552px', top: '341px', width: '188px', height: '131px', zIndex: 10 }}
      />

      <div
        className={`absolute ${hoveredArea === 'guestBathroom' ? 'bg-purple-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
        onMouseEnter={() => handleMouseEnter('guestBathroom')}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleClick('guestBathroom', 'purple')}
        style={{ left: '80px', top: '337px', width: '189px', height: '134px', zIndex: 10 }}
      />

      {/* Conditionally render the selected image */}
      {selectedImage && (
        <div className="absolute inset-0 flex justify-center items-center z-20 bg-black bg-opacity-50">
          <Image
            src={selectedImage}
            alt={hoveredArea || 'Image'}
            layout="responsive" // Use responsive layout
            width={800} // Adjust width as needed
            height={600} // Adjust height as needed
            className="object-contain" // Maintain aspect ratio
          />
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleImageClick = () => {
    setIsOpen(true);
  };

  const handleCloseModal = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative h-screen w-full">
      <Image 
        src="/image1.jpg" 
        alt="My Image" 
        layout="fill" 
        objectFit="cover" 
        className="absolute inset-0 cursor-pointer" 
        onClick={handleImageClick}
      />

      <div className="absolute top-0 left-0 p-4">
        <Image 
          src="/house1.jpg" 
          alt="House" 
          width={250} 
          height={250} 
          onClick={handleImageClick}
        />
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-20" 
          onClick={handleCloseModal}
        >
          <div className="relative">
            <ImageMapComponent />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
