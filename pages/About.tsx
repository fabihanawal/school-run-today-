
import React from 'react';

const About: React.FC = () => {
  const leadership = [
    { name: 'মোহা: ইব্রাহিম খলিল', role: 'প্রধান শিক্ষক', img: 'https://picsum.photos/300/300?principal' },
    { name: 'মোহাঃ হাবিবুর রহমান', role: 'সহকারী প্রধান শিক্ষক', img: 'https://picsum.photos/300/300?vice-principal' },
    { name: 'মাওলানা আব্দুল হাই', role: 'ধর্মীয় ইনচার্জ', img: 'https://picsum.photos/300/300?religious-head' },
  ];

  const faculty = [
    {
      department: 'মাধ্যমিক শাখা (Secondary)',
      teachers: [
        { name: 'মোঃ ইসমাইল হোসেন', role: 'সিনিয়র শিক্ষক (বাংলা)', img: 'https://picsum.photos/300/300?t1' },
        { name: 'মোঃ কামরুজ্জামান', role: 'সিনিয়র শিক্ষক (ইংরেজি)', img: 'https://picsum.photos/300/300?t2' },
        { name: 'মোসাঃ জেসমিন আরা', role: 'সহকারী শিক্ষিকা (বিজ্ঞান)', img: 'https://picsum.photos/300/300?t3' },
      ]
    },
    {
      department: 'প্রাথমিক শাখা (Primary)',
      teachers: [
        { name: 'মোসাঃ খাদিজা বেগম', role: 'সহকারী শিক্ষিকা (গণিত)', img: 'https://picsum.photos/300/300?t4' },
        { name: 'মোঃ আব্দুল কুদ্দুস', role: 'সিনিয়র শিক্ষক (সমাজ)', img: 'https://picsum.photos/300/300?t5' },
        { name: 'মোসাঃ লতিফা খাতুন', role: 'প্রাথমিক ইনচার্জ', img: 'https://picsum.photos/300/300?t6' },
      ]
    },
    {
      department: 'আরবি ও ইসলামী শিক্ষা (Islamic Studies)',
      teachers: [
        { name: 'হাফেজ মোঃ আব্দুল্লাহ', role: 'হিফজ ইনচার্জ', img: 'https://picsum.photos/300/300?t7' },
        { name: 'মাওলানা ইউসুফ আলী', role: 'সহকারী শিক্ষক (আরবি)', img: 'https://picsum.photos/300/300?t8' },
        { name: 'মোঃ আব্দুর রশিদ', role: 'কুরআন তিলাওয়াত প্রশিক্ষক', img: 'https://picsum.photos/300/300?t9' },
      ]
    }
  ];

  return (
    <div className="bg-white">
      {/* Page Header */}
      <section className="bg-emerald-900 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">আমাদের কথা</h1>
          <p className="text-emerald-200 text-lg">শিবগঞ্জ ইসলামী একাডেমী - যেখানে আদর্শ মানুষ হওয়ার পথ চলা শুরু হয়।</p>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-8 border-emerald-600 pl-6">প্রতিষ্ঠার ইতিহাস</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed text-justify">
              <p>
                চাঁপাইনবাবগঞ্জের শিবগঞ্জ উপজেলায় ১৯৯৮ সালে এক মহতী উদ্যোগের মধ্য দিয়ে শিবগঞ্জ ইসলামী একাডেমীর পথচলা শুরু হয়। স্থানীয় সচেতন অভিভাবক এবং শিক্ষানুরাগীদের অক্লান্ত পরিশ্রমে এটি আজ এই অঞ্চলের অন্যতম শ্রেষ্ঠ বিদ্যাপিঠে পরিণত হয়েছে।
              </p>
              <p>
                আমাদের মূল দর্শন হলো—"সততা, শিক্ষা ও সেবাই জীবনের পাথেয়"। আমরা বিশ্বাস করি, সঠিক শিক্ষার অভাবই হলো সমাজের সকল বিশৃঙ্খলার মূল কারণ। তাই আমরা আধুনিক পাঠ্যক্রমের পাশাপাশি নৈতিক এবং ধর্মীয় শিক্ষার ওপর সমান গুরুত্বারোপ করি।
              </p>
            </div>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="bg-emerald-50 p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-emerald-800 mb-2">আমাদের লক্ষ্য</h3>
                <p className="text-sm text-gray-600">শিক্ষার্থীদের মাঝে মানবিক গুণাবলী ও সৃজনশীলতার বিকাশ ঘটানো এবং প্রযুক্তিনির্ভর স্মার্ট নাগরিক গড়ে তোলা।</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-3xl">
                <h3 className="text-xl font-bold text-amber-800 mb-2">আমাদের স্বপ্ন</h3>
                <p className="text-sm text-gray-600">একটি বৈষম্যহীন সমাজ গঠন যেখানে প্রতিটি শিক্ষার্থী নৈতিকতা ও মেধার স্বাক্ষর রাখবে।</p>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img src="https://picsum.photos/800/600?campus" alt="SIA Campus" className="rounded-[60px] shadow-2xl z-10 relative" />
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-emerald-100 rounded-[60px] -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-16 underline decoration-emerald-500 underline-offset-8">পরিচালনা পর্ষদ</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {leadership.map((person, i) => (
              <div key={i} className="group">
                <div className="bg-white p-6 rounded-[50px] shadow-sm group-hover:shadow-2xl transition-all duration-300">
                  <div className="relative overflow-hidden rounded-[40px] mb-6">
                    <img src={person.img} alt={person.name} className="w-full aspect-square object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{person.name}</h3>
                  <p className="text-emerald-600 font-medium mb-4">{person.role}</p>
                  <div className="flex justify-center gap-4">
                    <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300"><i className="fab fa-facebook-f text-sm"></i></a>
                    <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300"><i className="fab fa-linkedin-in text-sm"></i></a>
                    <a href="#" className="p-2 bg-gray-100 rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300"><i className="fas fa-envelope text-sm"></i></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Sections */}
      {faculty.map((dept, idx) => (
        <section key={idx} className={`py-20 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4">
            <h2 className={`text-2xl font-bold text-gray-800 mb-12 text-center md:text-left border-l-4 ${idx % 2 === 0 ? 'border-amber-500' : 'border-emerald-500'} pl-4`}>
              {dept.department}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {dept.teachers.map((teacher, i) => (
                <div key={i} className="group flex items-center gap-6 p-6 bg-white rounded-3xl hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-100">
                  <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-2xl shadow-md">
                    <img src={teacher.img} alt={teacher.name} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition">{teacher.name}</h3>
                    <p className="text-sm text-gray-500 font-medium mb-3">{teacher.role}</p>
                    <div className="flex gap-4">
                      <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><i className="fab fa-facebook-f text-sm"></i></a>
                      <a href="#" className="text-gray-400 hover:text-sky-500 transition-colors"><i className="fab fa-twitter text-sm"></i></a>
                      <a href={`mailto:info@sia.edu.bd`} className="text-gray-400 hover:text-emerald-600 transition-colors"><i className="fas fa-envelope text-sm"></i></a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Footer CTA */}
      <section className="py-16 bg-emerald-800 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">আমাদের সাথে যোগ দিন</h2>
          <p className="text-emerald-100 mb-8 leading-relaxed">
            আপনি কি একজন দক্ষ ও মেধাবী শিক্ষক হিসেবে আপনার ক্যারিয়ার গড়তে চান? আমাদের একাডেমীতে যোগ দিতে আপনার সিভি পাঠান।
          </p>
          <a href="mailto:s124611@gmail.com" className="bg-white text-emerald-800 px-8 py-3 rounded-full font-bold hover:bg-emerald-100 transition shadow-lg">
            সিভি পাঠান
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
