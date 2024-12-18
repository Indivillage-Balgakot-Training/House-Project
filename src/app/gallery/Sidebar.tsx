import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SidebarProps {
    onHouseSelect: (houseId: string) => void; // Existing prop for house selection
    currentPage?: string; // Optional current page prop
    isOpen: boolean; // Sidebar open/close state
    toggleSidebar: () => void; // Function to toggle sidebar
  }
  
  const Sidebar: React.FC<SidebarProps> = ({ onHouseSelect, currentPage, isOpen, toggleSidebar }) => {
    const [houses, setHouses] = useState<any[]>([]); // Store houses data
    const [loading, setLoading] = useState<boolean>(false); // Loading state for houses
    const [error, setError] = useState<string | null>(null); // Error state for error handling
  
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
      onHouseSelect(houseId); // Notify gallery of the selected house
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
                    src={house.house_image || '/default-house.jpg'}
                    alt={house.house_name}
                    className="w-12 h-12 rounded-md mr-4"
                  />
                  <span>{house.house_name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default Sidebar;