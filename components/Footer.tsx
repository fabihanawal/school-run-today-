import React from 'react';
import { Link } from 'react-router-dom';
import { useSchoolSettings } from '../src/lib/storage';

const Footer: React.FC = () => {
  const [settings] = useSchoolSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-4 border-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.schoolName} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-emerald-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-300 text-xl">
                  <i className="fas fa-graduation-cap"></i>
                </div>
              )}
              <div>
                <h3 className="text-white text-lg font-black leading-tight">{settings.schoolName}</h3>
                <p className="text-[11px] text-emerald-400 font-medium">EIIN: {settings.eiin || '১২৪৬১১'} · স্থাপিত: {settings.estYear || '১৯৯৮'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline}। একটি ঐতিহ্যবাহী দ্বীনি ও আধুনিক শিক্ষাপ্রতিষ্ঠান যা আদর্শ ও নৈতিকতাসম্পন্ন সুনাগরিক গড়ে তোলায় নিবেদিত।
            </p>

            <div className="pt-2 flex items-center gap-3">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  title="Facebook"
                >
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                  title="YouTube"
                >
                  <i className="fab fa-youtube text-sm"></i>
                </a>
              )}
              {settings.whatsapp && (
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"
                  title="WhatsApp"
                >
                  <i className="fab fa-whatsapp text-sm"></i>
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-emerald-400">
              গুরুত্বপূর্ণ লিঙ্কসমূহ
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>আমাদের পরিচিতি ও শিক্ষক পরিষদ</span>
                </Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>শিক্ষা কার্যক্রম ও কারিকুলাম</span>
                </Link>
              </li>
              <li>
                <Link to="/admission" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অনলাইন ভর্তি আবেদন ফরম</span>
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অনলাইন ফলাফল অনুসন্ধান</span>
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অফিসিয়াল নোটিশ বোর্ড</span>
                </Link>
              </li>
              <li>
                <Link to="/exams" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>অনলাইন কুইজ ও পরীক্ষা পোর্টাল</span>
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-emerald-400 transition flex items-center gap-2">
                  <i className="fas fa-chevron-right text-[9px] text-emerald-500"></i>
                  <span>ক্যাম্পাস ফটো গ্যালারি</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Office Hours */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-emerald-400">
              যোগাযোগ ও অফিস সময়
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <i className="fas fa-map-marker-alt text-emerald-400 mt-0.5"></i>
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fas fa-phone-alt text-emerald-400"></i>
                <span>{settings.phone1} {settings.phone2 ? `· ${settings.phone2}` : ''}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <i className="fas fa-envelope text-emerald-400"></i>
                <span>{settings.email}</span>
              </li>
              <li className="flex items-start gap-2.5 pt-1 border-t border-slate-900">
                <i className="fas fa-clock text-amber-400 mt-0.5"></i>
                <span className="text-slate-300">{settings.officeHours || 'শনি - বৃহস্পতি: সকাল ৮:০০ - বিকাল ৪:০০'}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Message from Principal */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wide uppercase mb-4 text-emerald-400">
              প্রধান শিক্ষকের বাণী
            </h4>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
              <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-4">
                "{settings.principalMsg}"
              </p>
              <div className="flex items-center gap-2.5 pt-2 border-t border-slate-800">
                {settings.principalPhoto && (
                  <img src={settings.principalPhoto} alt={settings.principalName} className="w-8 h-8 rounded-full object-cover border border-emerald-500" />
                )}
                <div>
                  <p className="text-xs font-bold text-white leading-none">{settings.principalName}</p>
                  <p className="text-[10px] text-emerald-400 mt-0.5">{settings.principalDesignation || 'প্রধান শিক্ষক'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            &copy; {new Date().getFullYear()} {settings.schoolName}। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>EIIN: {settings.eiin}</span>
            <span>·</span>
            <span>সেশন: {settings.currentSession}</span>
            <span>·</span>
            <Link to="/login" className="text-slate-400 hover:text-emerald-400 transition">প্রশাসনিক লগইন</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
