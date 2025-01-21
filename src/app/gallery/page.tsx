'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../gallery/Sidebar'; // Correct import of Sidebar

interface House {
  house_id: string;
  house_name: string;
  house_image: string;
  description?: string;
  locked: boolean;
}

const GalleryPage = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null); // Selected house state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();

  // Fetch houses from the backend when the component mounts
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/houses');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: House[] = await response.json();
        setHouses(data);
        if (data.length > 0) {
          setSelectedHouse(data[0]); // Set the first house as selected
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError('Error fetching houses: ' + error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, []);

  // Handle house selection from Sidebar
  const handleHouseSelect = (houseId: string) => {
    const selected = houses.find(house => house.house_id === houseId);
    setSelectedHouse(selected || null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Handle image click to navigate to layout page
  const handleImageClick = (houseId: string) => {
    // Navigate to the layout page with house_id as query param
    router.push(`/layout?house_id=${houseId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div>
        <p>Loading houses...</p>
      </div>
    );
  }

  if (houses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>No houses available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        onHouseSelect={handleHouseSelect}
        onRoomSelect={() => {}}  // Dummy function to satisfy the required prop
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedHouseId={selectedHouse?.house_id || null}
        rooms={[]} // Assuming room data is still not required or you will handle it later
      />
      <div className="w-3/4 flex flex-col items-center justify-center p-8">
        {selectedHouse ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{selectedHouse.house_name}</h1>
            
            {/* Wrap the image with a Link component */}
            <div
              className="cursor-pointer"
              onClick={() => handleImageClick(selectedHouse.house_id)}
            >
              <Image
                src={selectedHouse.house_image}
                alt={selectedHouse.house_name}
                width={600}
                height={400}
                style={{ objectFit: 'cover' }}
                className="rounded-lg shadow-lg"
              />
            </div>
            
            <p className="mt-4 text-center">{selectedHouse.description || "No description available."}</p>
            <Link href="/" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
              Back to Home
            </Link>
          </>
        ) : (
          <p>No house selected.</p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
