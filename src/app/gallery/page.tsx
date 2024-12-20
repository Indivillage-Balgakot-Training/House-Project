'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Ensure correct import of useRouter
import Sidebar from '../gallery/Sidebar'; // Correct import of Sidebar

interface House {
  house_id: string;
  house_name: string;
  house_image: string;
  description?: string;
  locked: boolean | null;
}

const GalleryPage = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null); // Selected house state
  const [lockedHouses, setLockedHouses] = useState<{ [key: string]: boolean }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Sidebar state
  const router = useRouter(); // Directly call useRouter here

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

  const handleImageClick = async () => {
    if (selectedHouse) {
      if (lockedHouses[selectedHouse.house_id]) {
        setError('This house is currently locked by another user.');
        return;
      }
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/select-house', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            house_id: selectedHouse.house_id,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to select house');
        }

        const { session_id, house_id } = data;
        setLockedHouses(prev => ({ ...prev, [house_id]: true }));

        router.push(`/layout?house_id=${house_id}&house_name=${selectedHouse.house_name}&session_id=${session_id}`);
      } catch (error) {
        setError('Failed to select house');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle house selection from Sidebar
  const handleHouseSelect = (houseId: string) => {
    const selected = houses.find(house => house.house_id === houseId);
    setSelectedHouse(selected || null); // Set the selected house based on the ID
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
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
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar} onRoomSelect={function (roomName: string): void {
          throw new Error('Function not implemented.');
        } } selectedHouseId={null} rooms={[]}      />
      <div className="w-3/4 flex flex-col items-center justify-center p-8">
        {selectedHouse ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{selectedHouse.house_name}</h1>
            <Image
              src={selectedHouse.house_image}
              alt={selectedHouse.house_name}
              width={600}
              height={400}
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg cursor-pointer"
              onClick={handleImageClick}
            />
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