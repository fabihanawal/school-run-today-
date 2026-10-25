import React, { useState } from 'react';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { Notice } from '../types';

const Notices: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [notices] = useCollection<Notice>(KEYS.NOTICES, []);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const categories = [
    { id: 'ALL', label: 'সকল নোটিশ' },
    { id: 'ADMISSION', label: 'ভর্তি বিজ্ঞপ্তি' },
    { id: 'EXAM', label: 'পরীক্ষা সংক্রান্ত' },
    { id: 'ACADEMIC', label: 'একাডেমিক' },
    { id: 'HOLIDAY', label: 'ছুটির নোটিশ' }
  ];

  const filteredNotices = notices.filter((n) => {
    const matchesFilter = activeFilter === 'ALL' || n.type === activeFilter;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3">
            অফিসিয়াল নোটিশ বোর্ড
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            বিজ্ঞপ্তি ও সময়সূচি
          </h1>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            {settings.schoolName}-এর সাম্প্রতিক প্রশাসনিক ও একাডেমিক সকল ঘোষণা এখানে নিয়মিত প্রকাশ করা হয়।
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    activeFilter === cat.id
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নোটিশ খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Notice List */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="group bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex flex-col items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <i className="fas fa-file-alt text-lg"></i>
                  <span className="text-[9px] font-black uppercase mt-0.5">নোটিশ</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-emerald-100/80 text-emerald-800">
                      {notice.type}
                    </span>
                    {notice.pinned && (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                        <i className="fas fa-thumbtack text-[9px]"></i> পিন করা নোটিশ
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-medium">
                      <i className="far fa-calendar-alt mr-1"></i> {notice.date}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                    {notice.title}
                  </h3>

                  {notice.content && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {notice.content}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <button
                  type="button"
                  className="bg-slate-100 group-hover:bg-emerald-50 text-slate-700 group-hover:text-emerald-800 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-2"
                >
                  <span>বিস্তারিত পড়ুন</span>
                  <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
              </div>
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
              <i className="fas fa-inbox text-4xl mb-3 text-slate-300"></i>
              <p className="text-base font-bold">কোনো নোটিশ পাওয়া যায়নি</p>
              <p className="text-xs text-slate-400 mt-1">অন্য ক্যাটাগরি বা কিওয়ার্ড দিয়ে অনুসন্ধান করুন।</p>
            </div>
          )}
        </div>

        {/* Notice Modal */}
        {selectedNotice && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                aria-label="Close Modal"
              >
                <i className="fas fa-times"></i>
              </button>

              <div className="text-center pb-6 border-b border-slate-200">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                  {settings.schoolName} · নোটিশ বোর্ড
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedNotice.title}
                </h2>
                <div className="flex items-center justify-center gap-3 mt-3 text-xs text-slate-500 font-medium">
                  <span>প্রকাশের তারিখ: <strong className="text-slate-800">{selectedNotice.date}</strong></span>
                  <span>·</span>
                  <span>ধরণ: <strong className="text-emerald-700">{selectedNotice.type}</strong></span>
                </div>
              </div>

              <div className="py-6 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                {selectedNotice.content || 'এই বিজ্ঞপ্তির কোনো অতিরিক্ত বিবরণ নেই। বিস্তারিত জানতে বিদ্যালয় অফিসে যোগাযোগ করুন।'}
              </div>

              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  EIIN: {settings.eiin} · {settings.address}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2"
                  >
                    <i className="fas fa-print"></i>
                    <span>প্রিন্ট করুন</span>
                  </button>
                  <button
                    onClick={() => setSelectedNotice(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;
