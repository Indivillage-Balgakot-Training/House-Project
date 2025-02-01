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
  const [houses, setHouses] = useState<House[]>([]);  // All houses list
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null); // Selected house state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const router = useRouter();


  // Lock the house on the backend
  const lockHouse = async (houseId: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/select-house?house_id=${houseId}`, {
        method: 'POST',
        credentials: 'same-origin',  // Ensures the session cookie is sent with the request
      });


      if (!response.ok) {
        throw new Error('Error locking house: ' + (await response.text()));
      }


      const updatedHouse = await response.json();


      // Update the list of houses to exclude the locked house
      setHouses((prevHouses) =>
        prevHouses.filter((house) => house.house_id !== houseId)
      );


      // Set the selected house as locked
      setSelectedHouse({
        house_id: updatedHouse.house_id || "",
        house_name: updatedHouse.house_name || "",
        house_image: updatedHouse.house_image || "",
        description: updatedHouse.description || "",
        locked: true,  // Mark as locked
      });


      console.log(`House ${houseId} locked successfully!`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };


  // Fetch houses from the backend when the component mounts
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/houses`, {
          credentials: 'same-origin',  // Ensures the session cookie is sent with the request
        });


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
  }, []); // Only run on component mount


  // Handle house selection from Sidebar
  const handleHouseSelect = (houseId: string) => {
    const selected = houses.find(house => house.house_id === houseId);
    setSelectedHouse(selected || null);
  };


  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };


  // Handle image click to lock and navigate to layout page
  const handleImageClick = (houseId: string) => {
    lockHouse(houseId);
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
        onRoomSelect={() => {}}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        selectedHouseId={selectedHouse?.house_id || null}
        rooms={[]} // Assuming room data is still not required or you will handle it later
        houses={houses} // Pass the houses from the GalleryPage to Sidebar
      />
      <div className="w-3/4 flex flex-col items-center justify-center p-8">
        {selectedHouse ? (
          <>
            <h1 className="text-4xl font-bold mb-4">{selectedHouse.house_name}</h1>
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