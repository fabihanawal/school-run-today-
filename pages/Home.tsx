
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SiteSettings } from '../types';

const Home: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়ে একটি আদর্শ বিদ্যাপীঠ',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/200/200?man',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
      chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/200/200?elder',
      bannerImage: 'https://picsum.photos/1920/1080?school'
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const saved = localStorage.getItem('sia_site_settings');
      if (saved) setSettings(JSON.parse(saved));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white">
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-all duration-1000"
          style={{ backgroundImage: `linear-gradient(rgba(0,30,15,0.8), rgba(0,15,5,0.8)), url('${settings.bannerImage}')` }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-5xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">{settings.schoolName}</h1>
          <p className="text-xl md:text-2xl mb-10 font-medium opacity-90">{settings.tagline}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admission" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-[24px] text-lg font-black transition-all transform hover:scale-105 shadow-2xl">অনলাইন ভর্তি</Link>
            <Link to="/notices" className="bg-white hover:bg-gray-100 text-emerald-900 px-10 py-5 rounded-[24px] text-lg font-black transition-all transform hover:scale-105 shadow-2xl">নোটিশ বোর্ড</Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 border rounded-[48px] bg-emerald-50/50 border-emerald-100 hover:shadow-lg transition-all">
              <div className="text-emerald-700 mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"><i className="fas fa-graduation-cap text-xl"></i></div>
              <h3 className="text-xl font-black mb-2 text-gray-800">মানসম্মত শিক্ষা</h3>
              <p className="text-gray-500 text-sm leading-relaxed">অভিজ্ঞ শিক্ষক মণ্ডলী দ্বারা পরিচালিত আধুনিক ও নৈতিক শিক্ষা কার্যক্রম।</p>
            </div>
            <div className="p-10 border rounded-[48px] bg-blue-50/50 border-blue-100 hover:shadow-lg transition-all">
              <div className="text-blue-700 mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"><i className="fas fa-microchip text-xl"></i></div>
              <h3 className="text-xl font-black mb-2 text-gray-800">স্মার্ট ক্লাসরুম</h3>
              <p className="text-gray-500 text-sm leading-relaxed">ডিজিটাল কন্টেন্টের মাধ্যমে শিক্ষার্থীদের কঠিন বিষয়গুলো সহজভাবে শেখানো হয়।</p>
            </div>
          </div>

          <div className="bg-gray-50 p-12 rounded-[56px] border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 -mr-5 -mt-5"><i className="fas fa-target text-9xl"></i></div>
            <h2 className="text-3xl font-black mb-6 border-l-8 border-emerald-600 pl-6">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
            <p className="text-gray-600 leading-relaxed text-lg relative z-10">
              শিবগঞ্জ ইসলামী একাডেমী শুধুমাত্র একটি বিদ্যাপীঠ নয়, এটি আদর্শ সমাজ গঠনের একটি কারখানা। আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে নৈতিকতা সম্পন্ন মেধা হিসেবে গড়ে তোলা। আমরা বিশ্বাস করি মেধা ও নৈতিকতার সমন্বয়ই সুন্দর সমাজ বিনির্মাণে ভূমিকা রাখতে পারে।
            </p>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[48px] shadow-xl border border-emerald-50 text-center group">
            <img src={settings.principalPhoto} className="w-28 h-28 rounded-3xl mx-auto mb-6 object-cover border-4 border-emerald-100 shadow-xl" alt="Principal" />
            <h3 className="text-xl font-black text-emerald-800">{settings.principalName}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">প্রধান শিক্ষক</p>
            <div className="bg-emerald-50 p-6 rounded-[32px] italic text-gray-600 text-sm leading-relaxed">
              "{settings.principalMsg}"
            </div>
          </div>

          <div className="bg-white p-8 rounded-[48px] shadow-xl border border-amber-50 text-center group">
            <img src={settings.chairmanPhoto} className="w-28 h-28 rounded-3xl mx-auto mb-6 object-cover border-4 border-amber-100 shadow-xl" alt="Chairman" />
            <h3 className="text-xl font-black text-amber-800">{settings.chairmanName}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">সভাপতি (SMC)</p>
            <div className="bg-amber-50 p-6 rounded-[32px] italic text-gray-600 text-sm leading-relaxed">
              "{settings.chairmanMsg}"
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
