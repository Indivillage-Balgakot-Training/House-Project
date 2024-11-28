"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // useSearchParams to access query params
import Sidebar from './Sidebar';

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
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get query parameters from the URL
  const houseId = searchParams.get('house_id');
  const sessionId = searchParams.get('session_id');
  const houseName = searchParams.get('house_name');
  const [error, setError] = useState<string | null>(null); // State hook for error

  const [storedHouseId, setStoredHouseId] = useState<string | null>(null); // Store houseId
  const [storedSessionId, setStoredSessionId] = useState<string | null>(null); // Store sessionId

  useEffect(() => {
    if (!houseId || !sessionId) {
      console.error("Missing house_id, or session_id");
      return;
    }

    console.log('Received from query params:', { houseId, sessionId });

    setStoredHouseId(houseId);
    setStoredSessionId(sessionId);

    const fetchLayoutData = async () => {
      try {
        const layoutResponse = await fetch(`http://localhost:5000/rooms/${houseId}`);
        if (!layoutResponse.ok) {
          throw new Error(`Failed to fetch layout data: ${layoutResponse.statusText}`);
        }
        const data: LayoutData = await layoutResponse.json();
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

  const handleClick = async (area: string) => {
    console.log(`Clicked on ${area}`);
    if (!storedHouseId || !storedSessionId || !area) {
      console.error("Missing houseId, sessionId, or area");
      return;
    }

    const requestData = {
      house_id: storedHouseId,
      session_id: storedSessionId,
      selected_rooms: [area],
    };

    console.log("Sending data to backend:", requestData);

    try {
      const response = await fetch('http://localhost:5000/select-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to save selection');
      }

      const result = await response.json();
      console.log(`${area} saved successfully!`);

      router.push(`/${area}?house_id=${storedHouseId}&session_id=${storedSessionId}`);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
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

          {/* Create div elements for each area for hover effects */}
          <div className="absolute top-0 left-0">
            {layoutData?.rooms.flatMap((room) =>
              room.areas.map((area) => (
                <div
                  key={area.name}
                  onClick={() => handleClick(area.name)}
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