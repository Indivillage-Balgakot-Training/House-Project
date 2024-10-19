import Link from 'next/link';
import Image from 'next/image';

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Link href="/home-layout">
        <img 
          src="/image1.jpg" // Replace with your image path or URL
          alt="Home Image"
          className="cursor-pointer w-1/2" // Adjust width as needed
        />
      </Link>
    </div>
  );
};

export default Home;
