import React, { useState } from 'react';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { GalleryImage } from '../types';

const Gallery: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [images] = useCollection<GalleryImage>(KEYS.GALLERY, []);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lightboxImg, setLightboxImg] = useState<GalleryImage | null>(null);

  const categories = [
    { id: 'ALL', label: 'সকল ছবি' },
    { id: 'CAMPUS', label: 'ক্যাম্পাস ও ভবন' },
    { id: 'EVENTS', label: 'অনুষ্ঠান ও প্রতিযোগিতা' },
    { id: 'CLASSROOM', label: 'ক্লাসরুম ও পাঠদান' },
    { id: 'SPORTS', label: 'খেলাধুলা' }
  ];

  const filteredImages = images.filter((img) => {
    if (activeCategory === 'ALL') return true;
    return img.category === activeCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            ক্যাম্পাস জীবনচিত্র
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            ফটোগ্রাফি ও ইভেন্ট গ্যালারি
          </h1>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            {settings.schoolName}-এর প্রাণবন্ত শিক্ষাজীবন, সাংস্কৃতিক ও সহ-শিক্ষা কার্যক্রমের খণ্ডচিত্র।
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              onClick={() => setLightboxImg(img)}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/3] border-4 border-white cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                  {img.category || 'ক্যাম্পাস'} {img.date ? `· ${img.date}` : ''}
                </span>
                <h3 className="text-lg font-black leading-snug mt-1">{img.title}</h3>
                <span className="text-xs text-emerald-300 mt-2 flex items-center gap-1.5 font-bold">
                  <i className="fas fa-search-plus text-xs"></i> বড় করে দেখুন
                </span>
              </div>
            </div>
          ))}

          {filteredImages.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              <i className="fas fa-images text-4xl mb-3 text-slate-300"></i>
              <p className="font-bold">এই ক্যাটাগরিতে কোনো ছবি নেই</p>
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightboxImg(null)}
          >
            <div
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition"
                aria-label="Close"
              >
                <i className="fas fa-times text-sm"></i>
              </button>

              <div className="relative flex-1 bg-black flex items-center justify-center max-h-[70vh]">
                <img
                  src={lightboxImg.url}
                  alt={lightboxImg.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                />
              </div>

              <div className="p-6 bg-white flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">{lightboxImg.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {settings.schoolName} {lightboxImg.category ? `· ${lightboxImg.category}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => setLightboxImg(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
