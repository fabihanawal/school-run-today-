
import React, { useState, useEffect } from 'react';

const Notices: React.FC = () => {
  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('sia_notices');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: '২০২৪ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু', date: '০১ জানুয়ারি, ২০২৪', type: 'ভর্তি' },
      { id: 2, title: 'বার্ষিক পরীক্ষার ফলাফল প্রকাশ সংক্রান্ত', date: '১০ ডিসেম্বর, ২০২৩', type: 'একাডেমিক' }
    ];
  });

  return (
    <div className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">নোটিশ বোর্ড</h1>
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest">সর্বমোট: {notices.length}</span>
        </div>

        <div className="space-y-4">
          {notices.map((notice: any) => (
            <div key={notice.id} className="group flex flex-col md:flex-row items-start md:items-center bg-gray-50 p-6 rounded-3xl border border-gray-100 hover:border-emerald-300 transition-all hover:shadow-xl cursor-pointer">
              <div className="flex flex-col items-center justify-center bg-white border border-gray-200 w-24 h-24 rounded-2xl mb-4 md:mb-0 md:mr-6 flex-shrink-0 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <i className="fas fa-bullhorn text-2xl mb-1"></i>
                <span className="text-[10px] font-black uppercase">নোটিশ</span>
              </div>
              
              <div className="flex-grow">
                <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-full mb-2 uppercase tracking-widest ${notice.type === 'জরুরি' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>{notice.type}</span>
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-700 transition">{notice.title}</h3>
                <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                  <i className="far fa-calendar-alt"></i> {notice.date}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <button className="bg-white border border-gray-200 text-gray-800 px-6 py-2 rounded-xl font-bold text-sm hover:bg-black hover:text-white transition-all">
                  ডাউনলোড করুন <i className="fas fa-download ml-2"></i>
                </button>
              </div>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="text-center py-20 text-gray-300 font-bold italic">কোনো নোটিশ পাওয়া যায়নি।</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notices;
