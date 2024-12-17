'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../layout/Sidebar';

const RoomsPage = () => {
  const [roomData, setRoomData] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const houseId = searchParams.get('house_id');
  const sessionId = searchParams.get('session_id');
  const roomName = searchParams.get('room_name');

  const [selectedRoom, setSelectedRoom] = useState<string>(roomName || '');
  const [selectedWallImage, setSelectedWallImage] = useState<string | null>(null);
  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string | null>(null);
  const [selectedBasinImage, setSelectedBasinImage] = useState<string | null>(null);
  const [selectedWardrobeImage, setSelectedWardrobeImage] = useState<string | null>(null);
  const [selectedCeilingImage, setSelectedCeilingImage] = useState<string | null>(null);

  useEffect(() => {
    if (!houseId || !sessionId || !roomName) return;

    const fetchRoomData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/room-data?house_id=${houseId}&session_id=${sessionId}&room_name=${roomName}`
        );
        const data = await response.json();
        setRoomData(data);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [houseId, sessionId, roomName]);

  const handleBack = () => {
    router.push(`/layout?house_id=${houseId}&session_id=${sessionId}`);
  };

  // Dynamic rendering of color options based on selected room
  const renderColorOptions = () => {
    if (selectedRoom === 'Kitchen') {
      return (
        <>
          {roomData?.cabinet_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Cabinet Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.cabinet_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCabinetImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { setSelectedCabinetImage(color.image); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {roomData?.wall_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wall Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wall_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { setSelectedWallImage(color.image); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {roomData?.basin_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Basin Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.basin_colors.map((color: any, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedBasinImage === color.image ? 'border-4 border-green-500' : ''}`}
                    onClick={() => { setSelectedBasinImage(color.image); }}
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
                    onClick={() => { setSelectedWallImage(color.image); }}
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
                    onClick={() => { setSelectedWardrobeImage(color.image); }}
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
                    onClick={() => { setSelectedWallImage(color.image); }}
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
                    onClick={() => { setSelectedCeilingImage(color.image); }}
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

  return (
    <div className="flex">
      {/* Sidebar Section */}
      <Sidebar
        currentPage="rooms"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Section */}
      <div className={`flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-16'} p-6`}>
        <div className="flex justify-center">
          {/* Content with Image and Options */}
          <div className="flex flex-col items-center w-full lg:flex-row lg:justify-between">
            {/* Sidebar with Color Options */}
            <div className="lg:w-1/4 bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">{roomName}</h2>
              {renderColorOptions()}
            </div>

            {/* Room Image Section */}
            <div className="relative lg:w-2/3 lg:ml-8">
              {/* Wall Image */}
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
            </div>
          </div>
        </div>

        {/* Back to Home Button below the image section */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleBack}
            className="bg-blue-500 text-white py-2 px-6 rounded-full"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
