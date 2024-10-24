import Image from 'next/image';
import Link from 'next/link';

const GalleryPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="mt-10 text-4xl font-bold text-center">Gallery</h1>
      <div className="relative w-full max-w-2xl mt-6">
        <Image 
          src="/gallery.jpg" 
          alt="Gallery Image" 
          width={600} 
          height={400} 
          style={{ objectFit: 'cover' }} // Adjust for objectFit
          className="rounded-lg shadow-lg"
        />
      </div>
      <Link href="/" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
        Back to Home
      </Link>
      <footer className="bg-gray-800 text-white py-4 text-center mt-auto">
        <p>&copy; 2024 Small House Living. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GalleryPage;
