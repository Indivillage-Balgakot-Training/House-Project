'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '../gallery/Sidebar';

const RoomsPage = () => {
  const [roomData, setRoomData] = useState<any>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const searchParams = useSearchParams();
  const router = useRouter();

  const houseId = searchParams.get('house_id');
  const sessionId = searchParams.get('session_id');
  const roomName = searchParams.get('room_name');

  const [selectedRoom, setSelectedRoom] = useState<string>(roomName || '');
  const [selectedImages, setSelectedImages] = useState<any>({});

  const storageKey = `room-selections-${sessionId}`;

  useEffect(() => {
    if (!houseId || !sessionId || !roomName) return;

    const fetchRoomData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/room-data?house_id=${houseId}&session_id=${sessionId}&room_name=${roomName}`
        );
        const data = await response.json();
        setRoomData(data);

        const savedSelections = sessionStorage.getItem(storageKey);
        if (savedSelections) {
          const parsedSelections = JSON.parse(savedSelections);
          setSelectedImages(parsedSelections || {});
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [houseId, sessionId, roomName]);

  const handleBack = () => {
    router.push(`/gallery?house_id=${houseId}&session_id=${sessionId}`);
  };

  const handleColorClick = (colorKey: string, image: string | null, category: string) => {
    const newSelection = selectedImages[colorKey] === image ? null : image;
    setSelectedImages((prevState: any) => {
      const newState = { ...prevState, [colorKey]: newSelection };
      sessionStorage.setItem(storageKey, JSON.stringify(newState));
      return newState;
    });
  };

  const renderColorOptions = () => {
    if (!roomData?.images) return null;

    return Object.keys(roomData).map((category) => {
      const categoryData = roomData[category];
      if (Array.isArray(categoryData) && categoryData.length > 0) {
        return (
          <div key={category}>
            <h3 className="text-xl mt-6 mb-2">{category.replace(/([A-Z])/g, ' $1')}</h3>
            <div className="flex p-2 space-x-4">
              {categoryData.map((color: any, index: number) => (
                <div
                  key={index}
                  className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedImages[category] === color.image ? 'border-4 border-green-500' : ''}`}
                  onClick={() => handleColorClick(category, color.image, category)}
                >
                  <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
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
          setSelectedRoom(roomName);
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
              

              {Object.keys(selectedImages).map((key) => {
                if (selectedImages[key]) {
                  return (
                    <Image
                      key={key}
                      src={selectedImages[key]}
                      alt={key}
                      width={900}
                      height={800}
                      style={{ objectFit: 'cover' }}
                      className={`absolute top-0 left-0 rounded-lg shadow-lg opacity-${key === 'ceilingImage' ? 50 : 75}`}
                    />
                  );
                }
                return null;
              })}

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
