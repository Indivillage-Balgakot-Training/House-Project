"use client"; // Mark the component as a Client Component

import Image from 'next/image';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="relative h-screen w-full">
      <Link href="/image-map">
        <Image 
          src="/image1.jpg" 
          alt="My Image" 
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0 cursor-pointer" 
        />
      </Link>

      <div className="absolute top-0 left-0 p-4">
        <Link href="/image-map">
          <Image 
            src="/house1.jpg" 
            alt="House" 
            width={250} 
            height={250} 
          />
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
