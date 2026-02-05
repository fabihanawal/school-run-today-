
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../types';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়ে একটি আদর্শ বিদ্যাপীঠ',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/400/400?principal',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
      chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/400/400?chairman',
      bannerImage: 'https://picsum.photos/1920/1080?school',
      scrollingHeadline: '২০২৪ শিক্ষাবর্ষের ভর্তি কার্যক্রম চলছে। বিস্তারিত জানতে অফিস চলাকালীন যোগাযোগ করুন।',
      sliderImages: [
        { id: '1', url: 'https://picsum.photos/1920/800?education=1', title: 'আধুনিক ও দ্বীনি শিক্ষার সমন্বয়' },
        { id: '2', url: 'https://picsum.photos/1920/800?education=2', title: 'স্মার্ট ক্লাসরুম ও দক্ষ শিক্ষক' },
        { id: '3', url: 'https://picsum.photos/1920/800?education=3', title: 'শিক্ষার্থীদের নৈতিক মানোন্নয়ন' }
      ],
      homeLayout: 'classic'
    };
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sia_site_settings');
      if (saved) setSettings(JSON.parse(saved));
    };
    const interval = setInterval(handleStorageChange, 2000);
    return () => clearInterval(interval);
  }, []);

  // Slider Logic
  useEffect(() => {
    if (settings.sliderImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % settings.sliderImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [settings.sliderImages]);

  return (
    <div className="animate-fade-in bg-white">
      {/* 1. Smooth Slideshow Section */}
      <section className="relative h-[400px] md:h-[600px] w-full overflow-hidden bg-emerald-950">
        {settings.sliderImages.map((img, idx) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          >
            <img src={img.url} alt={img.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl">
                <h2 className="text-3xl md:text-6xl font-black mb-4 drop-shadow-2xl animate-fade-in">{img.title}</h2>
                <div className="h-1.5 w-24 bg-emerald-500 mx-auto rounded-full mb-8"></div>
                <div className="flex justify-center gap-4">
                  <Link to="/admission" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl">অনলাইন ভর্তি</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Slider Controls */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {settings.sliderImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'w-10 bg-emerald-500' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Scrolling Headline Notice */}
      <div className="bg-emerald-800 py-3 overflow-hidden border-b border-emerald-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center">
          <div className="bg-amber-500 text-white text-[10px] md:text-xs font-black px-3 py-1 rounded-full whitespace-nowrap z-10 shadow-sm mr-4">সংবাদ:</div>
          <div className="flex-1 overflow-hidden relative h-6">
            <div className="animate-notice whitespace-nowrap absolute top-0 text-white font-bold text-sm md:text-base">
              {settings.scrollingHeadline} ••• {settings.scrollingHeadline}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Chairman & Principal Messages (Side by Side) */}
      <section className="py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Chairman Message Card (Left) */}
            <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-sm border border-emerald-50 relative overflow-hidden group hover:shadow-2xl transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4"><i className="fas fa-landmark text-8xl text-emerald-900"></i></div>
               <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <img src={settings.chairmanPhoto} className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] object-cover border-4 border-emerald-50 shadow-xl" alt="Chairman" />
                  <div>
                    <span className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-2 block">বাণী</span>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{settings.chairmanName}</h3>
                    <p className="text-emerald-500 font-bold text-sm mb-4">সম্মানিত চেয়ারম্যান</p>
                    <div className="h-1 w-12 bg-emerald-200 rounded-full"></div>
                  </div>
               </div>
               <div className="mt-8 italic text-gray-600 leading-relaxed text-lg border-l-4 border-emerald-100 pl-6">
                 "{settings.chairmanMsg}"
               </div>
            </div>

            {/* Principal Message Card (Right) */}
            <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-sm border border-emerald-50 relative overflow-hidden group hover:shadow-2xl transition-all">
               <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4"><i className="fas fa-graduation-cap text-8xl text-emerald-900"></i></div>
               <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <img src={settings.principalPhoto} className="w-32 h-32 md:w-44 md:h-44 rounded-[40px] object-cover border-4 border-emerald-50 shadow-xl" alt="Principal" />
                  <div>
                    <span className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-2 block">বাণী</span>
                    <h3 className="text-2xl font-black text-gray-800 mb-2">{settings.principalName}</h3>
                    <p className="text-emerald-500 font-bold text-sm mb-4">প্রধান শিক্ষক</p>
                    <div className="h-1 w-12 bg-emerald-200 rounded-full"></div>
                  </div>
               </div>
               <div className="mt-8 italic text-gray-600 leading-relaxed text-lg border-l-4 border-emerald-100 pl-6">
                 "{settings.principalMsg}"
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Features or Goals */}
      <section className="py-20 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
         <div className="p-10 rounded-[48px] bg-white border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"><i className="fas fa-book-open"></i></div>
            <h4 className="font-black text-xl mb-4 text-gray-800">আধুনিক শিক্ষা</h4>
            <p className="text-gray-500 text-sm leading-relaxed">জাতীয় কারিকুলাম ও প্রযুক্তি নির্ভর আধুনিক পাঠদান পদ্ধতি।</p>
         </div>
         <div className="p-10 rounded-[48px] bg-white border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"><i className="fas fa-mosque"></i></div>
            <h4 className="font-black text-xl mb-4 text-gray-800">ইসলামী পরিবেশ</h4>
            <p className="text-gray-500 text-sm leading-relaxed">নৈতিকতা ও ধর্মীয় মূল্যবোধ চর্চার নিরাপদ কেন্দ্র।</p>
         </div>
         <div className="p-10 rounded-[48px] bg-white border border-gray-100 hover:shadow-xl transition-all">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl"><i className="fas fa-microchip"></i></div>
            <h4 className="font-black text-xl mb-4 text-gray-800">ডিজিটাল কন্টেন্ট</h4>
            <p className="text-gray-500 text-sm leading-relaxed">কম্পিউটার ল্যাব ও ডিজিটাল মাল্টিমিডিয়া ক্লাসরুম।</p>
         </div>
      </section>
    </div>
  );
};

export default Home;
