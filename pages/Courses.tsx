import React from 'react';
import { Link } from 'react-router-dom';
import { useSchoolSettings, useCollection, KEYS } from '../src/lib/storage';
import { Course } from '../types';

const Courses: React.FC = () => {
  const [settings] = useSchoolSettings();
  const [courses] = useCollection<Course>(KEYS.COURSES, []);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-emerald-900 text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="bg-emerald-800 text-emerald-200 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider inline-block mb-3 border border-emerald-700">
            একাডেমিক প্রোগ্রাম ও কারিকুলাম
          </span>
          <h1 className="text-3xl md:text-5xl font-black mb-4">আমাদের শিক্ষা কার্যক্রমসমূহ</h1>
          <p className="text-emerald-200 text-base md:text-lg max-w-2xl mx-auto font-medium">
            জাতীয় শিক্ষাক্রম ও ইসলামী মূল্যবোধের সমন্বয়ে সাজানো প্রতিটি শ্রেণিভিত্তিক আধুনিক পাঠ্যসূচি।
          </p>
        </div>
      </section>

      {/* Courses List */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`bg-white border ${course.borderClass || 'border-slate-200'} p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 transition">
                    {course.icon || '📖'}
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full inline-block">
                      {course.category}
                    </span>
                    {(course.ageGroup || course.duration) && (
                      <p className="text-[11px] text-slate-400 mt-1 font-medium">
                        {course.ageGroup ? `বয়স: ${course.ageGroup}` : ''} {course.duration ? `· ${course.duration}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-emerald-700 transition">
                  {course.title}
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {course.description}
                </p>

                {course.features && course.features.length > 0 && (
                  <div className="space-y-2.5 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-wider mb-2">শাখার মূল বৈশিষ্ট্যসমূহ:</p>
                    {course.features.map((feat, j) => (
                      <div key={j} className="flex items-center gap-3 text-xs md:text-sm text-slate-700 font-medium">
                        <i className="fas fa-check-circle text-emerald-600 text-sm flex-shrink-0"></i>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">ভর্তি সেশন: {settings.currentSession}</span>
                <Link
                  to="/admission"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow flex items-center gap-2"
                >
                  <span>ভর্তি আবেদন</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curriculum Excellence Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-emerald-700 font-black text-xs uppercase tracking-widest block mb-1">
              গুণগত মান
            </span>
            <h2 className="text-3xl font-black text-slate-900">
              আমাদের একাডেমিক বিশেষত্ব
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fas fa-quran"></i>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">তাজবীদ ও মাসয়ালা</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                প্রতিটি শ্রেণিতে তাজবীদ সহকারে কুরআন তিলাওয়াত ও দৈনন্দিন জীবনের জরুরি আহকাম শিক্ষা দেওয়া হয়।
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fas fa-microscope"></i>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">ব্যবহারিক বিজ্ঞান ও ল্যাব</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                তাত্ত্বিক পড়াশোনার পাশাপাশি বিজ্ঞানাগার ও ডিজিটাল মাল্টিমিডিয়া প্রেজেন্টেশনের মাধ্যমে শিখন।
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 text-2xl">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-2">নৈতিকতা ও মূল্যবোধ</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                সত্যবাদিতা, বড়দের প্রতি শ্রদ্ধা, ছোটদের স্নেহ এবং সমাজসেবামূলক কাজে অংশগ্রহণের অনুপ্রেরণা।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
