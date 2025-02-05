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
  const router = useRouter();

  const houseId = searchParams.get('house_id');

  const getSessionIdFromCookies = (): string | null => {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('session_id='))
      ?.split('=')[1] || null;
  };

  const sessionId = getSessionIdFromCookies();

  useEffect(() => {
    if (!houseId) {
      setError('Missing house_id');
      return;
    }

    const fetchLayoutData = async () => {
      try {
        // Fetch the layout data without the session_id in the query string
        const layoutResponse = await fetch(`http://localhost:5000/rooms/${houseId}`, {
          credentials: 'same-origin',  // Ensure the session cookie is sent automatically
        });

        if (!layoutResponse.ok) {
          throw new Error(`Failed to fetch layout data: ${layoutResponse.statusText}`);
        }

        const data: LayoutData = await layoutResponse.json();
        setLayoutData(data);

        // Set rooms data for the selected house
        const roomNames = data.rooms.map((room) => room.name);
        setRooms(roomNames);

        setSelectedHouseId(houseId); // Set selected house ID
      } catch (error) {
        console.error('Error fetching layout data:', error);
        setError('Failed to load layout data');
      }
    };

    fetchLayoutData();
  }, [houseId]);

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = (room: string) => {
    if (!houseId || !room) {
      console.error('Missing houseId or room');
      return;
    }

    // Navigate to the room layout page
    router.push(`/rooms?house_id=${houseId}&room_name=${room}`);
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
        onHouseSelect={() => {}}
        onRoomSelect={() => {}}
        houses={[]} // Pass an empty array for houses since we're not using it in LayoutPage
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