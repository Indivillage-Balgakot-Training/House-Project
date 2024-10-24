"use client"; // Mark the component as a Client Component

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <Image 
          src="/background home.jpg" 
          alt="Hero Background" 
          fill 
          style={{ objectFit: 'cover' }} 
          className="absolute inset-0" 
        />
        <div className={`absolute inset-0 bg-black transition-opacity duration-500 ${isVisible ? 'opacity-50' : 'opacity-0'}`} />
        <div className={`relative z-10 flex flex-col items-center justify-center h-full text-white text-center transition-transform duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl font-extrabold drop-shadow-lg">You Imagine We Build</h1>
          <p className="mt-4 text-xl drop-shadow-lg">Go through Your Dream House.</p>
          <Link href="/gallery" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
            View Gallery
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 Indivillage. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
