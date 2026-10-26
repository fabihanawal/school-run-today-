import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { Notice, GalleryImage } from '../types';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [settings] = useSchoolSettings();
  const [notices] = useCollection<Notice>(KEYS.NOTICES, []);
  const [gallery] = useCollection<GalleryImage>(KEYS.GALLERY, []);

  // Slider Timer
  useEffect(() => {
    if (!settings.sliderImages || settings.sliderImages.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % settings.sliderImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [settings.sliderImages, isPaused]);

  const activeSlide = settings.sliderImages?.[currentSlide] || settings.sliderImages?.[0];

  const quickPortals = [
    {
      title: 'অনলাইন ভর্তি',
      desc: 'নতুন শিক্ষাবর্ষে ঘরে বসেই আবেদন করুন',
      icon: 'fas fa-file-signature',
      link: '/admission',
      badge: settings.admissionOpen ? 'চলমান' : 'বন্ধ',
      badgeColor: settings.admissionOpen ? 'bg-emerald-500' : 'bg-slate-400',
      color: 'from-emerald-700 to-emerald-900'
    },
    {
      title: 'পরীক্ষার ফলাফল',
      desc: 'আইডি ও রোল নম্বর দিয়ে গ্রেডশিট দেখুন',
      icon: 'fas fa-poll-h',
      link: '/results',
      badge: 'অনলাইন',
      badgeColor: 'bg-blue-500',
      color: 'from-blue-700 to-blue-900'
    },
    {
      title: 'নোটিশ বোর্ড',
      desc: 'বিদ্যালয়ের জরুরি বিজ্ঞপ্তি ও সময়সূচি',
      icon: 'fas fa-bullhorn',
      link: '/notices',
      badge: `${notices.length}টি নোটিশ`,
      badgeColor: 'bg-amber-500',
      color: 'from-amber-700 to-amber-900'
    },
    {
      title: 'পরীক্ষা ও কুইজ',
      desc: 'অনলাইন মেধা যাচাই ও প্রশ্নব্যাংক',
      icon: 'fas fa-laptop-code',
      link: '/exams',
      badge: 'ইন্টারঅ্যাক্টিভ',
      badgeColor: 'bg-purple-500',
      color: 'from-purple-700 to-purple-900'
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Slideshow Section */}
      <section 
        className="relative h-[480px] md:h-[620px] w-full overflow-hidden bg-emerald-950"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {settings.sliderImages && settings.sliderImages.length > 0 ? (
          settings.sliderImages.map((img, idx) => {
            const isCurrent = idx === currentSlide;
            return (
              <div
                key={img.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover brightness-[0.4] scale-105 transition-transform duration-7000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl mx-auto">
                    <span className="inline-block bg-amber-400 text-emerald-950 text-xs md:text-sm font-black px-4 py-1 rounded-full mb-4 shadow">
                      {settings.schoolName}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 drop-shadow-xl leading-tight">
                      {img.title}
                    </h1>
                    {img.subtitle && (
                      <p className="text-sm md:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto font-medium drop-shadow">
                        {img.subtitle}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      <Link
                        to={img.buttonLink || '/admission'}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 py-3 rounded-xl font-bold transition shadow-lg hover:shadow-emerald-600/30 flex items-center gap-2"
                      >
                        <span>{img.buttonText || 'ভর্তি আবেদন'}</span>
                        <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                      <Link
                        to="/about"
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/20 px-6 py-3 rounded-xl font-bold transition"
                      >
                        আমাদের পরিচিতি
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-white">
            <h2 className="text-3xl font-black">{settings.schoolName}</h2>
          </div>
        )}

        {/* Prev / Next Controls */}
        {settings.sliderImages && settings.sliderImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? settings.sliderImages.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition border border-white/20"
              aria-label="Previous Slide"
            >
              <i className="fas fa-chevron-left text-sm"></i>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % settings.sliderImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition border border-white/20"
              aria-label="Next Slide"
            >
              <i className="fas fa-chevron-right text-sm"></i>
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-20">
              {settings.sliderImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* 2. Urgent Scrolling Notice Ticker */}
      {settings.scrollingHeadline && (
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-y border-emerald-800 shadow-md relative z-10">
          <div className="max-w-7xl mx-auto px-4 flex items-center py-3">
            <div className="bg-amber-400 text-emerald-950 text-xs font-black px-3.5 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-md mr-3.5 flex items-center gap-1.5 flex-shrink-0">
              <i className="fas fa-bullhorn text-xs animate-bounce"></i>
              <span>জরুরি নোটিশ:</span>
            </div>
            <div className="flex-1 overflow-hidden relative h-7 flex items-center">
              <div className="animate-notice whitespace-nowrap absolute text-amber-200 hover:text-white font-medium text-sm md:text-base hover:[animation-play-state:paused] cursor-pointer transition">
                <Link to="/notices" className="flex items-center gap-2">
                  <span>{settings.scrollingHeadline}</span>
                </Link>
              </div>
            </div>
            <Link
              to="/notices"
              className="text-xs text-amber-300 hover:text-amber-200 font-bold hover:underline whitespace-nowrap ml-3.5 hidden sm:flex items-center gap-1 flex-shrink-0"
            >
              <span>সকল নোটিশ</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        </div>
      )}

      {/* 3. Quick Action Portals */}
      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickPortals.map((portal, idx) => (
            <Link
              key={idx}
              to={portal.link}
              className={`bg-gradient-to-br ${portal.color} text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 border border-white/10 flex flex-col justify-between group`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  <i className={portal.icon}></i>
                </div>
                <span className={`${portal.badgeColor} text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider`}>
                  {portal.badge}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black mb-1 group-hover:text-amber-300 transition">
                  {portal.title}
                </h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  {portal.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-bold">
                <span>প্রবেশ করুন</span>
                <i className="fas fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition"></i>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Leadership Messages (Chairman & Principal) */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-700 font-black text-xs uppercase tracking-widest block mb-2">
              নেতৃত্বের দিকনির্দেশনা
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              সম্মানিত সভাপতি ও প্রধান শিক্ষকের বাণী
            </h2>
            <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Chairman Card */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <i className="fas fa-landmark text-9xl text-slate-900"></i>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <img
                    src={settings.chairmanPhoto}
                    alt={settings.chairmanName}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-emerald-50 shadow-md flex-shrink-0"
                  />
                  <div className="text-center sm:text-left">
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block mb-2">
                      বাণী
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      {settings.chairmanName}
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-emerald-700 mt-1">
                      {settings.chairmanDesignation || 'সম্মানিত সভাপতি, গভর্নিং বডি'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{settings.schoolName}</p>
                  </div>
                </div>

                <div className="relative pl-5 border-l-4 border-amber-400 italic text-slate-600 text-sm md:text-base leading-relaxed">
                  "{settings.chairmanMsg}"
                </div>
              </div>
            </div>

            {/* Principal Card */}
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <i className="fas fa-graduation-cap text-9xl text-slate-900"></i>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <img
                    src={settings.principalPhoto}
                    alt={settings.principalName}
                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-emerald-50 shadow-md flex-shrink-0"
                  />
                  <div className="text-center sm:text-left">
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md inline-block mb-2">
                      বাণী
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                      {settings.principalName}
                    </h3>
                    <p className="text-xs md:text-sm font-bold text-emerald-700 mt-1">
                      {settings.principalDesignation || 'প্রধান শিক্ষক'}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{settings.schoolName}</p>
                  </div>
                </div>

                <div className="relative pl-5 border-l-4 border-emerald-500 italic text-slate-600 text-sm md:text-base leading-relaxed">
                  "{settings.principalMsg}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Statistics (Fully customizable from Admin) */}
      {settings.stats && settings.stats.length > 0 && (
        <section className="bg-emerald-900 text-white py-14 border-y border-emerald-800 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-emerald-800">
              {settings.stats.map((stat, idx) => (
                <div key={stat.id || idx} className="pt-4 md:pt-0 px-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-800/80 text-amber-300 flex items-center justify-center text-xl mb-3">
                    <i className={stat.icon || 'fas fa-chart-line'}></i>
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-emerald-200 font-bold mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Core School Features / Highlights (Fully customizable from Admin) */}
      {settings.features && settings.features.length > 0 && (
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-700 font-black text-xs uppercase tracking-widest block mb-2">
              আমাদের অনন্য বৈশিষ্ট্য
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              কেন বেছে নেবেন {settings.schoolName}?
            </h2>
            <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full mt-3"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.features.map((feat, idx) => (
              <div
                key={feat.id || idx}
                className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl mb-5 group-hover:bg-emerald-600 group-hover:text-white transition">
                    <i className={feat.icon || 'fas fa-check'}></i>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 mb-2 group-hover:text-emerald-700 transition">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Latest Notices & Gallery Preview */}
      <section className="py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Notices Section (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">বিজ্ঞপ্তি</span>
                <h3 className="text-2xl font-black text-slate-900">সাম্প্রতিক নোটিশসমূহ</h3>
              </div>
              <Link to="/notices" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
                <span>সকল নোটিশ ({notices.length})</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

            <div className="space-y-3">
              {notices.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/50 hover:border-emerald-200 transition group flex items-start gap-4"
                >
                  <div className="bg-emerald-100 text-emerald-900 p-2.5 rounded-xl text-center min-w-[64px] flex-shrink-0">
                    <span className="text-xs font-bold block text-emerald-700">তারিখ</span>
                    <span className="text-sm font-black">{notice.date.split('-')[2] || '১৫'}</span>
                    <span className="text-[10px] block opacity-75">{notice.date.split('-')[1] || '১০'}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800">
                        {notice.type}
                      </span>
                      {notice.pinned && (
                        <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                          <i className="fas fa-thumbtack text-[9px]"></i> পিন করা
                        </span>
                      )}
                    </div>
                    <Link to="/notices" className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition line-clamp-1">
                      {notice.title}
                    </Link>
                    {notice.content && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {notice.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Widget (Right 1 col) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">ছবি প্রদর্শনী</span>
                <h3 className="text-2xl font-black text-slate-900">ক্যাম্পাস চিত্র</h3>
              </div>
              <Link to="/gallery" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5">
                <span>গ্যালারি</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {gallery.slice(0, 4).map((img) => (
                <Link
                  key={img.id}
                  to="/gallery"
                  className="group relative rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-sm block"
                >
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-2 flex items-end">
                    <p className="text-white text-[10px] font-bold line-clamp-1">{img.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Admission Call to Action Banner */}
      <section className="py-14 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="bg-amber-400 text-emerald-950 text-xs font-black px-3 py-1 rounded-md inline-block mb-3">
              সেশন: {settings.currentSession || '২০২৪-২০২৫'}
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight">
              আপনার সন্তানের নিরাপদ ও আদর্শ শিক্ষা নিশ্চিত করুন
            </h2>
            <p className="text-sm text-emerald-200 mt-2">
              ভর্তির শেষ তারিখ: {settings.admissionDeadline || '২০ ডিসেম্বর'} · হেল্পলাইন: {settings.phone1}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/admission"
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-black px-8 py-3.5 rounded-xl text-sm transition shadow-xl"
            >
              ভর্তি ফরম পূরণ করুন
            </Link>
            <Link
              to="/contact"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3.5 rounded-xl text-sm transition"
            >
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
