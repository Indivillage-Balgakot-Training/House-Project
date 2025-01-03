'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../gallery/Sidebar';

const RoomsPage = () => {
  const [roomData, setRoomData] = useState<any>({}); // State to store room data
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to toggle the sidebar
  const [selectedImages, setSelectedImages] = useState<any>({}); // State to store selected images per category

  const searchParams = useSearchParams(); // Get search parameters (house_id, session_id, room_name) from the URL
  const router = useRouter(); // Router for navigating

  const houseId = searchParams.get('house_id'); // Extract house_id
  const sessionId = searchParams.get('session_id'); // Extract session_id
  const roomName = searchParams.get('room_name'); // Extract room_name

  const storageKey = `room-selections-${sessionId}`; // Key for sessionStorage to store selected images for a session

  // Fetch room data from the backend based on houseId, sessionId, and roomName
  useEffect(() => {
    if (!houseId || !sessionId || !roomName) return;
    async function fetchRoomData() {
      try {
        const response = await fetch(
          `http://localhost:5000/room-data_dev?house_id=${houseId}&session_id=${sessionId}&room_name=${roomName}`
        );
        const data = await response.json();
        setRoomData(data);

        // Get the saved selections from sessionStorage using the storageKey.
        const savedSelections = sessionStorage.getItem(storageKey);
        if (savedSelections) {
          const parsedSelections = JSON.parse(savedSelections);
          setSelectedImages(parsedSelections || {});
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    }

    fetchRoomData();
  }, [houseId, sessionId, roomName]);

  const handleBack = () => {
    router.push(`/gallery?house_id=${houseId}&session_id=${sessionId}`);
  };

  const handleColorClick = (category: string, image: string | null) => {
    if (selectedImages[category] === image) {
      setSelectedImages((prevState: any) => {
        const updatedState = { ...prevState };
        delete updatedState[category];
        sessionStorage.setItem(storageKey, JSON.stringify(updatedState));
        return updatedState;
      });
    } else {
      setSelectedImages((prevState: any) => {
        const updatedState = { ...prevState, [category]: image };
        sessionStorage.setItem(storageKey, JSON.stringify(updatedState));
        return updatedState;
      });
    }
  };

  const renderColorOptions = () => {
    if (!roomData?.images) return null;

    return roomData.images.map((image: any, idx: number) => {
      return image.color_categories?.map((category: any) => (
        <div key={category.key}>
          <h3 className="text-xl mt-6 mb-2">{category.label.toUpperCase()}</h3>
          <div className="flex p-2 space-x-4">
            {category.colors.map((color: any, index: number) => (
              <div
                key={index}
                className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedImages[category.key] === color.image ? 'border-4 border-green-500' : ''}`}
                onClick={() => handleColorClick(category.key, color.image)}
              >
                <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
              </div>
            ))}
          </div>
        </div>
      ));
    });
  };

  return (
    <div className="flex">
      <Sidebar
        currentPage="rooms"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedHouseId={houseId}
        rooms={roomData.rooms || [roomName]}
        onHouseSelect={(houseId) => console.log('Selected House:', houseId)}
        onRoomSelect={(roomName) => {
          console.log('Selected Room:', roomName);
        }}
      />
      <div className={`flex-grow ${isSidebarOpen ? 'ml-50' : 'ml-60'} p-10`}>
        <div className="flex justify-end h-full">
          <div className="flex flex-col items-center w-full lg:flex-row lg:justify-between h-full">
            <div className="lg:w-1/5 bg-gray-100 p-4 rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4">{roomName}</h2>
              {renderColorOptions()}
            </div>
            <div className="relative lg:w-2/3 lg:ml-8 mt-8 lg:mt-0 mx-auto h-full">
              {Object.keys(selectedImages).map((category) => {
                const image = selectedImages[category];
                return image ? (
                  <Image
                    key={category}
                    src={image}
                    alt={category}
                    width={900}
                    height={800}
                    style={{ objectFit: 'cover' }}
                    className="absolute top-0 left-0 rounded-lg shadow-lg opacity-75"
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
