import React from 'react';

interface SidebarProps {
  onHouseSelect: (houseId: string) => void;
  onRoomSelect: (roomName: string) => void;
  currentPage?: string;
  isOpen: boolean;
  toggleSidebar: () => void;
  selectedHouseId: string | null;
  rooms: string[]; // Receive rooms dynamically
  houses: any[]; // Receive houses from GalleryPage as a prop
}

const Sidebar: React.FC<SidebarProps> = ({
  onHouseSelect,
  onRoomSelect,
  currentPage,
  isOpen,
  toggleSidebar,
  selectedHouseId,
  rooms,
  houses = [], // Default value to an empty array if houses is not passed
}) => {
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

        {/* Add a check for houses being an array before checking its length */}
        {Array.isArray(houses) && houses.length === 0 && <div>No houses available</div>}

        <div className="flex flex-col space-y-4">
          {Array.isArray(houses) &&
            houses.map((house) => (
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
                  {house.locked_by && house.locked_by !== null && (
                    <span className="ml-2 text-sm text-gray-400">(Locked)</span>
                  )}
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

export default Sidebar;
