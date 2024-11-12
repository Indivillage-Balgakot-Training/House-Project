"use client"; // Mark the component as a Client Component

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface House {
  house_id: string;  // Renamed to match the backend
  house_name: string;
  house_image: string;
  description?: string;  // Description is optional since it's not in the backend
}

const GalleryPage = () => {
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        
        console.log("Fetched Houses:", data); // Debugging line
        setHouses(data);
        if (data.length > 0) {
          setSelectedHouse(data[0]); // Set the first house as the selected house
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
      // Store the selected house in the database along with session ID
      try {
        const response = await fetch('http://127.0.0.1:5000/select-house', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            house_id: selectedHouse.house_id,  // Use house_id instead of id
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to select house');
        }

        // After selection, we get the session ID, house_id, and house_name from the response
        const { session_id, house_id } = data;
        console.log('House Selected:', { session_id, house_id});

        // Redirect to layout page with house_id and session_id as URL parameters
        router.push(`/layout?house_id=${house_id}&session_id=${session_id}`);
      } catch (error) {
        console.error('Error selecting house:', error);
      }
    }
  };

  // Show loading spinner or error message
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner"></div> {/* You can add a CSS spinner here */}
        <p>Loading houses...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/6 bg-gray-400 shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Select a House</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
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
        )}
      </div>

      <div className="w-3/4 flex flex-col items-center justify-center p-8">
        {selectedHouse ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{selectedHouse.house_name}</h1>
            <Image
              src={selectedHouse.house_image} // Correctly referencing the image in the public folder
              alt={selectedHouse.house_name}
              width={600}
              height={400}
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg cursor-pointer"
              onClick={handleImageClick} // Call handleImageClick on image click
            />
            <p className="mt-4 text-center">{selectedHouse.description || "No description available."}</p>
            <Link href="/" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
              Back to Home
            </Link>
          </>
        ) : (
          <p>No houses available.</p>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
