"use client"; // Mark the component as a Client Component

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Keep this if needed for navigation
import { useSearchParams } from "next/navigation"; // Import the useSearchParams hook
import Sidebar from "../layout/Sidebar"; // Ensure the casing matches

// Define types for kitchen images
interface KitchenImage {
  name: string;
  image: string;
  color: string;
}

const KitchenPage = () => {
  const [cabinetImages, setCabinetImages] = useState<KitchenImage[]>([]);
  const [wallImages, setWallImages] = useState<KitchenImage[]>([]);
  const [basinImages, setBasinImages] = useState<KitchenImage[]>([]);

  const [selectedCabinetImage, setSelectedCabinetImage] = useState<string>("/images/kitchen.jpg"); // Default cabinet image
  const [selectedWallImage, setSelectedWallImage] = useState<string>("/images/kitchen.jpg"); // Default wall image
  const [selectedBasinImage, setSelectedBasinImage] = useState<string>("/images/kitchen.jpg"); // Default basin image
  const [selectedCabinetColor, setSelectedCabinetColor] = useState<string>(""); // Store the hex value of the selected cabinet color
  const [selectedWallColor, setSelectedWallColor] = useState<string>(""); // Store the hex value of the selected wall color
  const [selectedBasinColor, setSelectedBasinColor] = useState<string>("");

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Sidebar state

  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params using useSearchParams hook

  const [houseId, setHouseId] = useState<string | null>(null); // State to store house_id
  const [sessionId, setSessionId] = useState<string | null>(null); // State to store session_id

  useEffect(() => {
    // Get house_id from URL parameters using searchParams
    const house_id = searchParams.get("house_id");

    if (house_id) {
      setHouseId(house_id); // Set the house_id from the URL
    } else {
      console.error("No house_id in the URL.");
    }
  }, [searchParams]); // Re-run when the URL query parameters change

  useEffect(() => {
    const fetchHouseDetails = async () => {
      if (!houseId) return; // Don't make the request until we have a house_id

      try {
        const response = await fetch("http://localhost:5000/select-house", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ house_id: houseId }), // Use dynamic house_id
        });
        const data = await response.json();
        if (data.session_id && data.house_id) {
          setSessionId(data.session_id); // Store session_id from backend response
        } else {
          console.error("Failed to retrieve session or house id.");
        }
      } catch (error) {
        console.error("Error fetching house details:", error);
      }
    };

    fetchHouseDetails();
  }, [houseId]);

  useEffect(() => {
    const fetchKitchenData = async () => {
      try {
        const response = await fetch("http://localhost:5000/room-data?room_name=Kitchen");
        const data = await response.json();

        // Check if data is returned and handle null values
        if (data.room_name) {
          setCabinetImages(data.cabinet_colors || []);
          setWallImages(data.wall_colors || []);
          setBasinImages(data.basin_colors || []);

          // Set default selections if there are available colors
          if (data.cabinet_colors && data.cabinet_colors.length > 0) {
            setSelectedCabinetImage(data.cabinet_colors[0]?.image || "/images/kitchen.jpg");
            setSelectedCabinetColor(data.cabinet_colors[0]?.color || "");
          }

          if (data.basin_colors && data.basin_colors.length > 0) {
            setSelectedBasinImage(data.basin_colors[0]?.image || "/images/kitchen.jpg");
            setSelectedBasinColor(data.basin_colors[0]?.color || "");
          }

          if (data.wall_colors && data.wall_colors.length > 0) {
            setSelectedWallImage(data.wall_colors[0]?.image || "/images/Wall1.jpg");
            setSelectedWallColor(data.wall_colors[0]?.color || "");
          }
        } else {
          console.error("Room data not found");
        }
      } catch (error) {
        console.error("Error fetching kitchen data:", error);
      }
    };

    fetchKitchenData();
  }, []);

  const updateSelection = async () => {
    if (!sessionId || !houseId) {
      console.error("Session ID or House ID is missing.");
      return; // Prevent the update if session or house ID is not available
    }

    const cabinetColor = selectedCabinetImage !== "/images/kitchen.jpg" ? selectedCabinetImage : null;
    const wallColor = selectedWallImage !== "/images/kitchen.jpg" ? selectedWallImage : null;
    const basinColor = selectedBasinImage !== "/images/kitchen.jpg" ? selectedBasinImage : null;

    const cabinetColorHex = selectedCabinetColor;
    const wallColorHex = selectedWallColor;
    const basinColorHex = selectedBasinColor;

    const data = {
      house_id: houseId, // Use dynamic house_id
      session_id: sessionId, // Use dynamic session_id
      selected_rooms: ["kitchen"], // Assume we are always working with the kitchen room
      cabinet_colors: cabinetColor ? [{ image: cabinetColor, color: cabinetColorHex }] : [],
      wall_colors: wallColor ? [{ image: wallColor, color: wallColorHex }] : [],
      basin_colors: basinColor ? [{ image: basinColor, color: basinColorHex }] : [],
    };

    console.log("Data being sent to the backend:", JSON.stringify(data));

    try {
      const response = await fetch("http://localhost:5000/select-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Color selection updated:", result);
    } catch (error) {
      console.error("Error updating selection:", error);
    }
  };

  const handleCabinetColorChange = (color: string, image: string) => {
    if (image === selectedCabinetImage) {
      setSelectedCabinetImage("/images/kitchen.jpg");
      setSelectedCabinetColor("");
    } else {
      setSelectedCabinetImage(image);
      setSelectedCabinetColor(color);
      updateSelection();
    }
  };

  const handleWallColorChange = (color: string, image: string) => {
    if (image === selectedWallImage) {
      setSelectedWallImage("/images/kitchen.jpg");
      setSelectedWallColor("");
    } else {
      setSelectedWallImage(image);
      setSelectedWallColor(color);
      updateSelection();
    }
  };

  const handleBasinColorChange = (color: string, image: string) => {
    if (image === selectedBasinImage) {
      setSelectedBasinImage("/images/kitchen.jpg");
      setSelectedBasinColor("");
    } else {
      setSelectedBasinImage(image);
      setSelectedBasinColor(color);
      updateSelection();
    }
  };

  const handleBackToHome = () => {
    router.push("/gallery");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      <Sidebar currentPage="kitchen" isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col w-full h-screen">
        <div className="flex flex-1">
          {/* Selection Section for Colors */}
          <div className="w-1/4 bg-white shadow-md p-4 flex flex-col items-start">
            {/* Cabinets Section */}
            <h2 className="text-xl font-bold mb-4">Cabinets</h2>
            <div className="relative mb-10">
              <p className="mb-4 text-lg">Select Color</p>
              <div className="flex p-2 space-x-4 w-6/6 bg-white-400 shadow-md p-4">
                {cabinetImages.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => handleCabinetColorChange(color.color, color.image)}
                    className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedCabinetImage === color.image ? "border-4 border-green-500" : ""}`}
                  >
                    <div
                      className="w-8 h-8 rounded shadow-md"
                      style={{ backgroundColor: color.color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Wall Section */}
            <h2 className="text-xl font-bold mb-4">Wall</h2>
            <div className="mb-10">
              <p className="mb-4 text-lg">Select Color</p>
              <div className="flex p-2 space-x-4 w-6/6 bg-white-400 shadow-md p-4">
                {wallImages.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => handleWallColorChange(color.color, color.image)}
                    className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedWallImage === color.image ? "border-4 border-green-500" : ""}`}
                  >
                    <div
                      className="w-8 h-8 rounded shadow-md"
                      style={{ backgroundColor: color.color }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Basin Section */}
            <h2 className="text-xl font-bold mb-4">Basin</h2>
            <div className="mb-20">
              <p className="mb-4 text-lg">Select Color</p>
              <div className="flex p-2 space-x-4 w-4/5 bg-white-400 shadow-md p-4">
                {basinImages.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => handleBasinColorChange(color.color, color.image)}
                    className={`flex items-center cursor-pointer hover:bg-gray-200 p-1 rounded ${selectedBasinImage === color.image ? "border-4 border-green-500" : ""}`}
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

          {/* Display Selected Image */}
          <div className="w-3/4 flex items-center justify-center flex-col">
            <div className="relative">
              {/* Base kitchen image */}
              <Image
                src="/images/kitchen.jpg" // Replace with your default base image
                alt="Kitchen"
                width={1000}
                height={800}
                style={{ objectFit: "cover" }}
                className="rounded-lg shadow-lg"
              />

              {/* Overlay selected cabinet color */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${selectedCabinetImage})`,
                  backgroundSize: "cover",
                  opacity: 1,
                  pointerEvents: 'none',
                  mixBlendMode: 'overlay',
                  filter: 'brightness(1.2) saturation(1.5)',
                }}
                className="rounded-lg"
              />

              {/* Overlay selected wall color */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${selectedWallImage})`,
                  backgroundSize: "cover",
                  opacity: 0.6,
                  pointerEvents: 'none',
                  mixBlendMode: 'multiply',
                  filter: 'brightness(1.0) saturation(1.5)',
                }}
                className="rounded-lg"
              />

              {/* Overlay selected basin color */}
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${selectedBasinImage})`,
                  backgroundSize: "cover",
                  opacity: 0.6,
                  pointerEvents: 'none',
                  mixBlendMode: 'multiply',
                  filter: 'brightness(1.0) saturation(1.5)',
                }}
                className="rounded-lg"
              />
            </div>
            <button
              onClick={handleBackToHome}
              className="mt-4 px-4 py-2 text-black bg-yellow-500 hover:bg-yellow-400 shadow-lg rounded-lg transition "
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
