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
  const [selectedImage, setSelectedImage] = useState<string>('/images/kitchen.jpg'); // Default image
  const [isCabinetDropdownOpen, setIsCabinetDropdownOpen] = useState<boolean>(false);
  const [isWallDropdownOpen, setIsWallDropdownOpen] = useState<boolean>(false);
  const [isBasinDropdownOpen, setIsBasinDropdownOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Sidebar state
  const [selectedCabinetColor, setSelectedCabinetColor] = useState<string | null>(null);
  const [selectedWallColor, setSelectedWallColor] = useState<string | null>(null);
  const [selectedBasinColor, setSelectedBasinColor] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchKitchenImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/kitchen/images');
        const data = await response.json();
        setCabinetImages(data.cabinets);
        setWallImages(data.walls);
        setBasinImages(data.basins);
        if (data.cabinets.length > 0) {
          setSelectedImage(data.cabinets[0].image);
          setSelectedCabinetColor(data.cabinets[0].color); // Default cabinet color
        }
        if (data.basins.length > 0) {
          setSelectedImage(data.basins[0].image); // Default basin image
          setSelectedBasinColor(data.basins[0].color); // Default basin color
        }
      } catch (error) {
        console.error('Error fetching kitchen images:', error);
      }
    };

    fetchKitchenImages();
  }, []);

  const handleCabinetColorChange = (image: string, color: string) => {
    setSelectedImage(image);
    setSelectedCabinetColor(color); // Update selected cabinet color
    setIsCabinetDropdownOpen(false);
  };

  const handleWallColorChange = (image: string, color: string) => {
    setSelectedImage(image);
    setSelectedWallColor(color); // Update selected wall color
    setIsWallDropdownOpen(false);
  };

  const handleBasinColorChange = (image: string, color: string) => {
    setSelectedImage(image);
    setSelectedBasinColor(color); // Update selected basin color
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
                        onClick={() => handleCabinetColorChange(color.image, color.color)}
                        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 ${selectedCabinetColor === color.color ? 'border-4 border-green-500' : ''}`}
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
                        onClick={() => handleWallColorChange(color.image, color.color)}
                        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 ${selectedWallColor === color.color ? 'border-4 border-green-500' : ''}`}
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
                        onClick={() => handleBasinColorChange(color.image, color.color)}
                        className={`flex items-center cursor-pointer hover:bg-gray-200 p-2 ${selectedBasinColor === color.color ? 'border-4 border-green-500' : ''}`}
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
            <Image
              src={selectedImage}
              alt="Selected Kitchen"
              width={1000}
              height={800}
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg"
            />
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
