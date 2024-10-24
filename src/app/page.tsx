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

  // Logo component
  const Logo = () => {
    return (
      <div className="flex items-center justify-center">
        <svg
          width="150"
          height="100" // Adjust height as needed
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <rect width="100%" height="100%" fill="transparent" />
          {/* House shape */}
          <polygon points="75,10 100,40 50,40" fill="#ecf0f1" opacity="0.9" />
          <rect x="65" y="40" width="20" height="20" fill="#ecf0f1" opacity="0.9" />

          {/* Logo Text */}
          <text 
            x="10" 
            y="75" // Position for main text
            fontFamily="'Poppins', sans-serif" // Updated font family
            fontSize="20" 
            fill="white" 
            className="drop-shadow-md"
          >
            Indivillage
          </text>
          <text 
            x="10" 
            y="90" // Position for subtitle text
            fontFamily="'Poppins', sans-serif" // Updated font family
            fontSize="10" 
            fill="white" 
            className="drop-shadow-md"
          >
            You dream, We Build
          </text>
        </svg>
      </div>
    );
  };

  // Call Button component
  const CallButton = () => {
    return (
      <a
        href="tel:+917892761921"
        className="c-btn c-btn--outline bg-yellow-500 text-black rounded-lg px-4 py-2 shadow-lg hover:bg-yellow-400 transition"
        aria-label="Talk to our team"
      >
        Call Us
      </a>
    );
  };

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
        
        {/* Logo Text Section */}
        <div className="absolute top-4 left-4 z-20">
          <Logo />
        </div>

        {/* Call Button Section */}
        <div className="absolute top-4 right-4 z-20">
          <CallButton />
        </div>

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
