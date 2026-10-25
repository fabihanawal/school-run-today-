import React from 'react';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { StaffProfile } from '../types';

const About: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [staff] = useCollection<StaffProfile>(KEYS.STAFF, []);

  const teachers = staff.filter((s) => s.type === 'TEACHER');
  const generalStaff = staff.filter((s) => s.type === 'STAFF');

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Page Header */}
      <section className="bg-emerald-900 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-emerald-700">
            পরিচিতি ও পটভূমি
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4">আমাদের কথা</h1>
          <p className="text-emerald-200 text-base md:text-lg max-w-2xl mx-auto font-medium">
            {settings.schoolName} — যেখানে আধুনিক জ্ঞান ও ধর্মীয় নৈতিকতার অপূর্ব মিলন ঘটে।
          </p>
        </div>
      </section>

      {/* History & Identity Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Description */}
            <div className="lg:col-span-7 space-y-6">
              <div className="border-l-4 border-emerald-600 pl-4">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest block">ঐতিহ্য ও চেতনা</span>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 mt-1">
                  {settings.aboutTitle || 'প্রতিষ্ঠার ইতিহাস ও আমাদের পথচলা'}
                </h2>
              </div>

              <div className="text-slate-600 text-base md:text-lg leading-relaxed space-y-4">
                <p>{settings.aboutHistory}</p>
              </div>

              {/* Mission & Vision Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-bullseye"></i>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">আমাদের মিশন</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings.aboutMission || 'আধুনিক শিক্ষার সাথে ইসলামী মূল্যবোধের সংমিশ্রণ ঘটিয়ে সুনাগরিক গড়ে তোলা।'}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">আমাদের ভিশন</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {settings.aboutVision || 'সমগ্র অঞ্চলে শ্রেষ্ঠ ও আধুনিক দ্বীনি শিক্ষাপ্রতিষ্ঠান হিসেবে সুনাম অর্জন।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Campus Image & Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={settings.aboutImage || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=800&fit=crop&q=80'}
                  alt={settings.schoolName}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs font-bold text-amber-300">EIIN: {settings.eiin} · স্থাপিত: {settings.estYear}</p>
                  <p className="text-lg font-black">{settings.schoolName} ক্যাম্পাস</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Statistics */}
      {settings.stats && settings.stats.length > 0 && (
        <section className="bg-emerald-950 text-white py-14">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {settings.stats.map((stat, idx) => (
                <div key={stat.id || idx} className="bg-emerald-900/60 p-6 rounded-2xl border border-emerald-800">
                  <div className="text-2xl text-amber-400 mb-2">
                    <i className={stat.icon || 'fas fa-star'}></i>
                  </div>
                  <div className="text-3xl md:text-4xl font-black">{stat.value}</div>
                  <div className="text-xs text-emerald-200 font-bold mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Teachers Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-emerald-700 font-black text-xs uppercase tracking-widest block mb-2">
              মেধাবী ও নিবেদিতপ্রাণ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              আমাদের সম্মানিত শিক্ষক পরিষদ
            </h2>
            <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full mt-3"></div>
            <p className="text-xs md:text-sm text-slate-500 mt-3">
              অভিজ্ঞ, বিষয়ভিত্তিক ও স্নেহশীল শিক্ষকমণ্ডলীর তত্ত্বাবধানে শিক্ষার্থীদের মেধার সর্বোচ্চ বিকাশ ঘটে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map((t) => (
              <div
                key={t.id}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group text-center flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-5 inline-block">
                    <img
                      src={t.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&h=300&fit=crop&crop=faces&q=80'}
                      alt={t.name}
                      className="w-28 h-28 rounded-2xl mx-auto object-cover border-4 border-white shadow-md group-hover:scale-105 transition"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs shadow">
                      <i className="fas fa-graduation-cap"></i>
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition">
                    {t.name}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 mt-1">{t.designation}</p>
                  {t.subject && (
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      বিষয়: <span className="text-slate-700 font-bold">{t.subject}</span>
                    </p>
                  )}
                  {t.qualification && (
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {t.qualification}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-2 text-slate-600 text-xs">
                  <i className="fas fa-phone-alt text-emerald-600 text-[10px]"></i>
                  <span className="font-mono">{t.mobile}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      {generalStaff.length > 0 && (
        <section className="py-16 bg-slate-100/60 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-amber-700 font-black text-xs uppercase tracking-widest block mb-1">
                সহায়ক জনবল
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                অফিস ও সহায়ক কর্মচারীবৃন্দ
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {generalStaff.map((s) => (
                <div
                  key={s.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition"
                >
                  <img
                    src={s.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=faces&q=80'}
                    alt={s.name}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{s.name}</h4>
                    <p className="text-xs font-bold text-amber-700">{s.designation}</p>
                    {s.mobile && (
                      <p className="text-[11px] text-slate-500 mt-1">
                        <i className="fas fa-phone-alt text-[9px] mr-1 text-slate-400"></i>
                        {s.mobile}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
