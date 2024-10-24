"use client"; // Mark the component as a Client Component

import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <Image 
          src="/background home.jpg" 
          alt="Hero Background" 
          fill // Use fill instead of layout
          style={{ objectFit: 'cover' }} // Use style for objectFit
          className="absolute inset-0" 
        />
        <div className="absolute inset-0 bg-black opacity-50" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-6xl font-extrabold drop-shadow-lg">Welcome to Small House Living</h1>
          <p className="mt-4 text-xl drop-shadow-lg">Explore cozy homes designed for comfort and style.</p>
          <Link href="/gallery" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
            View Gallery
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Small House Living. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
