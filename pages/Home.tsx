
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMessage: '"শিবগঞ্জ ইসলামী একাডেমী শুধুমাত্র একটি বিদ্যাপীঠ নয়, এটি আদর্শ সমাজ গঠনের একটি কারখানা। আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে আদর্শ মানুষ হিসেবে গড়ে তোলা।"'
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
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: `linear-gradient(rgba(0,40,20,0.7), rgba(0,20,10,0.7)), url('https://picsum.photos/1920/1080?school')` }}
        />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl leading-tight">{settings.schoolName}</h1>
          <p className="text-xl md:text-2xl mb-10 font-medium opacity-90 tracking-wide">কে জি থেকে এইচএসসি - শিক্ষার এক পূর্ণাঙ্গ ও আদর্শ গন্তব্য</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/admission" className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-lg font-black transition-all transform hover:scale-105 shadow-2xl">
              অনলাইন ভর্তি
            </Link>
            <Link to="/notices" className="bg-white hover:bg-gray-100 text-emerald-900 px-10 py-4 rounded-2xl text-lg font-black transition-all transform hover:scale-105 shadow-2xl">
              সর্বশেষ নোটিশ
            </Link>
          </div>
        </div>
      </section>

      {/* Notice Ticker */}
      <div className="bg-amber-100 border-y border-amber-200 py-3 overflow-hidden whitespace-nowrap flex items-center">
        <span className="bg-red-600 text-white px-6 py-1.5 font-black z-10 ml-6 rounded-lg shadow-md text-xs uppercase tracking-widest">ব্রেকিং:</span>
        <div className="animate-notice inline-block pl-6 text-red-900 font-bold text-sm">
          *** ২০২৪ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু হয়েছে। অনলাইনে ফরম পূরণ করা যাচ্ছে। আমাদের নতুন একাডেমিক সেশন আগামী মাস থেকে শুরু হবে। ***
        </div>
      </div>

      {/* Highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-10 border rounded-[48px] bg-emerald-50/50 border-emerald-100 hover:shadow-2xl transition-all duration-500 group">
            <div className="text-emerald-700 mb-6 bg-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10a8 8 0 013.5-.804c1.171 0 2.269.253 3.25.704V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.443.29 3.5.804v10a8 8 0 00-3.5-.804c-1.171 0-2.269.253-3.25.704V4.804z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black mb-4 text-gray-800 tracking-tight">আধুনিক পাঠ্যক্রম</h3>
            <p className="text-gray-600 text-sm leading-relaxed">আমরা সরকার অনুমোদিত আধুনিক পাঠ্যক্রমের পাশাপাশি ধর্মীয় শিক্ষার সুব্যবস্থা করে থাকি যা শিক্ষার্থীদের মেধার পূর্ণ বিকাশ ঘটায়।</p>
          </div>

          <div className="p-10 border rounded-[48px] bg-amber-50/50 border-amber-100 hover:shadow-2xl transition-all duration-500 group">
            <div className="text-amber-700 mb-6 bg-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all">
              <i className="fas fa-microscope text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 text-gray-800 tracking-tight">ডিজিটাল ল্যাব</h3>
            <p className="text-gray-600 text-sm leading-relaxed">সুশৃঙ্খল রুটিন এবং উন্নত কম্পিউটার ও বিজ্ঞান ল্যাবের মাধ্যমে প্রতিটি শিক্ষার্থীকে ভবিষ্যতের জন্য দক্ষ করে তোলা হয়।</p>
          </div>

          <div className="p-10 border rounded-[48px] bg-blue-50/50 border-blue-100 hover:shadow-2xl transition-all duration-500 group">
            <div className="text-blue-700 mb-6 bg-white w-16 h-16 rounded-3xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
              <i className="fas fa-user-graduate text-2xl"></i>
            </div>
            <h3 className="text-2xl font-black mb-4 text-gray-800 tracking-tight">অভিজ্ঞ শিক্ষক</h3>
            <p className="text-gray-600 text-sm leading-relaxed">একঝাঁক অভিজ্ঞ ও প্রশিক্ষিত শিক্ষকদের তত্ত্বাবধানে পাঠদান নিশ্চিত করা হয়, যারা শিক্ষার্থীদের অভিভাবকের মতো আগলে রাখেন।</p>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-24 bg-gray-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-5 -mr-20">
          <svg className="w-96 h-96" fill="currentColor" viewBox="0 0 200 200"><path d="M40,-66C52,-60,61,-47,69,-33C77,-19,83,-5,81,9C79,22,70,35,59,45C49,55,37,63,24,67C11,71,-4,72,-17,68C-31,65,-43,57,-53,46C-62,35,-70,22,-73,8C-76,-6,-74,-21,-67,-33C-60,-45,-49,-55,-37,-61C-25,-67,-12,-70,1,-72C15,-74,29,-73,40,-66Z" transform="translate(100 100)" /></svg>
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="relative inline-block mb-10">
            <img src="https://picsum.photos/200/200?man" alt="Principal" className="w-40 h-40 rounded-[56px] mx-auto border-8 border-white shadow-2xl object-cover" />
            <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-gray-50"><i className="fas fa-quote-right text-xs"></i></div>
          </div>
          <h2 className="text-4xl font-black text-gray-800 mb-4">প্রধান শিক্ষকের বাণী</h2>
          <p className="text-gray-600 italic leading-relaxed text-xl mb-10 font-medium">
            {settings.principalMessage}
          </p>
          <div className="space-y-1">
            <p className="text-2xl font-black text-emerald-800">{settings.principalName}</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{settings.principalTitle}, শিবগঞ্জ ইসলামী একাডেমী</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
