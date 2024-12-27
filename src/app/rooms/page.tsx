'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../gallery/Sidebar';

const RoomsPage = () => {
  const [roomData, setRoomData] = useState<any>({}); // State to store room data
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);// State to toggle the sidebar

  const searchParams = useSearchParams(); // Get search parameters (house_id, session_id, room_name) from the URL
  const router = useRouter();// Router for navigating

  const houseId = searchParams.get('house_id');// Extract house_id
  const sessionId = searchParams.get('session_id');// Extract session_id
  const roomName = searchParams.get('room_name'); // Extract room_name

  const [selectedRoom, setSelectedRoom] = useState<string>(roomName || '');// State to store the currently selected room name
  const [selectedImages, setSelectedImages] = useState<any>({});// State to store selected images per category

  const storageKey = `room-selections-${sessionId}`;// Key for sessionStorage to store selected images for a session

  // Fetch room data from the backend based on houseId, sessionId, and roomName
  useEffect(() => {
    if (!houseId || !sessionId || !roomName) return;
    // Make a GET request to fetch room data from the server based on houseId, sessionId, and roomName.
    async function fetchRoomData() {
      try {
        // Parse the response data and set it to the roomData state.
        const response = await fetch(
          `http://localhost:5000/room-data?house_id=${houseId}&session_id=${sessionId}&room_name=${roomName}`
        );
        const data = await response.json();
        setRoomData(data);
// Get the saved selections from sessionStorage using the storageKey.
        const savedSelections = sessionStorage.getItem(storageKey);
        // If there are saved selections, parse them and update the selectedImages state.
        if (savedSelections) {
          const parsedSelections = JSON.parse(savedSelections);
          setSelectedImages(parsedSelections || {});
        }
      } catch (error) {
      
        console.error('Error fetching room data:', error);// If an error occurs during the fetch, log it to the console.
      }
    }

    fetchRoomData(); //Call the fetchRoomData function to load room data.
  }, [houseId, sessionId, roomName]);

  const handleBack = () => {
    router.push(`/gallery?house_id=${houseId}&session_id=${sessionId}`);
  };

  const handleColorClick = (category: string, image: string | null) => {
    // If the clicked image is already selected, unselect it by removing it from selectedImages
    if (selectedImages[category] === image) {
      setSelectedImages((prevState: any) => {
        const updatedState = { ...prevState };
        delete updatedState[category];  // Remove the category from the selected images
        sessionStorage.setItem(storageKey, JSON.stringify(updatedState));
        return updatedState;
      });
    } else {
      // Otherwise, select the new image
      setSelectedImages((prevState: any) => {
        const updatedState = { ...prevState, [category]: image };
        sessionStorage.setItem(storageKey, JSON.stringify(updatedState));// Save the updated selections to sessionStorage using the storageKey
        return updatedState;
      });
    }
  };

  const renderColorOptions = () => {
    if (!roomData?.images) return null;// If there are no images in the room data, return null
    return Object.keys(roomData).map((category) => {
      const categoryData = roomData[category]; // Get the data for the current category
      if (Array.isArray(categoryData) && categoryData.length > 0) {
        return (
          <div key={category}>
            <h3 className="text-xl mt-6 mb-2">{category.replace(/([A-Z])/g, ' $1')}</h3>{/* Format category name */}
            <div className="flex p-2 space-x-4">
              {categoryData.map((color: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedImages[category] === color.image ? 'border-4 border-green-500' : ''}`}
                  onClick={() => handleColorClick(category, color.image)}// Handle image click to select or unselect
                >
                  <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />{/* Display color option */}
                </div>
              ))}
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex"> {/* Sidebar component with room selection and house selection */}
      <Sidebar
        currentPage="rooms"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedHouseId={houseId}
        rooms={roomData.rooms || [roomName]} // List of rooms, defaulting to the current room name
        onHouseSelect={(houseId) => console.log('Selected House:', houseId)}// Handle house selection
        onRoomSelect={(roomName) => {
          console.log('Selected Room:', roomName); // Handle room selection
          setSelectedRoom(roomName);// Update the selected room
        }}
      />

      <div className={`flex-grow ${isSidebarOpen ? 'ml-50' : 'ml-60'} p-10`}>
        <div className="flex justify-end h-full">
          <div className="flex flex-col items-center w-full lg:flex-row lg:justify-between h-full">
            <div className="lg:w-1/5 bg-gray-100 p-4 rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4">{roomName}</h2>{/* Display room name */}
              {renderColorOptions()}{/* Render color selection options for the room */}
            </div>

            <div className="relative lg:w-2/3 lg:ml-8 mt-8 lg:mt-0 mx-auto h-full">
              {/* Render all selected images for each category */}
              {Object.keys(selectedImages).map((category) => {
                const image = selectedImages[category];
                return image ? (
                  <Image
                    key={`${category}`} // Unique key for each image
                    src={image}
                    alt={`${category}`}
                    width={900}
                    height={800}
                    style={{ objectFit: 'cover' }}
                    className={`absolute top-0 left-0 rounded-lg shadow-lg opacity-75`}
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>

        {/* Back to Home button below the images */}
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
