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

  return (
    <div className="flex">
      <Sidebar
        currentPage="rooms"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold mb-4">{roomName}</h2>

          {roomData?.images?.length > 0 && (
            <Image
              src={roomData.images[0]?.image_path}
              alt={`${roomName} Image`}
              width={900}
              height={800}
              style={{ objectFit: 'cover' }}
              className="rounded-lg shadow-lg"
            />
          )}

          <button
            onClick={handleBack}
            className="bg-blue-500 text-white py-2 px-6 rounded-full mt-4"
          >
            Back to Layout
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
