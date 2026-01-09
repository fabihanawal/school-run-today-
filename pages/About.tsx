
import React, { useState } from 'react';

const About: React.FC = () => {
  const [staff] = useState(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [settings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : { principalName: 'মোহা: ইব্রাহিম খলিল', chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন' };
  });

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-emerald-900 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black mb-4">আমাদের কথা</h1>
          <p className="text-emerald-200 text-lg opacity-80">শিবগঞ্জ ইসলামী একাডেমী - যেখানে মেধা ও নৈতিকতার বিকাশ ঘটে।</p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-gray-800 border-l-8 border-emerald-600 pl-6">প্রতিষ্ঠার ইতিহাস</h2>
            <div className="text-gray-600 leading-relaxed text-lg space-y-4">
              <p>চাঁপাইনবাবগঞ্জের শিবগঞ্জ উপজেলায় ১৯৯৮ সালে এক মহতী উদ্যোগের মধ্য দিয়ে শিবগঞ্জ ইসলামী একাডেমীর পথচলা শুরু হয়। স্থানীয় সচেতন অভিভাবক এবং শিক্ষানুরাগীদের অক্লান্ত পরিশ্রমে এটি আজ এই অঞ্চলের অন্যতম শ্রেষ্ঠ বিদ্যাপিঠে পরিণত হয়েছে।</p>
              <p>আমরা শুধুমাত্র পুঁথিগত বিদ্যায় বিশ্বাস করি না, বরং প্রতিটি শিক্ষার্থীর নৈতিক চরিত্র গঠনেও আমাদের রয়েছে বিশেষ পরিকল্পনা।</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50 p-6 rounded-[32px] text-center">
                <p className="text-3xl font-black text-emerald-800">২৫+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">অভিজ্ঞ শিক্ষক</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-[32px] text-center">
                <p className="text-3xl font-black text-amber-800">১০০০+</p>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">সফল ছাত্রছাত্রী</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img src="https://picsum.photos/800/800?campus" alt="SIA Campus" className="rounded-[80px] shadow-2xl relative z-10" />
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-100 rounded-[80px] -z-0"></div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-800 mb-4">আমাদের শিক্ষকবৃন্দ</h2>
            <div className="h-1.5 w-24 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {staff.filter((s:any) => s.type === 'TEACHER').map((s: any, i: number) => (
              <div key={i} className="group bg-white p-8 rounded-[48px] shadow-sm hover:shadow-2xl transition-all border border-transparent hover:border-emerald-100 text-center">
                <div className="relative mb-6 inline-block">
                  <img src={s.photo || "https://picsum.photos/200/200?teacher"} className="w-28 h-28 rounded-[36px] mx-auto object-cover border-4 border-white shadow-xl" />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-lg"><i className="fas fa-star"></i></div>
                </div>
                <h3 className="text-xl font-black text-gray-800 group-hover:text-emerald-700 transition">{s.name}</h3>
                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mt-1">{s.designation}</p>
                {s.subject && <p className="text-xs text-gray-400 font-bold mt-1">বিষয়: {s.subject}</p>}
                <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-gray-400 font-mono text-xs">
                  <i className="fas fa-phone"></i> {s.mobile}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-gray-800 mb-4">সহায়ক কর্মচারী</h2>
            <div className="h-1 w-16 bg-amber-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {staff.filter((s:any) => s.type === 'STAFF').map((s: any, i: number) => (
              <div key={i} className="bg-gray-50 p-6 rounded-[32px] flex items-center gap-6 border border-gray-100 hover:bg-white transition shadow-sm hover:shadow-xl">
                <img src={s.photo || "https://picsum.photos/100/100?staff"} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" />
                <div>
                  <h4 className="font-bold text-gray-800">{s.name}</h4>
                  <p className="text-xs font-bold text-amber-600">{s.designation}</p>
                  <p className="text-[10px] text-gray-400 mt-2"><i className="fas fa-phone mr-1"></i> {s.mobile}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
