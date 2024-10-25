import Image from 'next/image';
import Link from 'next/link';

const GalleryPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Gallery</h1>
      <Image 
        src="/page" 
        alt="Image 1" 
        width={600} 
        height={400} 
        className="rounded-lg shadow-lg" 
      />
      <Link href="/" className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg shadow-lg hover:bg-yellow-400 transition">
        Back to Home
      </Link>
    </div>
  );
};

export default GalleryPage;
