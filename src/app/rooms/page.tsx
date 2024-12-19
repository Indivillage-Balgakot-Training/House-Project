'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../gallery/Sidebar';

const RoomsPage = () => {
  //  To store room data from the server
  const [roomData, setRoomData] = useState<any>({});
  //  To manage the visibility of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Get search parameters from the URL (house_id, session_id, and room_name)
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract house_id, session_id, and room_name from the URL query parameters
  const houseId = searchParams.get('house_id');
  const sessionId = searchParams.get('session_id');
  const roomName = searchParams.get('room_name');

  // State to track default from URL
  const [selectedRoom, setSelectedRoom] = useState<string>(roomName || '');

  // States to store selected images for different parts of the room
  const [selectedWallImage, setSelectedWallImage] = useState<string | null>(null);
  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string | null>(null);
  const [selectedBasinImage, setSelectedBasinImage] = useState<string | null>(null);
  const [selectedWardrobeImage, setSelectedWardrobeImage] = useState<string | null>(null);
  const [selectedCeilingImage, setSelectedCeilingImage] = useState<string | null>(null);

  // Define the session storage key for this session
  const storageKey = `room-selections-${sessionId}`;

  // Fetch room data and previously selected images from session storage
  useEffect(() => {
    if (!houseId || !sessionId || !roomName) return;

    const fetchRoomData = async () => {
      try {
        // Fetches room data from backend
        const response = await fetch(
          `http://localhost:5000/room-data?house_id=${houseId}&session_id=${sessionId}&room_name=${roomName}`
        );
        const data = await response.json();
        setRoomData(data);

        // Fetch the previously chosen images from the sessionStorage
        const savedSelections = sessionStorage.getItem(storageKey);
        if (savedSelections) {
          const parsedSelections = JSON.parse(savedSelections);
          if (parsedSelections) {
            // Restore previous selections from sessionStorage
            setSelectedWallImage(parsedSelections.wallImage || null);
            setSelectedCabinetImage(parsedSelections.cabinetImage || null);
            setSelectedBasinImage(parsedSelections.basinImage || null);
            setSelectedWardrobeImage(parsedSelections.wardrobeImage || null);
            setSelectedCeilingImage(parsedSelections.ceilingImage || null);
          }
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();// Call the fetch function
  }, [houseId, sessionId, roomName]);

  // Navigate back to the gallery page
  const handleBack = () => {
    router.push(`/gallery?house_id=${houseId}&session_id=${sessionId}`);
  };

  // It Handle the selection of a color and save it to sessionStorage
  const handleColorClick = (
    setSelectedColor: React.Dispatch<React.SetStateAction<string | null>>,
    selectedImage: string | null,
    image: string,
    colorType: string
  ) => {
    const newSelection = selectedImage === image ? null : image;
    setSelectedColor(newSelection);// Update the selected color in state

    // Save the selection to sessionStorage
    const savedSelections = sessionStorage.getItem(storageKey);
    const parsedSelections = savedSelections ? JSON.parse(savedSelections) : {};

    // Update the selected color based on the color type (wall, cabinet, etc.)
    parsedSelections[colorType] = newSelection;

    // Save back to sessionStorage
    sessionStorage.setItem(storageKey, JSON.stringify(parsedSelections));
  };

  // Render color options dynamically based on the selected room type.
  const renderColorOptions = () => {
    // If the room is Kitchen, show kitchen-related color options
    if (selectedRoom === 'Kitchen') {
      return (
        <>
         {/* Render cabinet color options*/}
          {roomData?.cabinet_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Cabinet Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.cabinet_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCabinetImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedCabinetImage, selectedCabinetImage, color.image, 'cabinetImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

           {/* Render wall color options*/}
          {roomData?.wall_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wall Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wall_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedWallImage, selectedWallImage, color.image, 'wallImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

           {/* Render basin color options*/}
          {roomData?.basin_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Basin Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.basin_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedBasinImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedBasinImage, selectedBasinImage, color.image, 'basinImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      );
    }

    // If the room is Bedroom, show bedroom-related color options
    if (selectedRoom === 'Bedroom') {
      return (
        <>
          {roomData?.wall_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wall Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wall_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedWallImage, selectedWallImage, color.image, 'wallImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {roomData?.wardrobe_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wardrobe Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wardrobe_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWardrobeImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedWardrobeImage, selectedWardrobeImage, color.image, 'wardrobeImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      );
    }

    // If the room is Living Room, show living room-related color options
    if (selectedRoom === 'Living Room') {
      return (
        <>
          {roomData?.wall_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wall Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wall_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedWallImage, selectedWallImage, color.image, 'wallImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {roomData?.ceiling_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Ceiling Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.ceiling_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCeilingImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { handleColorClick(setSelectedCeilingImage, selectedCeilingImage, color.image, 'ceilingImage'); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      );
    }

    return null;
  };

  // Event handler for house selection 
  function handleHouseSelect(houseId: string): void {
    console.log('Selected House:', houseId);
  }

  // Event handler for room selection
  function handleRoomSelect(roomName: string): void {
    console.log('Selected Room:', roomName);
    setSelectedRoom(roomName); // Update the selected room
  }

  return (
    <div className="flex">
      {/* Sidebar Section */}
      <Sidebar
        currentPage="layout"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedHouseId={houseId} // Use houseId here
        rooms={roomData.rooms || []} // Ensure roomData has a rooms array
        onHouseSelect={handleHouseSelect}
        onRoomSelect={handleRoomSelect}
      />

      {/* Main Content Section */}
      <div className={`flex-grow ${isSidebarOpen ? 'ml-50' : 'ml-60'} p-10`}>
        <div className="flex justify-end h-full">
          {/* Content with Image and Options */}
          <div className="flex flex-col items-center w-full lg:flex-row lg:justify-between h-full">
            {/* Sidebar with Color Options */}
            <div className="lg:w-1/5 bg-gray-100 p-4 rounded-lg shadow-md h-full">
              <h2 className="text-2xl font-bold mb-4">{roomName}</h2>
              {renderColorOptions()} {/* Render color options dynamically */}
            </div>

            {/* Room Image Section */}
            <div className="relative lg:w-2/3 lg:ml-8 mt-8 lg:mt-0 mx-auto h-full">
              {/* Display wall image */}
              {roomData?.images?.length > 0 && (
                <Image
                  src={selectedWallImage || roomData.images[0]?.image_path}
                  alt="Room Wall"
                  width={900}
                  height={800}
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg shadow-lg"
                />
              )}

              {/* Overlay images for other room features */}
              {selectedCabinetImage && (
                <Image
                  src={selectedCabinetImage}
                  alt="Cabinet Image"
                  width={900}
                  height={800}
                  style={{ objectFit: 'cover' }}
                  className="absolute top-0 left-0 rounded-lg shadow-lg opacity-75"
                />
              )}

              {selectedCeilingImage && (
                <Image
                  src={selectedCeilingImage}
                  alt="Ceiling Image"
                  width={900}
                  height={800}
                  style={{ objectFit: 'cover' }}
                  className="absolute top-0 left-0 rounded-lg shadow-lg opacity-50"
                />
              )}

              {selectedWardrobeImage && (
                <Image
                  src={selectedWardrobeImage}
                  alt="Wardrobe Image"
                  width={900}
                  height={800}
                  style={{ objectFit: 'cover' }}
                  className="absolute top-0 left-0 rounded-lg shadow-lg opacity-40"
                />
              )}

              {/* Back to Home Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleBack}
                  className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
