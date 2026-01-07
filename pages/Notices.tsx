
import React from 'react';

const Notices: React.FC = () => {
  const notices = [
    { id: 1, title: 'এসএসসি ২০২৪ পরীক্ষার রুটিন প্রকাশ', date: '১৫ অক্টোবর, ২০২৩', type: 'একাডেমিক' },
    { id: 2, title: 'নতুন সেশনের ভর্তি ফরম বিতরণ সংক্রান্ত', date: '১০ অক্টোবর, ২০২৩', type: 'ভর্তি' },
    { id: 3, title: 'বার্ষিক ক্রীড়া প্রতিযোগিতার তারিখ পরিবর্তন', date: '০৫ অক্টোবর, ২০২৩', type: 'ক্রীড়া' },
    { id: 4, title: 'ঈদ-উল-ফিতর উপলক্ষে ছুটির নোটিশ', date: '০১ অক্টোবর, ২০২৩', type: 'ছুটি' },
    { id: 5, title: 'অভিভাবক সমাবেশের আমন্ত্রণ', date: '২৮ সেপ্টেম্বর, ২০২৩', type: 'সাধারণ' },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">নোটিশ বোর্ড</h1>
          <button className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg font-bold text-sm">সব দেখুন</button>
        </div>

        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="group flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-emerald-300 transition-all hover:shadow-md cursor-pointer">
              <div className="flex flex-col items-center justify-center bg-white border border-gray-200 w-24 h-24 rounded-2xl mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <span className="text-xs text-emerald-600 font-bold uppercase">অক্টোবর</span>
                <span className="text-3xl font-black text-gray-800">{notice.id + 10}</span>
              </div>
              
              <div className="flex-grow">
                <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-widest">{notice.type}</span>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition">{notice.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{notice.date}</p>
              </div>

              <div className="mt-4 md:mt-0">
                <button className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                  বিস্তারিত 
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notices;
