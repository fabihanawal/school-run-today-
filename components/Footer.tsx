
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : { 
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী', 
      phone1: '০১৭১৬১৩৭৭০৮', 
      email: 's124611@gmail.com', 
      address: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।'
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
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-white text-2xl font-black mb-6">{settings.schoolName}</h3>
          <p className="text-sm leading-relaxed opacity-70">
            একটি ঐতিহ্যবাহী শিক্ষা প্রতিষ্ঠান যেখানে আধুনিক শিক্ষার সাথে ইসলামী মূল্যবোধের অনন্য সমন্বয় ঘটে। আমরা বিশ্বাস করি নৈতিকতা সম্পন্ন মেধা সমাজ পরিবর্তনের মূল হাতিয়ার।
          </p>
          <div className="mt-8 flex space-x-5">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">গুরুত্বপূর্ণ লিঙ্ক</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/admission" className="hover:text-emerald-500 transition-colors">অনলাইন ভর্তি ফরম</Link></li>
            <li><Link to="/results" className="hover:text-emerald-500 transition-colors">পরীক্ষার ফলাফল</Link></li>
            <li><Link to="/notices" className="hover:text-emerald-500 transition-colors">নোটিশ বোর্ড</Link></li>
            <li><Link to="/gallery" className="hover:text-emerald-500 transition-colors">ফটো গ্যালারী</Link></li>
            <li><Link to="/exams" className="hover:text-emerald-500 transition-colors">অনলাইন কুইজ পোর্টাল</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">যোগাযোগ</h4>
          <ul className="space-y-4 text-sm opacity-80">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1"><i className="fas fa-map-marker-alt"></i></span>
              <span>{settings.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1"><i className="fas fa-phone"></i></span>
              <span>{settings.phone1}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 mt-1"><i className="fas fa-envelope"></i></span>
              <span>{settings.email}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6 text-lg">প্রধান বাণী</h4>
          <p className="text-sm italic text-gray-400 leading-relaxed">
            "{settings.principalMsg.substring(0, 100)}..."
          </p>
          <p className="mt-4 text-xs font-black text-emerald-500 uppercase tracking-widest">— {settings.principalName}</p>
        </div>
      </div>
      
      <div className="mt-16 border-t border-gray-800/50 pt-8 text-center text-xs">
        <p className="opacity-40">&copy; {new Date().getFullYear()} {settings.schoolName}। সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="mt-2 text-emerald-600 font-bold opacity-60">SIA Digital Management System v2.0</p>
      </div>
    </footer>
  );
};

export default Footer;
