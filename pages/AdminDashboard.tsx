
import React, { useState, useEffect } from 'react';
import { StaffProfile, Notice, GalleryImage, SiteSettings, Course, Student, AdmissionSubmission, TermResult, SliderImage } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('sia_last_sync'));
  
  // Data States
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [notices, setNotices] = useState<Notice[]>(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [staff, setStaff] = useState<StaffProfile[]>(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => JSON.parse(localStorage.getItem('sia_gallery') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('sia_courses') || '[]'));
  const [quizzes, setQuizzes] = useState<any[]>(() => JSON.parse(localStorage.getItem('sia_quizzes') || '[]'));
  const [admissions, setAdmissions] = useState<AdmissionSubmission[]>(() => JSON.parse(localStorage.getItem('sia_admissions') || '[]'));
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী',
      tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়',
      phone1: '০১৭১৬১৩৭৭০৮', email: 's124611@gmail.com', address: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ',
      principalName: 'মোহা: ইব্রাহিম খলিল', principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/400/400?principal',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন', chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/400/400?chairman',
      bannerImage: 'https://picsum.photos/1920/1080?school',
      scrollingHeadline: '২০২৪ শিক্ষাবর্ষের ভর্তি কার্যক্রম চলছে।',
      sliderImages: [],
      homeLayout: 'classic'
    };
  });

  // Local States for Slider Edit
  const [newSliderUrl, setNewSliderUrl] = useState('');
  const [newSliderTitle, setNewSliderTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
    localStorage.setItem('sia_notices', JSON.stringify(notices));
    localStorage.setItem('sia_staff', JSON.stringify(staff));
    localStorage.setItem('sia_gallery', JSON.stringify(gallery));
    localStorage.setItem('sia_courses', JSON.stringify(courses));
    localStorage.setItem('sia_quizzes', JSON.stringify(quizzes));
    localStorage.setItem('sia_admissions', JSON.stringify(admissions));
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, notices, staff, gallery, courses, settings, quizzes, admissions]);

  const saveToCloud = async () => {
    setIsSyncing(true);
    const db = { students, notices, staff, gallery, courses, settings, quizzes, admissions };
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
        alert('সফল হয়েছে! সার্ভারে ডাটা আপডেট হয়েছে।');
      } else { alert('সার্ভার এরর!'); }
    } catch (err) { alert('সংযোগ বিচ্ছিন্ন!'); }
    finally { setIsSyncing(false); }
  };

  const addSliderImage = () => {
    if (!newSliderUrl) return;
    const newImg: SliderImage = { id: Date.now().toString(), url: newSliderUrl, title: newSliderTitle };
    setSettings({ ...settings, sliderImages: [...settings.sliderImages, newImg] });
    setNewSliderUrl(''); setNewSliderTitle('');
  };

  const removeSliderImage = (id: string) => {
    setSettings({ ...settings, sliderImages: settings.sliderImages.filter(img => img.id !== id) });
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'home_content', label: 'হোম কন্টেন্ট', icon: '🏠' },
    { id: 'admissions', label: 'ভর্তি আবেদন', icon: '📩' },
    { id: 'results_manager', label: 'ফলাফল এন্ট্রি', icon: '📝' },
    { id: 'students', label: 'শিক্ষার্থী', icon: '🎓' },
    { id: 'staff', label: 'শিক্ষক-কর্মী', icon: '🏫' },
    { id: 'settings', label: 'সাইট সেটিংস', icon: '⚙️' },
    { id: 'database', label: 'সার্ভার সিঙ্ক', icon: '☁️' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24 overflow-hidden">
            <div className="text-center mb-8 border-b pb-4"><h1 className="font-black text-emerald-800 text-lg uppercase tracking-tighter">SIA Admin</h1></div>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-5 py-3 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold' : 'text-gray-500 hover:bg-emerald-50'}`}>
                  <span>{item.icon}</span><span className="text-xs">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'home_content' && (
            <div className="bg-white p-8 md:p-12 rounded-[48px] shadow-sm animate-fade-in space-y-12">
               {/* Marquee Setup */}
               <div className="space-y-4">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><i className="fas fa-bullhorn text-emerald-600"></i> মুভিং নোটিশ (Headline)</h3>
                  <p className="text-xs text-gray-400 font-bold">হোমপেজের স্লাইডারের নিচে যে নোটিশটি স্ক্রল করবে সেটি এখানে লিখুন:</p>
                  <textarea 
                    value={settings.scrollingHeadline} 
                    onChange={e => setSettings({...settings, scrollingHeadline: e.target.value})} 
                    className="w-full p-5 rounded-[24px] bg-gray-50 border outline-none focus:border-emerald-500 h-24 font-bold"
                  />
               </div>

               {/* Slider Setup */}
               <div className="space-y-6 pt-8 border-t">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-2"><i className="fas fa-images text-emerald-600"></i> হোম স্লাইডার ইমেজ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50 p-6 rounded-[32px]">
                     <input placeholder="ছবির ডাইরেক্ট লিংক (URL)" value={newSliderUrl} onChange={e => setNewSliderUrl(e.target.value)} className="p-4 rounded-xl border outline-none" />
                     <input placeholder="ছবির উপর লেখা টাইটেল" value={newSliderTitle} onChange={e => setNewSliderTitle(e.target.value)} className="p-4 rounded-xl border outline-none" />
                     <button onClick={addSliderImage} className="md:col-span-2 bg-emerald-600 text-white p-4 rounded-xl font-black shadow-lg">স্লাইডারে যুক্ত করুন +</button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                     {settings.sliderImages.map(img => (
                       <div key={img.id} className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                          <img src={img.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                             <p className="text-[10px] text-white font-bold mb-2">{img.title}</p>
                             <button onClick={() => removeSliderImage(img.id)} className="bg-red-500 text-white p-2 rounded-lg text-xs font-black">ডিলিট</button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
               <div className="p-4 bg-amber-50 rounded-2xl text-[10px] text-amber-700 font-bold border border-amber-100">স্লাইডশো ছবিতে ভালো রেজোলিউশনের (১৯২০ x ৮০০ পিক্সেল) ছবি ব্যবহার করার পরামর্শ দেওয়া হলো।</div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-10 rounded-[48px] shadow-sm animate-fade-in space-y-10">
               <h3 className="text-2xl font-black text-gray-800">অ্যাকাডেমিক প্রধানগণের বাণী ব্যবস্থাপনা</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Chairman Form */}
                  <div className="p-8 bg-gray-50 rounded-[40px] space-y-4">
                     <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs">সভাপতি প্রোফাইল</h4>
                     <input value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} placeholder="নাম" className="w-full p-4 rounded-2xl border" />
                     <input value={settings.chairmanPhoto} onChange={e => setSettings({...settings, chairmanPhoto: e.target.value})} placeholder="ফটো লিংক" className="w-full p-4 rounded-2xl border" />
                     <textarea value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} placeholder="সভাপতির বাণী..." className="w-full p-4 rounded-2xl border h-40" />
                  </div>
                  {/* Principal Form */}
                  <div className="p-8 bg-gray-50 rounded-[40px] space-y-4">
                     <h4 className="font-black text-emerald-800 uppercase tracking-widest text-xs">প্রধান শিক্ষক প্রোফাইল</h4>
                     <input value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} placeholder="নাম" className="w-full p-4 rounded-2xl border" />
                     <input value={settings.principalPhoto} onChange={e => setSettings({...settings, principalPhoto: e.target.value})} placeholder="ফটো লিংক" className="w-full p-4 rounded-2xl border" />
                     <textarea value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} placeholder="প্রধান শিক্ষকের বাণী..." className="w-full p-4 rounded-2xl border h-40" />
                  </div>
               </div>
               <button onClick={() => alert('পরিবর্তন সংরক্ষিত হয়েছে। ডাটাবেজ সিঙ্ক করতে ভুলবেন না।')} className="w-full bg-emerald-600 text-white p-5 rounded-[28px] font-black shadow-xl">সব কিছু আপডেট করুন</button>
            </div>
          )}

          {/* Existing Overview & Sync logic ... */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              <div className="bg-white p-6 rounded-[32px] shadow-sm border-b-8 border-emerald-500">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">মোট স্লাইডার</p>
                <h4 className="text-4xl font-black text-gray-800">{settings.sliderImages.length}</h4>
              </div>
              {/* other stats */}
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-white p-12 rounded-[48px] shadow-sm text-center animate-fade-in">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl"><i className="fas fa-server"></i></div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">সার্ভার ডাটাবেজ কন্ট্রোল</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">স্লাইডার ইমেজ বা বাণী পরিবর্তনের পর অবশ্যই সিঙ্ক বাটনে ক্লিক করুন।</p>
              {lastSync && <p className="text-xs font-bold text-emerald-600 mb-10 italic">সর্বশেষ আপডেট: {lastSync}</p>}
              <button onClick={saveToCloud} disabled={isSyncing} className={`w-full max-w-sm ${isSyncing ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700'} text-white p-6 rounded-[32px] font-black shadow-2xl transition transform active:scale-95`}>
                {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সার্ভারে সেভ করুন ➔'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
