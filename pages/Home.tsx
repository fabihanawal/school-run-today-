
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
      bannerImage: 'https://picsum.photos/1920/1080?school',
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

  const LayoutClassic = () => (
    <div className="animate-fade-in">
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-all duration-1000"
          style={{ backgroundImage: `linear-gradient(rgba(0,30,15,0.8), rgba(0,15,5,0.8)), url('${settings.bannerImage}')` }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-5xl">
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
            <div className="p-10 border rounded-[48px] bg-emerald-50/50 border-emerald-100">
              <div className="text-emerald-700 mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"><i className="fas fa-graduation-cap text-xl"></i></div>
              <h3 className="text-xl font-black mb-2 text-gray-800">মানসম্মত শিক্ষা</h3>
              <p className="text-gray-500 text-sm leading-relaxed">অভিজ্ঞ শিক্ষক মণ্ডলী দ্বারা পরিচালিত আধুনিক ও নৈতিক শিক্ষা কার্যক্রম।</p>
            </div>
            <div className="p-10 border rounded-[48px] bg-blue-50/50 border-blue-100">
              <div className="text-blue-700 mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"><i className="fas fa-microchip text-xl"></i></div>
              <h3 className="text-xl font-black mb-2 text-gray-800">স্মার্ট ক্লাসরুম</h3>
              <p className="text-gray-500 text-sm leading-relaxed">ডিজিটাল কন্টেন্টের মাধ্যমে শিক্ষার্থীদের কঠিন বিষয়গুলো সহজভাবে শেখানো হয়।</p>
            </div>
          </div>
          <div className="bg-gray-50 p-12 rounded-[56px] border border-gray-100 relative">
             <h2 className="text-3xl font-black mb-6 border-l-8 border-emerald-600 pl-6">আমাদের লক্ষ্য</h2>
             <p className="text-gray-600 leading-relaxed text-lg italic">"আদর্শ মানুষ গড়াই আমাদের মূল উদ্দেশ্য। আমরা বিশ্বাস করি মেধা ও নৈতিকতার সমন্বয় সমাজ পরিবর্তনের মূল হাতিয়ার।"</p>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[48px] shadow-xl border border-emerald-50 text-center">
            <img src={settings.principalPhoto} className="w-28 h-28 rounded-3xl mx-auto mb-6 object-cover border-4 border-emerald-100 shadow-xl" />
            <h3 className="text-xl font-black text-emerald-800">{settings.principalName}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">প্রধান শিক্ষক</p>
            <div className="bg-emerald-50 p-6 rounded-[32px] italic text-gray-600 text-sm">"{settings.principalMsg}"</div>
          </div>
        </div>
      </section>
    </div>
  );

  const LayoutModern = () => (
    <div className="bg-gray-50 animate-fade-in">
       <section className="bg-white pt-12 pb-24">
         <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
               <span className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em]">Admission Open 2024</span>
               <h1 className="text-6xl md:text-8xl font-black text-emerald-900 leading-tight tracking-tighter">গড়ব আগামী <br/><span className="text-emerald-500">নৈতিকতার সাথে।</span></h1>
               <p className="text-gray-500 text-xl leading-relaxed max-w-lg">{settings.tagline}</p>
               <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link to="/admission" className="bg-emerald-600 text-white px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:bg-emerald-700 transition">ভর্তি আবেদন ➔</Link>
                  <Link to="/contact" className="bg-white text-emerald-900 border-2 border-emerald-100 px-10 py-5 rounded-full font-black text-lg hover:bg-emerald-50 transition">যোগাযোগ</Link>
               </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="absolute inset-0 bg-emerald-600 rounded-[80px] rotate-3 -z-0"></div>
               <img src={settings.bannerImage} className="relative z-10 w-full rounded-[80px] shadow-2xl h-[600px] object-cover -rotate-3 transition-transform hover:rotate-0 duration-500" />
            </div>
         </div>
       </section>
       
       <section className="py-24 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white p-12 rounded-[64px] shadow-sm flex items-center gap-8">
             <img src={settings.principalPhoto} className="w-40 h-40 rounded-[48px] object-cover shadow-2xl" />
             <div>
                <h3 className="text-2xl font-black text-gray-800">{settings.principalName}</h3>
                <p className="text-emerald-600 font-bold mb-4">প্রধান শিক্ষক</p>
                <p className="text-gray-500 italic text-sm">"{settings.principalMsg.substring(0, 100)}..."</p>
             </div>
          </div>
          <div className="bg-white p-12 rounded-[64px] shadow-sm flex items-center gap-8">
             <img src={settings.chairmanPhoto} className="w-40 h-40 rounded-[48px] object-cover shadow-2xl" />
             <div>
                <h3 className="text-2xl font-black text-gray-800">{settings.chairmanName}</h3>
                <p className="text-amber-600 font-bold mb-4">চেয়ারম্যান</p>
                <p className="text-gray-500 italic text-sm">"{settings.chairmanMsg.substring(0, 100)}..."</p>
             </div>
          </div>
       </section>
    </div>
  );

  const LayoutFocus = () => (
    <div className="bg-white animate-fade-in">
       <section className="max-w-7xl mx-auto px-4 py-24 text-center space-y-12">
          <div className="space-y-4">
             <h1 className="text-7xl md:text-9xl font-black text-gray-900 tracking-tighter">{settings.schoolName}</h1>
             <div className="h-2 w-32 bg-emerald-600 mx-auto rounded-full"></div>
             <p className="text-2xl text-gray-400 font-medium">{settings.tagline}</p>
          </div>
          <img src={settings.bannerImage} className="w-full h-[600px] object-cover rounded-[100px] shadow-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-24 text-left">
             <div className="space-y-4">
                <span className="text-5xl">🔭</span>
                <h3 className="text-3xl font-black">আমাদের ভিশন</h3>
                <p className="text-gray-500 leading-relaxed text-lg">আধুনিক শিক্ষার সাথে দ্বীনি শিক্ষার এক অপূর্ব মিলনস্থল তৈরীর লক্ষ্য আমাদের পথচলা।</p>
             </div>
             <div className="space-y-4">
                <span className="text-5xl">🛡️</span>
                <h3 className="text-3xl font-black">নৈতিক নিরাপত্তা</h3>
                <p className="text-gray-500 leading-relaxed text-lg">শিক্ষার্থীদের নৈতিক মানদণ্ড উন্নয়নে আমরা প্রতিদিন বিশেষ কার্যক্রম পরিচালনা করি।</p>
             </div>
             <div className="space-y-4">
                <span className="text-5xl">🚀</span>
                <h3 className="text-3xl font-black">স্মার্ট ফিউচার</h3>
                <p className="text-gray-500 leading-relaxed text-lg">প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে বিশ্বমানের মেধা হিসেবে গড়ে তোলা আমাদের প্রতিশ্রুতি।</p>
             </div>
          </div>
       </section>
    </div>
  );

  return (
    <div>
      {settings.homeLayout === 'classic' && <LayoutClassic />}
      {settings.homeLayout === 'modern' && <LayoutModern />}
      {settings.homeLayout === 'focus' && <LayoutFocus />}
    </div>
  );
};

export default Home;
