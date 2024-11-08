"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '../layout/Sidebar'; // Ensure the casing matches

// Define types for kitchen images
interface KitchenImage {
  name: string;
  image: string;
  color: string;
}

const KitchenPage = () => {
  const [cabinetImages, setCabinetImages] = useState<KitchenImage[]>([]);
  const [wallImages, setWallImages] = useState<KitchenImage[]>([]);
  const [basinImages, setBasinImages] = useState<KitchenImage[]>([]);
  
  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string>('/images/kitchen.jpg'); // Default cabinet image
  const [selectedWallImage, setSelectedWallImage] = useState<string>('/images/Wall1.jpg'); // Default wall image
  const [selectedBasinImage, setSelectedBasinImage] = useState<string>('/images/kitchen.jpg'); // Default basin image

  const [isCabinetDropdownOpen, setIsCabinetDropdownOpen] = useState<boolean>(false);
  const [isWallDropdownOpen, setIsWallDropdownOpen] = useState<boolean>(false);
  const [isBasinDropdownOpen, setIsBasinDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Sidebar state

  const router = useRouter();

  useEffect(() => {
    const fetchKitchenData = async () => {
      try {
        const response = await fetch('http://localhost:5000/kitchen-data?room_name=Kitchen');
        const data = await response.json();
        
        if (data.room_name) {
          // Assuming data contains "images", "cabinet_colors", etc. as per your app.py code
          setCabinetImages(data.cabinet_colors);
          setWallImages(data.wall_colors);
          setBasinImages(data.basin_colors);
  
          // Default selected images and colors
          if (data.cabinet_colors.length > 0) {
            setSelectedCabinetImage(data.images[0]?.image || '/images/kitchen.jpg');
          }
          if (data.basins.length > 0) {
            setSelectedBasinImage(data.basins[0]?.image || '/images/kitchen.jpg');
          }
          if (data.walls.length > 0) {
            setSelectedWallImage(data.walls[0]?.image || '/images/Wall1.jpg');
          }
        }
      } catch (error) {
        console.error('Error fetching kitchen data:', error);
      }
    };
  
    fetchKitchenData();
  }, []);

  const handleCabinetColorChange = (image: string) => {
    setSelectedCabinetImage(image);
    setIsCabinetDropdownOpen(false);
  };

  const handleWallColorChange = (image: string) => {
    setSelectedWallImage(image);
    setIsWallDropdownOpen(false);
  };

  const handleBasinColorChange = (image: string) => {
    setSelectedBasinImage(image);
    setIsBasinDropdownOpen(false);
  };

  const handleBackToHome = () => {
    router.push('/gallery');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="flex">
      <Sidebar currentPage="kitchen" isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} /> {/* Include the sidebar */}
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1">
          {/* Selection Section for Colors */}
          <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
            {/* Cabinets Section */}
            <h2 className="text-xl font-bold mb-4">Cabinets</h2>
            <div className="relative mb-20">
              <button 
                onClick={() => setIsCabinetDropdownOpen(prev => !prev)} 
                className="block w-full p-2 border border-gray-300 rounded mb-4 text-left"
              >
                Select Color
              </button>
              {isCabinetDropdownOpen && (
                <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-md w-49">
                  <div className="flex p-2 space-x-4">
                    {cabinetImages.map((color, index) => (
                      <div
                        key={index}
                        onClick={() => handleCabinetColorChange(color.image)}
                        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 ${selectedCabinetImage === color.image ? 'border-4 border-green-500' : ''}`}
                      >
                        <div
                          className="w-8 h-8 rounded shadow-md"
                          style={{ backgroundColor: color.color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Walls Section */}
            <h2 className="text-xl font-bold mb-4">Walls</h2>
            <div className="relative mb-20">
              <button 
                onClick={() => setIsWallDropdownOpen(prev => !prev)} 
                className="block w-full p-2 border border-gray-300 rounded mb-4 text-left"
              >
                Select Color
              </button>
              {isWallDropdownOpen && (
                <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-md w-49">
                  <div className="flex p-2 space-x-4">
                    {wallImages.map((color, index) => (
                      <div
                        key={index}
                        onClick={() => handleWallColorChange(color.image)}
                        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 ${selectedWallImage === color.image ? 'border-4 border-green-500' : ''}`}
                      >
                        <div
                          className="w-8 h-8 rounded shadow-md"
                          style={{ backgroundColor: color.color }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Basin Section */}
            <h2 className="text-xl font-bold mb-4">Basin</h2>
            <div className="relative mb-20">
              <button 
                onClick={() => setIsBasinDropdownOpen(prev => !prev)} 
                className="block w-full p-2 border border-gray-300 rounded mb-4 text-left"
              >
                Select Color
              </button>
              {isBasinDropdownOpen && (
                <div className="absolute bg-white border border-gray-300 mt-1 rounded shadow-md w-49">
                  <div className="flex p-2 space-x-4">
                    {basinImages.map((color, index) => (
                      <div
                        key={index}
                        onClick={() => handleBasinColorChange(color.image)}
                        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 ${selectedBasinImage === color.image ? 'border-4 border-green-500' : ''}`}
                      >
                        <div
                          className="w-8 h-8 rounded shadow-md"
                          style={{ backgroundColor: color.color }}
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
            <div className="relative">
              {/* Base kitchen image */}
              <Image
                src="/images/kitchen.jpg" // Replace with your default base image
                alt="Kitchen"
                width={1000}
                height={800}
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-lg"
              />

              {/* Overlay selected cabinet color */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${selectedCabinetImage})`,
                  backgroundSize: 'cover',
                  opacity: 1, // Adjust opacity for better overlay
                  pointerEvents: 'none', // Make sure it's not blocking clicks
                }}
                className="rounded-lg"
              />

              {/* Overlay selected wall color */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${selectedWallImage})`,
                  backgroundSize: 'cover',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
                className="rounded-lg"
              />

              {/* Overlay selected basin color */}
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  backgroundImage: `url(${selectedBasinImage})`,
                  backgroundSize: 'cover',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
                className="rounded-lg"
              />
            </div>

            {/* Back to Home Button */}
            <button
              onClick={handleBackToHome}
              className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition"
            >
              Back to House
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
