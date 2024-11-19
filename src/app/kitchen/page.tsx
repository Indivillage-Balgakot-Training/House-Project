"use client"; // Mark the component as a Client Component

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true); // Sidebar state

  const router = useRouter();

  useEffect(() => {
    const fetchKitchenData = async () => {
      try {
        const response = await fetch("http://localhost:5000/room-data?room_name=Kitchen");
        const data = await response.json();

        if (data.room_name) {
          setCabinetImages(data.cabinet_colors);
          setWallImages(data.wall_colors);
          setBasinImages(data.basin_colors);

          if (data.cabinet_colors.length > 0) {
            setSelectedCabinetImage(data.cabinet_colors[0]?.image || "/images/kitchen.jpg");
          }
          if (data.basins.length > 0) {
            setSelectedBasinImage(data.basins[0]?.image || "/images/kitchen.jpg");
          }
          if (data.walls.length > 0) {
            setSelectedWallImage(data.walls[0]?.image || "/images/Wall1.jpg");
          }
        }
      } catch (error) {
        console.error("Error fetching kitchen data:", error);
      }
    };

    fetchKitchenData();
  }, []);

  // Function to update selection in the backend
  const updateSelection = async () => {
    const cabinetColor = selectedCabinetImage !== "/images/kitchen.jpg" ? selectedCabinetImage : null;
    const wallColor = selectedWallImage !== "/images/kitchen.jpg" ? selectedWallImage : null;
    const basinColor = selectedBasinImage !== "/images/kitchen.jpg" ? selectedBasinImage : null;

    const data = {
      house_id: "house-001", // Replace with actual house ID
      session_id: "8ed6a495-bff6-4be0-8fda-cdfa788c99bb", // Replace with actual session ID if required
      selected_rooms: ["kitchen"], // Assume we are always working with the kitchen room
      cabinet_colors: cabinetColor ? [cabinetColor] : [], // Only send if color is selected
      wall_colors: wallColor ? [wallColor] : [], // Only send if color is selected
      basin_colors: basinColor ? [basinColor] : [], // Only send if color is selected
    };

    console.log("Data being sent to the backend:", data); // Debugging line

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
    console.log("Selected cabinet color:", color); // Debugging line
    if (image === selectedCabinetImage) {
      setSelectedCabinetImage("/images/kitchen.jpg"); // Deselect if it's already selected
    } else {
      setSelectedCabinetImage(image); // Select new color
      updateSelection(); // Update backend with the new color
    }
  };

  const handleWallColorChange = (color: string, image: string) => {
    console.log("Selected wall color:", color); // Debugging line
    if (image === selectedWallImage) {
      setSelectedWallImage("/images/kitchen.jpg"); // Deselect if it's already selected
    } else {
      setSelectedWallImage(image); // Select new color
      updateSelection(); // Update backend with the new color
    }
  };

  const handleBasinColorChange = (color: string, image: string) => {
    console.log("Selected basin color:", color); // Debugging line
    if (image === selectedBasinImage) {
      setSelectedBasinImage("/images/kitchen.jpg"); // Deselect if it's already selected
    } else {
      setSelectedBasinImage(image); // Select new color
      updateSelection(); // Update backend with the new color
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

            {/* Walls Section */}
            <h2 className="text-xl font-bold mb-4">Walls</h2>
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
            <button onClick={handleBackToHome} className="mt-4 px-4 py-2  text-black bg-yellow-500 hover:bg-yellow-400 shadow-lg  rounded-lg transition ">
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenPage;
