'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SidebarProps {
  onHouseSelect: (houseId: string) => void;
  onRoomSelect: (roomName: string) => void;
  currentPage?: string;
  isOpen: boolean;
  toggleSidebar: () => void;
  selectedHouseId: string | null;
  rooms: string[]; // Receive rooms dynamically
}

const Sidebar: React.FC<SidebarProps> = ({
  onHouseSelect,
  onRoomSelect,
  currentPage,
  isOpen,
  toggleSidebar,
  selectedHouseId,
  rooms,
}) => {
  const [houses, setHouses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get('http://localhost:5000/houses', { withCredentials: true })
      .then((response) => {
        setHouses(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('Error fetching houses');
        setLoading(false);
        console.error('Error fetching houses:', error);
      });
  }, []);

  const handleHouseSelect = (houseId: string) => {
    onHouseSelect(houseId);
  };

  const handleRoomSelect = (roomName: string) => {
    onRoomSelect(roomName);
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <div className="w-64 bg-gray-900 p-4 flex flex-col space-y-6 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">Available Houses</h2>
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {houses.length === 0 && <div>No houses available</div>}

        <div className="flex flex-col space-y-4">
          {houses.map((house) => (
            <div
              key={house.house_id}
              className="cursor-pointer p-2 rounded-md hover:bg-gray-700"
              onClick={() => handleHouseSelect(house.house_id)}
            >
              <div className="flex items-center">
                <img
                  src={house.house_image || ''}
                  alt={house.house_name}
                  className="w-12 h-12 rounded-md mr-4"
                />
                <span>{house.house_name}</span>
              </div>
            </div>
          ))}
        </div>

        {selectedHouseId && rooms.length > 0 ? (
          <>
            <h3 className="text-xl font-semibold mt-8 mb-4">Rooms</h3>
            <div className="flex flex-col space-y-4">
              {rooms.map((roomName) => (
                <div
                  key={roomName}
                  className="cursor-pointer p-2 rounded-md hover:bg-gray-700"
                  onClick={() => handleRoomSelect(roomName)}
                >
                  <span>{roomName}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-400">No rooms available for this house</div>
        )}
      </div>
    </div>
  );
};
//code

export default Sidebar;
