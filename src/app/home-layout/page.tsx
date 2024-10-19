import Image from 'next/image';

const HomeLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-5 p-4">
      <Image 
        src="/bedroom.jpg" 
        alt="Bedroom" 
        width={300} 
        height={200} 
        className="object-cover" // Ensures images cover their area without distortion
      />
      <Image 
        src="/guestbathroom.jpg" 
        alt="Guest Bathroom" 
        width={300} 
        height={200} 
        className="object-cover"
      />
      <Image 
        src="/openarea.jpg" 
        alt="Open Area" 
        width={300} 
        height={200} 
        className="object-cover"
      />
      <Image 
        src="/passagearea.jpg" 
        alt="Passage Area" 
        width={300} 
        height={200} 
        className="object-cover"
      />
      <Image 
        src="/masterbedroom2.jpg" 
        alt="Master Bedroom 2" 
        width={300} 
        height={200} 
        className="object-cover"
      />
      <Image 
        src="/kitchen.jpg" 
        alt="Kitchen" 
        width={300} 
        height={200} 
        className="object-cover"
      />
      <Image 
        src="/masterbedroom1.jpg" 
        alt="Master Bedroom 1" 
        width={200} 
        height={100} 
        className="object-cover"
      />
    </div>
  );
};

export default HomeLayout;
