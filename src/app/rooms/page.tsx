"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Sidebar from "../layout/Sidebar";

interface KitchenColor {
  name: string;
  image: string;
  color: string;
}

interface BedroomColor {
  name: string;
  image: string;
  color: string;
}

interface WardrobeColor {
  color: string;
  image: string;
}

const HomePage = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>("Kitchen"); // State for selected room
  const [roomData, setRoomData] = useState<any>({});
  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string>("");
  const [selectedWallImage, setSelectedWallImage] = useState<string>("");
  const [selectedBasinImage, setSelectedBasinImage] = useState<string>("");

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const [houseId, setHouseId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const house_id = searchParams.get("house_id");
    const session_id = searchParams.get("session_id");

    if (house_id) setHouseId(house_id);
    if (session_id) setSessionId(session_id);
  }, [searchParams]);

  // Fetch data for the selected room
  useEffect(() => {
    const fetchData = async () => {
      if (!houseId || !sessionId) return;

      try {
        const roomResponse = await fetch(
          `http://localhost:5000/room-data?room_name=${selectedRoom}&house_id=${houseId}&session_id=${sessionId}`
        );
        const roomData = await roomResponse.json();

        if (roomData.room_name) {
          setRoomData(roomData);
          // Set initial selected colors and images based on the room's available data
          if (roomData.cabinet_colors) setSelectedCabinetImage(roomData.cabinet_colors[0]?.image || "");
          if (roomData.wall_colors) setSelectedWallImage(roomData.wall_colors[0]?.image || "");
          if (roomData.basin_colors) setSelectedBasinImage(roomData.basin_colors[0]?.image || "");
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    fetchData();
  }, [houseId, sessionId, selectedRoom]);

  // Handle the room selection change
  const handleRoomSelect = (room: string) => {
    setSelectedRoom(room); // Set the selected room and fetch its data
  };

  // Update selection function for each room
  const updateSelection = async () => {
    if (!sessionId || !houseId) {
      console.error("Session ID or House ID is missing.");
      return;
    }

    const data = {
      house_id: houseId,
      session_id: sessionId,
      selected_rooms: [selectedRoom],
      kitchen: {
        cabinet_colors: selectedCabinetImage ? [{ image: selectedCabinetImage }] : [],
        wall_colors: selectedWallImage ? [{ image: selectedWallImage }] : [],
        basin_colors: selectedBasinImage ? [{ image: selectedBasinImage }] : [],
      },
      bedroom: {
        wall_colors: selectedWallImage ? [{ image: selectedWallImage }] : [],
        wardrobe_colors: selectedBasinImage ? [{ image: selectedBasinImage }] : [],
      },
    };

    try {
      const response = await fetch("http://localhost:5000/select-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Room selection updated:", result);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  const handleBackToHome = async () => {
    if (!houseId || !sessionId) {
      console.error("House ID or Session ID is missing.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ house_id: houseId, session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to unlock houses");
      }

      router.push("/gallery");
    } catch (error) {
      console.error("Error unlocking houses:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar: Room Selection and Color Options */}
      <Sidebar currentPage="home" isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1">
        {/* Color Selections and Room Selection Inside Sidebar */}
        <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
          <div className="space-y-4">
            {/* Room selection buttons */}
            {["Kitchen", "Bedroom", "Living Room"].map((room) => (
              <button
                key={room}
                onClick={() => handleRoomSelect(room)}
                className={`px-4 py-2 text-white rounded-lg ${selectedRoom === room ? "bg-blue-500" : "bg-gray-400"}`}
              >
                {room}
              </button>
            ))}
          </div>

          {/* Color Options Based on Selected Room */}
          {selectedRoom === "Kitchen" && roomData?.cabinet_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Cabinet Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.cabinet_colors.map((color: KitchenColor, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCabinetImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => { setSelectedCabinetImage(color.image); updateSelection(); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedRoom === "Kitchen" && roomData?.wall_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wall Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wall_colors.map((color: KitchenColor, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => { setSelectedWallImage(color.image); updateSelection(); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedRoom === "Kitchen" && roomData?.basin_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Basin Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.basin_colors.map((color: KitchenColor, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedBasinImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => { setSelectedBasinImage(color.image); updateSelection(); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Bedroom Color Options */}
          {selectedRoom === "Bedroom" && roomData?.wall_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wall Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wall_colors.map((color: BedroomColor, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => { setSelectedWallImage(color.image); updateSelection(); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}

          {selectedRoom === "Bedroom" && roomData?.wardrobe_colors && (
            <>
              <h3 className="text-xl mt-6 mb-2">Wardrobe Colors</h3>
              <div className="flex p-2 space-x-4">
                {roomData.wardrobe_colors.map((color: WardrobeColor, index: number) => (
                  <div
                    key={index}
                    className={`cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedBasinImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => { setSelectedBasinImage(color.image); updateSelection(); }}
                  >
                    <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Room Image and Content */}
        <div className="w-3/4 flex items-center justify-center flex-col p-4">
          <h2 className="text-2xl font-bold mb-4">{selectedRoom}</h2>

          {/* Display Room-specific Content */}
          {selectedRoom === "Kitchen" && roomData?.images && (
            <>
              <h3 className="text-xl mb-2">Kitchen Image</h3>
              <Image
                src={selectedCabinetImage || roomData.images[0]?.image_path}
                alt="Selected Kitchen Image"
                width={1000}
                height={800}
                className="rounded-lg shadow-lg mb-8"
              />
            </>
          )}

          {selectedRoom === "Living Room" && roomData?.images && (
            <>
              <h3 className="text-xl mb-2">Living Room Image</h3>
              <Image
                src={roomData.images[0]?.image_path}
                alt="Living Room"
                width={1000}
                height={800}
                className="rounded-lg shadow-lg mb-8"
              />
            </>
          )}

          {selectedRoom === "Bedroom" && roomData?.images && (
            <>
              <h3 className="text-xl mb-2">Bedroom Image</h3>
              <Image
                src={selectedWallImage || roomData.images[0]?.image_path}
                alt="Selected Bedroom Image"
                width={1000}
                height={800}
                className="rounded-lg shadow-lg mb-8"
              />
            </>
          )}

          <button onClick={handleBackToHome} className="bg-blue-500 text-white py-2 px-6 rounded-full">
            Back to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
