
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-4">শিবগঞ্জ ইসলামী একাডেমী</h3>
          <p className="text-sm leading-relaxed">
            একটি ঐতিহ্যবাহী শিক্ষা প্রতিষ্ঠান যেখানে আধুনিক শিক্ষার সাথে ইসলামী মূল্যবোধের অনন্য সমন্বয় ঘটে।
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="#" className="hover:text-emerald-500 transition"><i className="fab fa-facebook"></i> Facebook</a>
            <a href="#" className="hover:text-emerald-500 transition"><i className="fab fa-youtube"></i> YouTube</a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">গুরুত্বপূর্ণ লিঙ্ক</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/admission" className="hover:text-emerald-500">অনলাইন ভর্তি</Link></li>
            <li><Link to="/results" className="hover:text-emerald-500">ফলাফল দেখুন</Link></li>
            <li><Link to="/notices" className="hover:text-emerald-500">নোটিশ বোর্ড</Link></li>
            <li><Link to="/gallery" className="hover:text-emerald-500">ফটো গ্যালারী</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">যোগাযোগ করুন</h4>
          <ul className="space-y-2 text-sm">
            <li>শিবগঞ্জ, চাঁপাইনবাবগঞ্জ</li>
            <li>ফোন: ০১৭১৬১৩৭৭০৮</li>
            <li>ইমেইল: s124611@gmail.com</li>
            <li>EIIN: ১২৪৬১১</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-lg">প্রধান বাণী</h4>
          <p className="text-sm italic text-gray-400">
            "আমাদের লক্ষ্য হলো প্রতিটি শিক্ষার্থীকে সুশিক্ষায় শিক্ষিত করে আদর্শ মানুষ হিসেবে গড়ে তোলা।"
          </p>
          <p className="mt-2 text-xs font-bold text-gray-200">— মোহা: ইব্রাহিম খলিল (প্রধান শিক্ষক)</p>
        </div>
      </div>
      
      <div className="mt-12 border-t border-gray-800 pt-6 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} শিবগঞ্জ ইসলামী একাডেমী। সর্বস্বত্ব সংরক্ষিত।</p>
        <p className="mt-1 text-gray-500">Developed by SIA Tech Team</p>
      </div>
    </footer>
  );
};

export default Footer;
