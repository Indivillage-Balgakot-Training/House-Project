"use client"; // Mark the component as a Client Component

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'; // useSearchParams to access query params
import Sidebar from './Sidebar';

// Define a type for the layout data
interface LayoutData {
  rooms_image: string;
  rooms: string[];
}

const LayoutPage = () => {
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null); // Now it's an object or null
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

  // Log the parameters to check if they're being extracted correctly
  useEffect(() => {
    if (!houseId || !sessionId) {
      console.error("Missing house_id, or session_id");
      return;
    }

    console.log('Received from query params:', { houseId, sessionId });

    // Store the session and house IDs in state
    setStoredHouseId(houseId);
    setStoredSessionId(sessionId);

    const fetchLayoutData = async () => {
      try {
        const layoutResponse = await fetch(`http://localhost:5000/rooms/${houseId}/${houseName}`);
        if (!layoutResponse.ok) {
          throw new Error(`Failed to fetch layout data: ${layoutResponse.statusText}`);
        }
        const data: LayoutData = await layoutResponse.json();
        setLayoutData(data); // Set the response data
      } catch (error) {
        console.error('Error fetching layout data:', error);
      }
    };

    fetchLayoutData();
  }, [houseId, houseName, sessionId]); // Re-run effect when params change

  // Handle mouse enter event (to highlight the area)
  const handleMouseEnter = (area: string) => {
    setHoveredArea(area);
  };

  // Handle mouse leave event (to remove the highlight)
  const handleMouseLeave = () => {
    setHoveredArea(null);
  };

  // Handle click event on a room area
  const handleClick = async (area: string) => {
    console.log(`Clicked on ${area}`);

    // Check if houseId, houseName, and sessionId are valid
    if (!storedHouseId || !storedSessionId || !area) {
      console.error("Missing houseId, sessionId, or area");
      return;
    }

    const requestData = {
      house_id: storedHouseId,
      session_id: storedSessionId,
      selected_rooms: [area], // Send selected room in an array
    };

    console.log("Sending data to backend:", requestData);  // Check what is being sent

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

      // Navigate to the selected room's page dynamically
      router.push(`/${area}?house_id=${storedHouseId}&session_id=${storedSessionId}`);

    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar
        currentPage="layout"
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className={`flex-grow ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <div className="relative">
          {/* Now using layoutData safely as an object */}
          <Image
            src={layoutData?.rooms_image || "/image2.jpg"} // Safe access with optional chaining
            alt="Layout Image"
            width={800}
            height={600}
            useMap="#image-map"
          />
          <map name="image-map">
            <area
              target="_self"
              alt="Gallery Area"
              title="Go to Gallery"
              href="/gallery" // Link back to the gallery
              coords="791,46,755,11"
              shape="rect"
            />
          </map>
          {/* Other clickable areas */}
          <div
            className={`absolute ${hoveredArea === 'bedroom' ? 'bg-red-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter('bedroom')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('bedroom')}
            style={{ left: '83px', top: '61px', width: '185px', height: '278px', zIndex: 10 }}
          />
          <div
            className={`absolute ${hoveredArea === 'openArea' ? 'bg-green-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter('openArea')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('openArea')}
            style={{ left: '268px', top: '59px', width: '119px', height: '280px', zIndex: 10 }}
          />
          <div
            className={`absolute ${hoveredArea === 'masterBedroom2' ? 'bg-blue-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter('masterBedroom2')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('masterBedroom2')}
            style={{ left: '388px', top: '58px', width: '163px', height: '281px', zIndex: 10 }}
          />
          <div
            className={`absolute ${hoveredArea === 'masterBedroom1' ? 'bg-yellow-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter('masterBedroom1')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('masterBedroom1')}
            style={{ left: '551px', top: '59px', width: '180px', height: '280px', zIndex: 10 }}
          />
          <div
            className={`absolute ${hoveredArea === 'guestBathroom' ? 'bg-purple-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter('guestBathroom')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('guestBathroom')}
            style={{ left: '80px', top: '337px', width: '189px', height: '134px', zIndex: 10 }}
          />
          <div
            className={`absolute ${hoveredArea === 'kitchen' ? 'bg-orange-500 opacity-50' : 'opacity-0'} transition-opacity duration-300`}
            onMouseEnter={() => handleMouseEnter('kitchen')}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick('kitchen')}
            style={{ left: '552px', top: '341px', width: '180px', height: '131px', zIndex: 10 }}
          />
        </div>
      </div>
    </div>
  );
};

export default LayoutPage;
