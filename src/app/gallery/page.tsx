"use client"; // Mark the component as a Client Component

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Correct import for the new app router

const houses = [
  { name: 'House 1', image: '/gallery.jpg', description: 'A Simple and Cozy home.' },
  { name: 'House 2', image: '/house2.jpg', description: 'A modern home with sleek design.' },
  { name: 'House 3', image: '/house3.jpg', description: 'A rustic house with a warm feel.' },
  { name: 'House 4', image: '/house4.jpg', description: 'A tiny house with smart space utilization.' },
];

const GalleryPage = () => {
  const [selectedHouse, setSelectedHouse] = useState(houses[0]);
  const router = useRouter();

  const handleImageClick = async () => {
    // Store house type in the backend
    try {
      const response = await fetch('http://localhost:5000/api/user_choices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ room_type: selectedHouse.name }), // Send house type as room_type
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('House type saved:', result);

      // Redirect to the layout page if the first house is selected
      if (selectedHouse.name === 'House 1') {
        router.push('/layout'); // Ensure this path matches your layout page
      }
    } catch (error) {
      console.error('Error saving house type:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for house selection */}
      <div className="w-1/4 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Select a House</h2>
        <select
          className="block w-full p-2 border border-gray-300 rounded"
          onChange={(e) => setSelectedHouse(houses[Number(e.target.value)])}
        >
          {houses.map((house, index) => (
            <option key={index} value={index}>
              {house.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main area to display the selected house */}
      <div className="w-3/4 flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">{selectedHouse.name}</h1>
        <Image
          src={selectedHouse.image}
          alt={selectedHouse.name}
          width={600}
          height={400}
          style={{ objectFit: 'cover' }}
          className="rounded-lg shadow-lg cursor-pointer"
          onClick={handleImageClick} // Attach the click handler
        />
        <p className="mt-4 text-center">{selectedHouse.description}</p>
        <Link href="/" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default GalleryPage;
