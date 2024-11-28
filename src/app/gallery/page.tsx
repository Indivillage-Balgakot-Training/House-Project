"use client"; // This makes this component a Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Correct router import
import Image from 'next/image';

interface House {
  house_id: string;
  house_name: string;
  house_image: string;
  description?: string;
  locked: boolean | null;
}

const GalleryPage = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lockedHouses, setLockedHouses] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  // Fetch houses on component mount
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
          setSelectedHouse(data[0]);
        }

        // Set initial lock status for each house
        const lockStatus: { [key: string]: boolean } = {};
        data.forEach(house => {
          lockStatus[house.house_id] = house.locked !== null && house.locked !== false;
        });
        setLockedHouses(lockStatus);
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

  // Handle selecting a house and attempting to lock it
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
        console.error('Error selecting house:', error);
        setError('Error selecting house, please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Render loading, error, or houses list
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
      <div className="w-1/6 bg-gray-400 shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Select a House</h2>
        {error && <p className="text-red-500">{error}</p>}
        <select
          className="block w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setSelectedHouse(houses[Number(e.target.value)])}
          value={selectedHouse ? houses.indexOf(selectedHouse) : ''}
        >
          {houses.map((house, index) => (
            <option key={house.house_id} value={index}>
              {house.house_name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-3/4 flex flex-col items-center justify-center p-8">
        {selectedHouse ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{selectedHouse.house_name}</h1>
            <Image
              src={selectedHouse.house_image}
              alt={selectedHouse.house_name}
              width={600}
              height={400}
              className="rounded-lg shadow-lg cursor-pointer"
              onClick={handleImageClick}
            />
            <p className="mt-4 text-center">{selectedHouse.description || "No description available."}</p>
          </>
        ) : (
          <p>No houses available.</p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
