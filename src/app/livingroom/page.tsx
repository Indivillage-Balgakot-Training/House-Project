"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Sidebar from "../layout/Sidebar";

const LivingRoomPage = () => {
  const [defaultImage, setDefaultImage] = useState<string>(""); // Store default image 

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const [houseId, setHouseId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const house_id = searchParams.get("house_id");
    const session_id = searchParams.get("session_id");

    if (house_id) setHouseId(house_id);
    if (session_id) setSessionId(session_id);
  }, [searchParams]);

  useEffect(() => {
    const fetchLivingRoomData = async () => {
      if (!houseId || !sessionId) return;

      try {
        const response = await fetch(
          `http://localhost:5000/room-data?room_name=livingroom&house_id=${houseId}&session_id=${sessionId}`
        );
        const data = await response.json();

        if (data.room_name) {
          setDefaultImage(data.images[0]?.image_path || ""); // Default image of the room
        }
      } catch (error) {
        console.error("Error fetching living room data:", error);
      }
    };

    fetchLivingRoomData();
  }, [houseId, sessionId]);

  return (
    <div className="flex">
      <Sidebar currentPage="living_room" isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1">
          <div className="w-3/4 flex items-center justify-center flex-col">
            <div className="relative">
              {/* Display the default image of the living room */}
              {defaultImage && (
                <Image
                  src={defaultImage}
                  alt="Living Room"
                  objectFit="cover"
                  width={1000}
                  height={800}
                  style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivingRoomPage;

                  