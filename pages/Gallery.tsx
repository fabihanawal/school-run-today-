
import React from 'react';

const Gallery: React.FC = () => {
  const images = [
    { url: 'https://picsum.photos/800/600?school=1', title: 'একাডেমিক ভবন' },
    { url: 'https://picsum.photos/800/600?school=2', title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা' },
    { url: 'https://picsum.photos/800/600?school=3', title: 'লাইব্রেরি ও রিডিং জোন' },
    { url: 'https://picsum.photos/800/600?school=4', title: 'ডিজিটাল ক্লাসরুম' },
    { url: 'https://picsum.photos/800/600?school=5', title: 'পুরস্কার বিতরণী অনুষ্ঠান' },
    { url: 'https://picsum.photos/800/600?school=6', title: 'স্মৃতিসৌধে শ্রদ্ধাঞ্জলি' },
    { url: 'https://picsum.photos/800/600?school=7', title: 'বিজ্ঞান মেলা ২০২৪' },
    { url: 'https://picsum.photos/800/600?school=8', title: 'অভিভাবক সম্মেলন' },
    { url: 'https://picsum.photos/800/600?school=9', title: 'সাংস্কৃতিক সন্ধ্যা' },
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-emerald-800">ফটো গ্যালারী</h1>
          <p className="text-gray-600 mt-2">আমাদের ক্যাম্পাসের এক ঝলক</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="group relative overflow-hidden rounded-3xl bg-white shadow-lg cursor-pointer aspect-[4/3]">
              <img 
                src={img.url} 
                alt={img.title} 
                className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">{img.title}</h3>
                  <p className="text-emerald-400 text-sm">২০২৪ সেশন</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition shadow-lg">
            আরও লোড করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
