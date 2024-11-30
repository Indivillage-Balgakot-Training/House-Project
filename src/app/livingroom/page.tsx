"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Sidebar from "../layout/Sidebar";

interface LivingRoomColor {
  name: string;
  image: string;
  color: string;
}

const LivingRoomPage = () => {
  const [cabinetColors, setCabinetColors] = useState<LivingRoomColor[]>([]);
  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string>(""); 
  const [selectedCabinetColor, setSelectedCabinetColor] = useState<string>(""); 

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const router = useRouter();
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
          setCabinetColors(data.cabinet_colors || []);
          if (data.cabinet_colors?.length > 0) {
            setSelectedCabinetColor(data.cabinet_colors[0]?.color || "");
            setSelectedCabinetImage(data.cabinet_colors[0]?.image || "");
          }
        }
      } catch (error) {
        console.error("Error fetching living room data:", error);
      }
    };

    fetchLivingRoomData();
  }, [houseId, sessionId]);

  const updateSelection = async () => {
    if (!sessionId || !houseId) {
      console.error("Session ID or House ID is missing.");
      return;
    }

    const data = {
      house_id: houseId,
      session_id: sessionId,
      selected_rooms: ["living_room"],
      cabinet_colors: selectedCabinetImage ? [{ image: selectedCabinetImage, color: selectedCabinetColor }] : [],
    };

    try {
      const response = await fetch("http://localhost:5000/select-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Living room selection updated:", result);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  const handleCabinetColorChange = (color: string, image: string): void => {
    setSelectedCabinetColor(color);
    setSelectedCabinetImage(image);
    updateSelection();
  };

  return (
    <div className="flex">
      <Sidebar currentPage="living_room" isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1">
          <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
            <h2 className="text-xl font-bold mb-4">Cabinets</h2>
            <div className="relative mb-10">
              <p className="mb-4 text-lg">Select Color</p>
              <div className="flex p-2 space-x-4">
                {cabinetColors.map((color, index) => (
                  <div
                    key={index}
                    className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCabinetImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => handleCabinetColorChange(color.color, color.image)}
                  >
                    <div
                      className="w-8 h-8 rounded shadow-md"
                      style={{ backgroundColor: color.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-3/4 flex items-center justify-center flex-col">
            <div className="relative">
              {selectedCabinetImage && (
                <Image
                  src={selectedCabinetImage}
                  alt="Selected Living Room"
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
