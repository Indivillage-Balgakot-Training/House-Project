"use client"; // Mark the component as a Client Component

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter

const wallColorOptions = [
  { name: 'Default', image: '/kitchen.jpg', color: '#FAF0E6' }, // Default kitchen image
  { name: 'Caramel', image: '/kitchenCabinet1.jpg', color: '#D2B48C' }, // Caramel color
  { name: 'Yellow', image: '/kitchenCabinet2.jpg', color: '#FFD700' }, // Yellow color
  { name: 'Neon Pink', image: '/kitchenCabinet3.jpg', color: '#FF69B4' }, // Neon Pink color
];

const KitchenPage = () => {
  const [selectedImage, setSelectedImage] = useState('/kitchen.jpg'); // Default image
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); // Initialize router

  const handleWallColorChange = (image: string) => {
    setSelectedImage(image);
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const handleBackToHome = () => {
    router.push('/gallery'); // Navigate back to home
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        {/* Selection Section for Wall Colors */}
        <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
          <h2 className="text-xl font-bold mb-4">Cabinets</h2>
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(prev => !prev)} 
              className="block w-full p-2 border border-gray-300 rounded mb-4 text-left"
            >
              Select Color
            </button>
            {isDropdownOpen && (
              <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-md w-49">
                <div className="flex p-2 space-x-4">
                  {wallColorOptions.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => handleWallColorChange(color.image)}
                      className="flex items-center cursor-pointer hover:bg-gray-200 p-2"
                    >
                      <div
                        className="w-8 h-8 rounded shadow-md"
                        style={{ backgroundColor: color.color }} // Use the specified color
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Display Selected Image */}
        <div className="w-3/4 flex items-center justify-center flex-col">
          <Image
            src={selectedImage} // Selected image (either wall color or default)
            alt="Selected Kitchen"
            width={1000} // Increased width
            height={800} // Increased height
            style={{ objectFit: 'cover' }}
            className="rounded-lg shadow-lg"
          />
          {/* Back to Home Button */}
          <button
            onClick={handleBackToHome}
            className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
            Back to House
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
