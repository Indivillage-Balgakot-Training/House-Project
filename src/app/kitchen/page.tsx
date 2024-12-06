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

const KitchenPage = () => {
  const [cabinetColors, setCabinetColors] = useState<KitchenColor[]>([]);
  const [wallColors, setWallColors] = useState<KitchenColor[]>([]);
  const [basinColors, setBasinColors] = useState<KitchenColor[]>([]);

  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string>(""); 
  const [selectedWallImage, setSelectedWallImage] = useState<string>(""); 
  const [selectedBasinImage, setSelectedBasinImage] = useState<string>("");

  const [defaultImage, setDefaultImage] = useState<string>(""); // Store default image

  const [selectedCabinetColor, setSelectedCabinetColor] = useState<string>(""); 
  const [selectedWallColor, setSelectedWallColor] = useState<string>(""); 
  const [selectedBasinColor, setSelectedBasinColor] = useState<string>("");

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
    const fetchKitchenData = async () => {
      if (!houseId || !sessionId) return;

      try {
        const response = await fetch(
          `http://localhost:5000/room-data?room_name=Kitchen&house_id=${houseId}&session_id=${sessionId}`
        );
        const data = await response.json();

        if (data.room_name) {
          setCabinetColors(data.cabinet_colors || []);
          setWallColors(data.wall_colors || []);
          setBasinColors(data.basin_colors || []);
          setDefaultImage(data.images[0]?.image_path || "");  // Set default image path
          
          // Set initial selections for each category
          if (data.cabinet_colors?.length > 0) {
            setSelectedCabinetColor(data.cabinet_colors[0]?.color || "");
            setSelectedCabinetImage(data.cabinet_colors[0]?.image || "");
          }

          if (data.wall_colors?.length > 0) {
            setSelectedWallColor(data.wall_colors[0]?.color || "");
            setSelectedWallImage(data.wall_colors[0]?.image || "");
          }

          if (data.basin_colors?.length > 0) {
            setSelectedBasinColor(data.basin_colors[0]?.color || "");
            setSelectedBasinImage(data.basin_colors[0]?.image || "");
          }
        }
      } catch (error) {
        console.error("Error fetching kitchen data:", error);
      }
    };

    fetchKitchenData();
  }, [houseId, sessionId]);

  const updateSelection = async () => {
    if (!sessionId || !houseId) {
      console.error("Session ID or House ID is missing.");
      return;
    }

    const data = {
      house_id: houseId,
      session_id: sessionId,
      selected_rooms: ["kitchen"],
      cabinet_colors: selectedCabinetImage ? [{ image: selectedCabinetImage, color: selectedCabinetColor }] : [],
      wall_colors: selectedWallImage ? [{ image: selectedWallImage, color: selectedWallColor }] : [],
      basin_colors: selectedBasinImage ? [{ image: selectedBasinImage, color: selectedBasinColor }] : [],
    };

    try {
      const response = await fetch("http://localhost:5000/select-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Color selection updated:", result);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  const handleCabinetColorChange = (color: string, image: string): void => {
    if (selectedCabinetImage === image) {
      // Deselect the color
      setSelectedCabinetColor("");
      setSelectedCabinetImage(""); // Reset to default
    } else {
      // Select the color
      setSelectedCabinetColor(color);
      setSelectedCabinetImage(image);
    }
    updateSelection();
  };

  const handleWallColorChange = (color: string, image: string): void => {
    if (selectedWallImage === image) {
      // Deselect the color
      setSelectedWallColor("");
      setSelectedWallImage(""); // Reset to default
    } else {
      // Select the color
      setSelectedWallColor(color);
      setSelectedWallImage(image);
    }
    updateSelection();
  };

  const handleBasinColorChange = (color: string, image: string): void => {
    if (selectedBasinImage === image) {
      // Deselect the color
      setSelectedBasinColor("");
      setSelectedBasinImage(""); // Reset to default
    } else {
      // Select the color
      setSelectedBasinColor(color);
      setSelectedBasinImage(image);
    }
    updateSelection();
  };

  const handleBackToHome = async () => {
    if (!houseId || !sessionId) {
      console.error("House ID or Session ID is missing.");
      return;
    }

    try {
      // Send request to unlock houses
      const response = await fetch("http://localhost:5000/exit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ house_id: houseId, session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to unlock houses");
      }

      // If unlocking is successful, navigate to the gallery page
      router.push("/gallery");
    } catch (error) {
      console.error("Error unlocking houses:", error);
    }
  };

  return (
    <div className="flex">
      <Sidebar currentPage="kitchen" isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1">
          <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
            {/* Cabinet Colors */}
            {cabinetColors.length > 0 && (
              <div className="relative mb-10">
                <h2 className="text-xl font-bold mb-4">Cabinets</h2>
                <p className="mb-4 text-lg">Select Color</p>
                <div className="flex p-2 space-x-4">
                  {cabinetColors.map((color, index) => (
                    <div
                      key={index}
                      className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCabinetImage === color.image ? "border-4 border-green-500" : ""}`}
                      onClick={() => handleCabinetColorChange(color.color, color.image)}
                    >
                      <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wall Colors */}
            {wallColors.length > 0 && (
              <div className="relative mb-10">
                <h2 className="text-xl font-bold mb-4">Walls</h2>
                <p className="mb-4 text-lg">Select Color</p>
                <div className="flex p-2 space-x-4">
                  {wallColors.map((color, index) => (
                    <div
                      key={index}
                      className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? "border-4 border-green-500" : ""}`}
                      onClick={() => handleWallColorChange(color.color, color.image)}
                    >
                      <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Basin Colors */}
            {basinColors.length > 0 && (
              <div className="relative mb-10">
                <h2 className="text-xl font-bold mb-4">Basin</h2>
                <p className="mb-4 text-lg">Select Color</p>
                <div className="flex p-2 space-x-4">
                  {basinColors.map((color, index) => (
                    <div
                      key={index}
                      className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedBasinImage === color.image ? "border-4 border-green-500" : ""}`}
                      onClick={() => handleBasinColorChange(color.color, color.image)}
                    >
                      <div className="w-8 h-8 rounded shadow-md" style={{ backgroundColor: color.color }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kitchen Image with Overlays */}
          <div className="w-3/4 flex items-center justify-center flex-col">
            <div className="relative">
              {/* Base kitchen image */}
              <Image
                src={selectedCabinetImage || defaultImage}
                alt="Selected Kitchen"
                width={1000}
                height={800}
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
              />

              {/* Overlay selected wall image */}
              {selectedWallImage && (
                <Image
                  src={selectedWallImage}
                  alt="Selected Wall"
                  width={500}
                  height={500}
                  className="absolute inset-0 w-full h-full object-cover opacity-50 rounded-md"
                />
              )}
            </div>

            {/* Back to Home Button */}
            <button
              className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition"
              onClick={handleBackToHome}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
