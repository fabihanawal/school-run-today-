
import React, { useState, useEffect } from 'react';
import { StaffProfile, Notice, GalleryImage, SiteSettings, Course } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('sia_last_sync'));
  
  // States
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [notices, setNotices] = useState<Notice[]>(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [staff, setStaff] = useState<StaffProfile[]>(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => JSON.parse(localStorage.getItem('sia_gallery') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('sia_courses') || '[]'));
  const [quizzes, setQuizzes] = useState(() => JSON.parse(localStorage.getItem('sia_quizzes') || '[]'));
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়',
      phone1: '০১৭১৬১৩৭৭০৮',
      email: 's124611@gmail.com',
      address: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ',
      principalName: 'মোহা: ইব্রাহিম খলিল',
      principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/200/200?man',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন',
      chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/200/200?elder',
      bannerImage: 'https://picsum.photos/1920/1080?school'
    };
  });

  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
    localStorage.setItem('sia_notices', JSON.stringify(notices));
    localStorage.setItem('sia_staff', JSON.stringify(staff));
    localStorage.setItem('sia_gallery', JSON.stringify(gallery));
    localStorage.setItem('sia_courses', JSON.stringify(courses));
    localStorage.setItem('sia_quizzes', JSON.stringify(quizzes));
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, notices, staff, gallery, courses, settings, quizzes]);

  const saveToCloud = async () => {
    setIsSyncing(true);
    const db = { students, notices, staff, gallery, courses, settings, quizzes };
    try {
      const response = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      if (response.ok) {
        const now = new Date().toLocaleString('bn-BD');
        setLastSync(now);
        localStorage.setItem('sia_last_sync', now);
        alert('সফল হয়েছে! সকল তথ্য সার্ভারে সংরক্ষিত হয়েছে।');
      } else {
        alert('সার্ভার এরর! দয়া করে হোস্টিং ফোল্ডার পারমিশন চেক করুন।');
      }
    } catch (err) {
      alert('সংযোগ বিচ্ছিন্ন! ইন্টারনেট চেক করুন।');
    } finally {
      setIsSyncing(false);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'staff', label: 'শিক্ষক-কর্মী', icon: '🏫' },
    { id: 'notices', label: 'নোটিশ', icon: '📢' },
    { id: 'gallery', label: 'গ্যালারি', icon: '🖼️' },
    { id: 'settings', label: 'সেটিংস', icon: '⚙️' },
    { id: 'database', label: 'সার্ভার সিঙ্ক', icon: '☁️' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24">
            <div className="text-center mb-8 border-b pb-4">
               <h1 className="font-black text-emerald-800 text-lg uppercase tracking-widest">SIA Admin</h1>
               <div className="mt-2 flex items-center justify-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <p className="text-[10px] text-gray-400 font-bold">Online Mode</p>
               </div>
            </div>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-xl translate-x-1' : 'text-gray-500 hover:bg-emerald-50'}`}>
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {activeTab === 'database' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white p-12 rounded-[48px] shadow-sm text-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-4xl">
                  <i className="fas fa-server"></i>
                </div>
                <h3 className="text-3xl font-black mb-4">ক্লাউড ডাটাবেজ কন্ট্রোল</h3>
                <p className="text-gray-500 mb-2 max-w-lg mx-auto leading-relaxed">
                  আপনার করা সকল পরিবর্তন লাইভ সার্ভারে সেভ করার জন্য নিচের বাটনে ক্লিক করুন।
                </p>
                {lastSync && <p className="text-xs font-bold text-emerald-600 mb-10 italic">সর্বশেষ আপডেট: {lastSync}</p>}
                
                <button 
                  onClick={saveToCloud} 
                  disabled={isSyncing}
                  className={`w-full max-w-sm ${isSyncing ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'} text-white p-6 rounded-[32px] font-black flex items-center justify-center gap-4 shadow-2xl transition transform active:scale-95`}
                >
                  {isSyncing ? <><i className="fas fa-sync animate-spin"></i> প্রসেসিং...</> : <><i className="fas fa-cloud-upload-alt"></i> সার্ভারে আপডেট করুন</>}
                </button>
              </div>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-emerald-500">
                 <p className="text-xs font-black text-gray-400 uppercase mb-2">মোট শিক্ষক</p>
                 <h4 className="text-5xl font-black text-gray-800">{staff.length}</h4>
              </div>
              <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-blue-500">
                 <p className="text-xs font-black text-gray-400 uppercase mb-2">পাবলিশ করা নোটিশ</p>
                 <h4 className="text-5xl font-black text-gray-800">{notices.length}</h4>
              </div>
              <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-amber-500">
                 <p className="text-xs font-black text-gray-400 uppercase mb-2">স্টুডেন্ট ডাটা</p>
                 <h4 className="text-5xl font-black text-gray-800">{students.length}</h4>
              </div>
              <div className="md:col-span-3 bg-white p-10 rounded-[48px] border-2 border-dashed border-emerald-100 flex flex-col items-center justify-center text-center">
                 <h3 className="text-2xl font-black text-emerald-900 mb-2">স্বাগতম, অ্যাডমিন!</h3>
                 <p className="text-gray-500 max-w-md">এখান থেকে আপনি আপনার একাডেমীর সকল কার্যক্রম নিয়ন্ত্রণ করতে পারবেন। কোনো পরিবর্তন করার পর অবশ্যই 'সার্ভার সিঙ্ক' থেকে সেভ করবেন।</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[40px] shadow-sm text-center py-24">
              <i className="fas fa-tools text-6xl text-gray-200 mb-6"></i>
              <h2 className="text-2xl font-black text-gray-400">এই সেকশনটি নিয়ে কাজ চলছে...</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
