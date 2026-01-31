
import React, { useState, useEffect } from 'react';
import { StaffProfile, Notice, GalleryImage, SiteSettings, Course } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Database States
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [notices, setNotices] = useState<Notice[]>(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [staff, setStaff] = useState<StaffProfile[]>(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => JSON.parse(localStorage.getItem('sia_gallery') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('sia_courses') || '[]'));
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
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, notices, staff, gallery, courses, settings]);

  // Cloud Sync Logic
  const saveToCloud = async () => {
    setIsSyncing(true);
    const db = { students, notices, staff, gallery, courses, settings };
    try {
      const response = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      if (response.ok) {
        alert('অভিনন্দন! আপনার সব ডেটা এখন আপনার হোস্টিং সার্ভারে সেভ হয়েছে। এখন সবাই আপডেট দেখতে পাবে।');
      } else {
        alert('সার্ভারে সেভ করতে সমস্যা হয়েছে। দয়া করে api.php ফাইলটি ঠিকমতো আপলোড করা আছে কি না চেক করুন।');
      }
    } catch (err) {
      alert('Network error: হোস্টিং সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না।');
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
    { id: 'database', label: 'Cloud Sync (হোস্টিং)', icon: '☁️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'database':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-12 rounded-[48px] shadow-sm text-center">
              <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-4xl">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h3 className="text-3xl font-black mb-4">হোস্টিং ক্লাউড সিঙ্ক</h3>
              <p className="text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
                আপনার হোস্টিং সার্ভারের মেমোরিতে সরাসরি ডেটা সেভ করুন। এতে করে আপনি সাইটে যা পরিবর্তন করবেন তা সাথে সাথে লাইভ হয়ে যাবে এবং আপনার হোস্টিং এর স্টোরেজ ব্যবহার হবে।
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <button 
                  onClick={saveToCloud} 
                  disabled={isSyncing}
                  className={`w-full max-w-sm ${isSyncing ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700'} text-white p-6 rounded-[32px] font-black flex items-center justify-center gap-4 shadow-2xl transition transform active:scale-95`}
                >
                  {isSyncing ? (
                    <><i className="fas fa-spinner animate-spin"></i> সিঙ্কিং হচ্ছে...</>
                  ) : (
                    <><i className="fas fa-cloud-upload-alt"></i> সার্ভারে সেভ করুন (Live Update)</>
                  )}
                </button>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Server File: sia_db.json</p>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-[40px] border border-amber-100 flex gap-6 items-start">
               <div className="text-amber-600 text-2xl mt-1"><i className="fas fa-info-circle"></i></div>
               <div>
                 <h4 className="font-black text-amber-900 mb-2">জরুরী নির্দেশাবলী:</h4>
                 <ul className="text-sm text-amber-800 space-y-2 list-disc pl-4 opacity-80">
                   <li>এই বাটনটি ক্লিক করলে আপনার ব্রাউজারের সব লোকাল ডেটা হোস্টিং সার্ভারে চলে যাবে।</li>
                   <li>নিশ্চিত হোন যে আপনার হোস্টিং এর `public_html` ফোল্ডারে `api.php` ফাইলটি আছে।</li>
                   <li>একবার সেভ করার পর পৃথিবীর যেকোনো প্রান্ত থেকে ভিজিটররা আপনার করা পরিবর্তনগুলো দেখতে পাবে।</li>
                 </ul>
               </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-10 rounded-[40px] shadow-sm">
              <h3 className="text-2xl font-black mb-8 border-b pb-4">সাইট কনফিগারেশন</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase">স্কুলের নাম</label>
                  <input type="text" className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border" value={settings.schoolName} onChange={e => setSettings({...settings, schoolName: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase">ব্যানার ইমেজ (URL)</label>
                  <input type="text" className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border" value={settings.bannerImage} onChange={e => setSettings({...settings, bannerImage: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase">ঠিকানা</label>
                  <input type="text" className="w-full p-4 mt-1 rounded-2xl bg-gray-50 border" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} />
                </div>
              </div>
              <button onClick={() => alert('সেটিংস টেম্পোরারি সেভ হয়েছে। স্থায়ীভাবে লাইভ করতে Cloud Sync ব্যবহার করুন।')} className="w-full mt-10 bg-black text-white p-5 rounded-3xl font-black shadow-lg">ড্রাফট সেভ করুন</button>
            </div>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-emerald-500">
               <p className="text-xs font-black text-gray-400 uppercase mb-2">মোট শিক্ষক ও কর্মী</p>
               <h4 className="text-5xl font-black text-gray-800">{staff.length}</h4>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-blue-500">
               <p className="text-xs font-black text-gray-400 uppercase mb-2">পাবলিশ করা নোটিশ</p>
               <h4 className="text-5xl font-black text-gray-800">{notices.length}</h4>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-amber-500">
               <p className="text-xs font-black text-gray-400 uppercase mb-2">গ্যালারি ইমেজ</p>
               <h4 className="text-5xl font-black text-gray-800">{gallery.length}</h4>
            </div>
            <div className="md:col-span-3 bg-emerald-900 p-10 rounded-[48px] text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
               <div className="relative z-10">
                 <h3 className="text-3xl font-black mb-2">ডোমেইন ও হোস্টিং একটিভ</h3>
                 <p className="opacity-70 max-w-md">আপনার সাইটটি এখন আপনার নিজস্ব হোস্টিং স্টোরেজের সাথে কানেক্টেড। যেকোনো আপডেট সরাসরি সার্ভারে পাঠাতে Cloud Sync ব্যবহার করুন।</p>
               </div>
               <i className="fas fa-database text-[150px] absolute -right-10 -bottom-10 opacity-10"></i>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24">
            <div className="text-center mb-8 border-b pb-4">
               <h1 className="font-black text-emerald-800 text-lg uppercase tracking-widest">SIA Panel</h1>
               <p className="text-[10px] text-gray-400 font-bold">Connected to Server</p>
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
        <div className="lg:col-span-3">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
