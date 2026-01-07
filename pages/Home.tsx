
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://picsum.photos/1920/1080?school')` }}
        />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">শিবগঞ্জ ইসলামী একাডেমী</h1>
          <p className="text-xl md:text-2xl mb-8 font-light">কে জি থেকে এইচএসসি - শিক্ষার পূর্ণাঙ্গ গন্তব্য</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/admission" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full text-lg font-bold transition-all transform hover:scale-105">
              এখনই ভর্তি হোন
            </Link>
            <Link to="/notices" className="bg-white hover:bg-gray-100 text-emerald-800 px-8 py-3 rounded-full text-lg font-bold transition-all transform hover:scale-105">
              সর্বশেষ নোটিশ
            </Link>
          </div>
        </div>
      </section>

      {/* Notice Ticker */}
      <div className="bg-amber-100 border-y border-amber-200 py-2 overflow-hidden whitespace-nowrap">
        <div className="flex items-center">
          <span className="bg-red-600 text-white px-4 py-1 font-bold z-10 ml-4 rounded">ব্রেকিং নিউজ:</span>
          <div className="animate-notice inline-block pl-4 text-red-800 font-semibold">
            *** ২০২৩ সালের এসএসসি পরীক্ষার ফলাফল প্রকাশিত হয়েছে। অনলাইনে ভর্তি ফরম এখন পাওয়া যাচ্ছে। আমাদের নতুন একাডেমিক সেশন ২০২৪-এর ভর্তি চলছে। ***
          </div>
        </div>
      </div>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border rounded-2xl bg-emerald-50 hover:shadow-lg transition">
            <div className="text-emerald-700 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10a8 8 0 013.5-.804c1.171 0 2.269.253 3.25.704V4.804zM11 4.804A7.968 7.968 0 0114.5 4c1.255 0 2.443.29 3.5.804v10a8 8 0 00-3.5-.804c-1.171 0-2.269.253-3.25.704V4.804z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">আধুনিক পাঠ্যক্রম</h3>
            <p className="text-gray-600 text-sm">আমরা সরকার অনুমোদিত আধুনিক পাঠ্যক্রমের পাশাপাশি ধর্মীয় শিক্ষার সুব্যবস্থা করে থাকি।</p>
          </div>

          <div className="p-8 border rounded-2xl bg-amber-50 hover:shadow-lg transition">
            <div className="text-amber-700 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">সময়ের সঠিক ব্যবহার</h3>
            <p className="text-gray-600 text-sm">সুশৃঙ্খল রুটিন এবং ডিজিটাল ক্লাসরুমের মাধ্যমে প্রতিটি শিক্ষার্থীর সময়কে কাজে লাগানো হয়।</p>
          </div>

          <div className="p-8 border rounded-2xl bg-blue-50 hover:shadow-lg transition">
            <div className="text-blue-700 mb-4">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">অভিজ্ঞ শিক্ষক মণ্ডলী</h3>
            <p className="text-gray-600 text-sm">একঝাঁক অভিজ্ঞ ও প্রশিক্ষিত শিক্ষকদের তত্ত্বাবধানে পাঠদান নিশ্চিত করা হয়।</p>
          </div>
        </div>
      </section>

      {/* Message Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <img src="https://picsum.photos/150/150?man" alt="Principal" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-emerald-500 shadow-xl object-cover" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">প্রধান শিক্ষকের বাণী</h2>
          <p className="text-gray-600 italic leading-relaxed text-lg">
            "শিবগঞ্জ ইসলামী একাডেমী শুধুমাত্র একটি বিদ্যাপীঠ নয়, এটি আদর্শ সমাজ গঠনের একটি কারখানা। আমরা চাই আমাদের শিক্ষার্থীরা মেধার পাশাপাশি উন্নত চরিত্রের অধিকারী হোক। চাঁপাইনবাবগঞ্জের শিবগঞ্জে আমরা নিরলসভাবে এই স্বপ্ন বাস্তবায়নে কাজ করে যাচ্ছি।"
          </p>
          <div className="mt-6 font-bold text-emerald-800">
            <p className="text-xl">মোহা: ইব্রাহিম খলিল</p>
            <p className="text-sm">প্রধান শিক্ষক, শিবগঞ্জ ইসলামী একাডেমী</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
