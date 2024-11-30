"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Sidebar from "../layout/Sidebar";

interface BedroomColor {
  name: string;
  image: string;
  color: string;
}

const BedroomPage = () => {
  const [wallColors, setWallColors] = useState<BedroomColor[]>([]);
  const [selectedWallImage, setSelectedWallImage] = useState<string>(""); 
  const [selectedWallColor, setSelectedWallColor] = useState<string>("");
  const [defaultImage, setDefaultImage] = useState<string>(""); // Store default image

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
    const fetchBedroomData = async () => {
      if (!houseId || !sessionId) return;
  
      try {
        const response = await fetch(
          `http://localhost:5000/room-data?room_name=Bedroom&house_id=${houseId}&session_id=${sessionId}`
        );
        const data = await response.json();
  
        if (data.room_name) {
          setWallColors(data.wall_colors || []);
          setDefaultImage(data.images[0]?.image_path || "");  // Set default image path
          if (data.wall_colors?.length > 0) {
            const selectedImage = data.wall_colors[0]?.image || "";
            setSelectedWallColor(data.wall_colors[0]?.color || "");
            setSelectedWallImage(selectedImage);
          }
        }
      } catch (error) {
        console.error("Error fetching bedroom data:", error);
      }
    };
  
    fetchBedroomData();
  }, [houseId, sessionId]);

  const updateSelection = async () => {
    if (!sessionId || !houseId) {
      console.error("Session ID or House ID is missing.");
      return;
    }

    const data = {
      house_id: houseId,
      session_id: sessionId,
      selected_rooms: ["bedroom"],
      wall_colors: selectedWallImage ? [{ image: selectedWallImage, color: selectedWallColor }] : [],
    };

    try {
      const response = await fetch("http://localhost:5000/select-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Bedroom selection updated:", result);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  const handleWallColorChange = (color: string, image: string): void => {
    if (selectedWallImage === image) {
      // Deselect and show the default image when the same color is clicked
      setSelectedWallImage(defaultImage); // Set to default image
      setSelectedWallColor(""); // Clear the selected color
    } else {
      // Set the selected color and image
      setSelectedWallColor(color);
      setSelectedWallImage(image);
    }
    updateSelection();
  };

  return (
    <div className="flex">
      <Sidebar currentPage="bedroom" isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1">
          <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
            <h2 className="text-xl font-bold mb-4">Walls</h2>
            <div className="relative mb-10">
              <p className="mb-4 text-lg">Select Color</p>
              <div className="flex p-2 space-x-4">
                {wallColors.map((color, index) => (
                  <div
                    key={index}
                    className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? "border-4 border-green-500" : ""}`}
                    onClick={() => handleWallColorChange(color.color, color.image)}
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
              {/* Render selected wall image or default image */}
              <Image
                src={selectedWallImage || defaultImage}
                alt="Selected Bedroom"
                width={900}
                height={800}
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
              />
            </div>

            {/* Add the Button Below the Image */}
            <div className="mt-4">
              <button
                onClick={() => router.push("/gallery")}  // Navigate to home page on button click (for example)
                className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedroomPage;
