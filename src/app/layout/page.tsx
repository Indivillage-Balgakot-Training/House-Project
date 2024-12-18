'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // useSearchParams to access query params
import Sidebar from '../gallery/Sidebar';

interface Area {
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string; // Color for the area (optional, for highlighting)
}

interface Room {
  name: string;
  areas: Area[];
}

interface LayoutData {
  rooms_image: string;
  rooms: Room[];
}

const LayoutPage = () => {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null); // State to hold layout data
  const [hoveredArea, setHoveredArea] = useState<string | null>(null); // Track the area being hovered
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null); // Track the selected room
  const [roomDetails, setRoomDetails] = useState<any | null>(null); // Store selected room details
  const [error, setError] = useState<string | null>(null); // State hook for error

  const searchParams = useSearchParams();
  const router = useRouter();

  // Get query parameters from the URL
  const houseId = searchParams.get('house_id');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!houseId || !sessionId) {
      console.error("Missing house_id, or session_id");
      return;
    }

    const fetchLayoutData = async () => {
      try {
        const layoutResponse = await fetch(`http://localhost:5000/rooms/${houseId}`);
        if (!layoutResponse.ok) {
          throw new Error(`Failed to fetch layout data: ${layoutResponse.statusText}`);
        }
        const data: LayoutData = await layoutResponse.json();
        console.log(data);  // Check what data is received
        setLayoutData(data);
      } catch (error) {
        console.error('Error fetching layout data:', error);
        setError('Failed to load layout data');
      }
    };

    fetchLayoutData();
  }, [houseId, sessionId]);

  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  const handleClick = (room: string) => {
    if (!houseId || !sessionId || !room) {
      console.error("Missing houseId, sessionId, or room");
      return;
    }

    // Navigate to the room page with the selected room name
    router.push(`/rooms?house_id=${houseId}&session_id=${sessionId}&room_name=${room}`);
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

          {/* Check if rooms and areas exist */}
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
