"use client"; // Mark the component as a Client Component

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface House {
  id: number;         // or string, depending on your backend
  name: string;
  description: string;
}

const HomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [houses, setHouses] = useState<House[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const existingSessionId = sessionStorage.getItem('sessionId');
    if (!existingSessionId) {
      const newSessionId = generateSessionId();
      sessionStorage.setItem('sessionId', newSessionId);
      setSessionId(newSessionId);
    } else {
      setSessionId(existingSessionId);
    }
  }, []);

  useEffect(() => {
    fetchHouses();
  }, []);

  const generateSessionId = () => {
    return 'session-' + Math.random().toString(36).substr(2, 9);
  };

  const fetchHouses = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/houses');
      const data: House[] = await response.json();
      setHouses(data);
    } catch (error) {
      console.error('Error fetching houses:', error);
    }
  };

  const Logo = () => (
    <div className="flex items-center justify-center">
      <svg
        width="150"
        height="100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <rect width="100%" height="100%" fill="transparent" />
        <polygon points="75,10 100,40 50,40" fill="#ecf0f1" opacity="0.9" />
        <rect x="65" y="40" width="20" height="20" fill="#ecf0f1" opacity="0.9" />
        <text 
          x="10" 
          y="75" 
          fontFamily="'Poppins', sans-serif" 
          fontSize="20" 
          fill="white" 
          className="drop-shadow-md"
        >
          Indivillage
        </text>
        <text 
          x="10" 
          y="90" 
          fontFamily="'Poppins', sans-serif" 
          fontSize="10" 
          fill="white" 
          className="drop-shadow-md"
        >
          You dream, We Build
        </text>
      </svg>
    </div>
  );

  const CallButton = () => (
    <a
      href="tel:+917892761921"
      className="c-btn c-btn--outline bg-yellow-500 text-black rounded-lg px-4 py-2 shadow-lg hover:bg-yellow-400 transition"
      aria-label="Talk to our team"
    >
      Talk to our Team
    </a>
  );

  const SocialMediaIcons = () => (
    <div className="flex space-x-4">
      <Link href="https://www.instagram.com" target="_blank" aria-label="Instagram">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white hover:text-yellow-500 transition" viewBox="0 0 24 24" fill="none">
          <path d="M12 2.163c3.206 0 3.586.012 4.847.07 1.15.056 1.858.244 2.286.41.561.223 1.046.516 1.53 1.005.484.489.778.973 1.001 1.53.166.428.354 1.137.41 2.286.058 1.261.07 1.641.07 4.847s-.012 3.586-.07 4.847c-.056 1.15-.244 1.858-.41 2.286-.223.561-.516 1.046-1.005 1.53-.489.484-.973.778-1.53 1.001-.428.166-1.137.354-2.286.41-1.261.058-1.641.07-4.847.07s-3.586-.012-4.847-.07c-1.15-.056-1.858-.244-2.286-.41-.561-.223-1.046-.516-1.53-1.005-.484-.489-.778-.973-1.001-1.53-.166-.428-.354-1.137-.41-2.286C2.175 15.17 2.163 14.892 2.163 12S2.175 8.83 2.23 7.68c.056-1.15.244-1.858.41-2.286.223-.561.516-1.046 1.005-1.53.489-.484.973-.778 1.53-1.001.428-.166 1.137-.354 2.286-.41C8.414 2.175 8.694 2.163 12 2.163zm0 5.835c-3.092 0-5.51 2.418-5.51 5.51s2.418 5.51 5.51 5.51 5.51-2.418 5.51-5.51-2.418-5.51-5.51-5.51zm0 9.06a3.55 3.55 0 1 0 0-7.1 3.55 3.55 0 0 0 0 7.1zm5.233-9.06c-.569 0-1.058.232-1.43.603a2.005 2.005 0 0 0-.603 1.43 2.005 2.005 0 0 0 .603 1.43c.373.372.861.603 1.43.603s1.058-.232 1.43-.603a2.005 2.005 0 0 0 .603-1.43 2.005 2.005 0 0 0-.603-1.43c-.372-.371-.861-.603-1.43-.603z" fill="currentColor" />
        </svg>
      </Link>
      <Link href="https://www.facebook.com" target="_blank" aria-label="Facebook">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white hover:text-yellow-500 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2c5.522 0 10 4.478 10 10s-4.478 10-10 10S2 17.522 2 12 6.478 2 12 2zm-1 17v-6h-2v-2h2V9c0-2.21 1.79-4 4-4h2v2h-2c-1.104 0-2 .896-2 2v2h4l-1 2h-3v6h-2z" />
        </svg>
      </Link>
    </div>
  );

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

        {/* Call Button and Social Media Icons Section */}
        <div className="absolute top-4 right-4 z-20 flex items-center space-x-4">
          <CallButton />
          <SocialMediaIcons />
        </div>

        <div className={`relative z-10 flex flex-col items-center justify-center h-full text-white text-center transition-transform duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-5xl font-bold mb-4">Welcome to Indivillage</h1>
          <p className="text-lg mb-8">Your dream home awaits</p>
          <Link href="/gallery" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
  View Gallery
</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;