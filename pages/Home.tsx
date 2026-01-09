
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: '"শিবগঞ্জ ইসলামী একাডেমী শুধুমাত্র একটি বিদ্যাপীঠ নয়, এটি আদর্শ সমাজ গঠনের একটি কারখানা। আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে আদর্শ মানুষ হিসেবে গড়ে তোলা।"',
      principalPhoto: 'https://picsum.photos/200/200?man',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
      chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি। আমাদের একাডেমী একটি সুন্দর সমাজ বিনির্মাণে ভূমিকা রাখছে।',
      chairmanPhoto: 'https://picsum.photos/200/200?elder'
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
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: `linear-gradient(rgba(0,40,20,0.75), rgba(0,20,10,0.75)), url('https://picsum.photos/1920/1080?school')` }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">{settings.schoolName}</h1>
          <p className="text-xl md:text-2xl mb-10 font-medium opacity-90">সততা, নৈতিকতা ও শিক্ষার সমন্বয়ে একটি আদর্শ বিদ্যাপীঠ</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admission" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-lg font-black transition-all transform hover:scale-105 shadow-xl">অনলাইন ভর্তি</Link>
            <Link to="/notices" className="bg-white hover:bg-gray-100 text-emerald-900 px-10 py-4 rounded-2xl text-lg font-black transition-all transform hover:scale-105 shadow-xl">সর্বশেষ নোটিশ</Link>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Side: Features & Content */}
        <div className="lg:col-span-2 space-y-16">
          
          <div className="bg-amber-50 border-y border-amber-200 py-4 overflow-hidden whitespace-nowrap flex items-center rounded-2xl">
            <span className="bg-red-600 text-white px-4 py-1 font-black ml-4 rounded-lg text-[10px] uppercase">ব্রেকিং:</span>
            <div className="animate-notice inline-block pl-6 text-red-900 font-bold text-sm italic">
              *** ২০২৪ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু হয়েছে। অনলাইনে ফরম পূরণ করা যাচ্ছে। ***
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 border rounded-[48px] bg-emerald-50/50 border-emerald-100">
              <div className="text-emerald-700 mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"><i className="fas fa-book-open text-xl"></i></div>
              <h3 className="text-xl font-black mb-2 text-gray-800">আধুনিক পাঠ্যক্রম</h3>
              <p className="text-gray-500 text-sm leading-relaxed">আমরা জাতীয় কারিকুলামের পাশাপাশি ধর্মীয় মূল্যবোধের ওপর বিশেষ গুরুত্ব দিয়ে থাকি।</p>
            </div>
            <div className="p-10 border rounded-[48px] bg-blue-50/50 border-blue-100">
              <div className="text-blue-700 mb-6 bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"><i className="fas fa-desktop text-xl"></i></div>
              <h3 className="text-xl font-black mb-2 text-gray-800">ডিজিটাল ল্যাব</h3>
              <p className="text-gray-500 text-sm leading-relaxed">শিক্ষার্থীদের আধুনিক বিশ্বের জন্য দক্ষ করে তুলতে আমাদের রয়েছে উন্নত কম্পিউটার ল্যাব।</p>
            </div>
          </div>

          <div className="bg-gray-50 p-10 rounded-[48px] border">
            <h2 className="text-3xl font-black mb-6 border-l-8 border-emerald-600 pl-6">প্রতিষ্ঠানের লক্ষ্য</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে আদর্শ মানুষ হিসেবে গড়ে তোলা। আমরা বিশ্বাস করি নৈতিকতা সম্পন্ন মেধা সমাজ পরিবর্তনের মূল হাতিয়ার। ২০২৪ সালে আমরা নিয়ে এসেছি স্মার্ট ক্লাসরুম এবং উন্নত শিক্ষা সরঞ্জাম।
            </p>
          </div>
        </div>

        {/* Right Side: Sidebar with Principal & Chairman */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Principal Card */}
          <div className="bg-white p-8 rounded-[48px] shadow-lg border border-emerald-50 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-all"><i className="fas fa-quote-right text-6xl"></i></div>
            <img src={settings.principalPhoto} className="w-28 h-28 rounded-3xl mx-auto mb-6 object-cover border-4 border-emerald-100 shadow-xl" alt="Principal" />
            <h3 className="text-xl font-black text-emerald-800">{settings.principalName}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">প্রধান শিক্ষক</p>
            <div className="bg-emerald-50 p-6 rounded-[32px] italic text-gray-600 text-sm leading-relaxed">
              {settings.principalMsg}
            </div>
          </div>

          {/* Chairman Card */}
          <div className="bg-white p-8 rounded-[48px] shadow-lg border border-amber-50 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-all"><i className="fas fa-quote-right text-6xl"></i></div>
            <img src={settings.chairmanPhoto} className="w-28 h-28 rounded-3xl mx-auto mb-6 object-cover border-4 border-amber-100 shadow-xl" alt="Chairman" />
            <h3 className="text-xl font-black text-amber-800">{settings.chairmanName}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">সভাপতি (SMC)</p>
            <div className="bg-amber-50 p-6 rounded-[32px] italic text-gray-600 text-sm leading-relaxed">
              {settings.chairmanMsg}
            </div>
          </div>

          {/* Quick Links in Sidebar */}
          <div className="bg-gray-900 p-8 rounded-[48px] text-white">
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-emerald-400 border-b border-gray-700 pb-2">জরুরি লিংক</h4>
            <div className="space-y-4">
              <Link to="/admission" className="flex items-center justify-between group hover:text-emerald-400 transition">
                <span>অনলাইন ভর্তি</span>
                <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition"></i>
              </Link>
              <Link to="/results" className="flex items-center justify-between group hover:text-emerald-400 transition">
                <span>ফলাফল অনুসন্ধান</span>
                <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition"></i>
              </Link>
              <Link to="/notices" className="flex items-center justify-between group hover:text-emerald-400 transition">
                <span>নোটিশ বোর্ড</span>
                <i className="fas fa-arrow-right text-xs transform group-hover:translate-x-1 transition"></i>
              </Link>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;
