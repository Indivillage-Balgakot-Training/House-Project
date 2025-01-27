'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from '../gallery/Sidebar';

interface Area {
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
}

interface Room {
  name: string;
  areas: Area[];
}

interface LayoutData {
  rooms_image: string;
  rooms: Room[];
  house_id: string;
}

const LayoutPage = () => {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [rooms, setRooms] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const house_id = searchParams.get('house_id');
  const router = useRouter();

  // Log house_id to verify it's being fetched correctly
  useEffect(() => {
    console.log('house_id:', house_id);  // Log house_id to check if it's being fetched

    if (!house_id) {
      setError('Missing house_id');
      return;
    }

    const fetchLayoutData = async () => {
      try {
        const layoutResponse = await fetch(`http://localhost:5000/rooms/${house_id}`);
        if (!layoutResponse.ok) {
          throw new Error(`Failed to fetch layout data: ${layoutResponse.statusText}`);
        }
        const data: LayoutData = await layoutResponse.json();
        setLayoutData(data);

        // Set rooms data for the selected house
        const roomNames = data.rooms.map(room => room.name);
        setRooms(roomNames);

        setSelectedHouseId(house_id); // Set selected house ID
      } catch (error) {
        console.error('Error fetching layout data:', error);
        setError('Failed to load layout data');
      }
    };

    fetchLayoutData();
  }, [house_id]);

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = (room: string) => {
    if (!house_id || !room) {
      console.error("Missing houseId or room");
      return;
    }

    // Pass session_id as a parameter if necessary
    const sessionId = 'your-session-id';  // Set session_id dynamically if needed
    router.push(`/rooms?house_id=${house_id}&session_id=${sessionId}&room_name=${room}`);
  };

  const handleHouseSelect = (houseId: string) => {
    setSelectedHouseId(houseId);
  };

  const handleRoomSelect = (roomName: string) => {
    console.log('Selected Room:', roomName);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex">
      <Sidebar
        currentPage="layout"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        selectedHouseId={selectedHouseId}
        rooms={rooms}
        onHouseSelect={handleHouseSelect}
        onRoomSelect={handleRoomSelect}
      />
      <div className={`flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="relative">
          {layoutData?.rooms_image && (
            <Image
              src={layoutData.rooms_image}
              alt="Layout Image"
              width={800}
              height={600}
              useMap="#image-map"
            />
          )}

          <div className="absolute top-0 left-0">
            {layoutData?.rooms?.map((room) =>
              room.areas?.map((area) => (
                <div
                  key={area.name}
                  onClick={() => handleClick(room.name)} // Navigate to the room page
                  onMouseEnter={() => handleMouseEnter(area.name)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    position: 'absolute',
                    left: `${area.left}px`,
                    top: `${area.top}px`,
                    width: `${area.width}px`,
                    height: `${area.height}px`,
                    cursor: 'pointer',
                    backgroundColor: hoveredArea === area.name ? area.color : 'transparent',
                    opacity: hoveredArea === area.name ? 0.7 : 1,
                    zIndex: 1,
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;