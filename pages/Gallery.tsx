
import React, { useState, useEffect } from 'react';

const Gallery: React.FC = () => {
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('sia_gallery');
    return saved ? JSON.parse(saved) : [
      { id: 1, url: 'https://picsum.photos/800/600?school=1', title: 'একাডেমিক ভবন' },
      { id: 2, url: 'https://picsum.photos/800/600?school=2', title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা' },
      { id: 3, url: 'https://picsum.photos/800/600?school=3', title: 'ডিজিটাল ল্যাব' }
    ];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('sia_gallery');
      if (saved) setImages(JSON.parse(saved));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-800">ফটো গ্যালারী</h1>
          <p className="text-gray-600 mt-2">আমাদের ক্যাম্পাসের বিশেষ কিছু মুহূর্ত</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((img: any) => (
            <div key={img.id} className="group relative overflow-hidden rounded-[40px] bg-white shadow-lg cursor-pointer aspect-[4/3] border-8 border-white">
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition duration-700 group-hover:scale-125 group-hover:rotate-3" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end p-10">
                <div className="transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-white font-black text-2xl mb-1">{img.title}</h3>
                  <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ))}
          {images.length === 0 && (
             <div className="col-span-full py-20 text-center text-gray-300 italic">এখনো কোনো ছবি যুক্ত করা হয়নি।</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
