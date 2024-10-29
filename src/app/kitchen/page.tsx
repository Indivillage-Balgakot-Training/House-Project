"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Define a type for kitchen images
interface KitchenImage {
  name: string;
  image: string;
  color: string;
}

const KitchenPage = () => {
  const [kitchenImages, setKitchenImages] = useState<KitchenImage[]>([]); // Use the defined type
  const [selectedImage, setSelectedImage] = useState<string>('/images/kitchen.jpg'); // Default image
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchKitchenImages = async () => {
      try {
        const response = await fetch('http://localhost:5000/kitchen/images');
        const data: KitchenImage[] = await response.json(); // Specify the type here
        setKitchenImages(data);
        if (data.length > 0) {
          setSelectedImage(data[0].image); // Set default to first image
        }
      } catch (error) {
        console.error('Error fetching kitchen images:', error);
      }
    };

    fetchKitchenImages();
  }, []);

  const handleWallColorChange = (image: string) => {
    setSelectedImage(image);
    setIsDropdownOpen(false);
  };

  const handleBackToHome = () => {
    router.push('/gallery');
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
                  {kitchenImages.map((color, index) => (
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
            className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
            Back to House
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
