
import React, { useState, useEffect } from 'react';
import { StaffProfile, Notice, GalleryImage, SiteSettings, Course } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('sia_last_sync'));
  
  // Data States
  const [students, setStudents] = useState<any[]>(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [notices, setNotices] = useState<Notice[]>(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [staff, setStaff] = useState<StaffProfile[]>(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => JSON.parse(localStorage.getItem('sia_gallery') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('sia_courses') || '[]'));
  const [quizzes, setQuizzes] = useState<any[]>(() => JSON.parse(localStorage.getItem('sia_quizzes') || '[]'));
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
      bannerImage: 'https://picsum.photos/1920/1080?school',
      homeLayout: 'classic'
    };
  });

  // Edit States
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
        alert('সার্ভার এরর!');
      }
    } catch (err) {
      alert('সংযোগ বিচ্ছিন্ন!');
    } finally {
      setIsSyncing(false);
    }
  };

  const openForm = (item: any = null) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleDelete = (id: string, list: any[], setList: Function) => {
    if (window.confirm('ডিলিট করতে চান?')) {
      setList(list.filter(item => item.id !== id));
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    
    const id = editingItem?.id || Date.now().toString();
    const newItem = { ...editingItem, ...data, id };

    // Quiz Questions support (simple JSON parsing for simplicity in this demo)
    if (activeTab === 'quizzes') {
        try {
            newItem.questions = JSON.parse(data.questions_raw as string);
        } catch(e) {
            newItem.questions = [];
        }
    }

    switch(activeTab) {
      case 'staff': setStaff(editingItem ? staff.map(s => s.id === id ? newItem as any : s) : [...staff, newItem as any]); break;
      case 'notices': setNotices(editingItem ? notices.map(n => n.id === id ? newItem as any : n) : [newItem as any, ...notices]); break;
      case 'gallery': setGallery(editingItem ? gallery.map(g => g.id === id ? newItem as any : g) : [...gallery, newItem as any]); break;
      case 'courses': setCourses(editingItem ? courses.map(c => c.id === id ? newItem as any : c) : [...courses, newItem as any]); break;
      case 'students': setStudents(editingItem ? students.map(s => s.id === id ? newItem as any : s) : [...students, newItem as any]); break;
      case 'quizzes': setQuizzes(editingItem ? quizzes.map(q => q.id === id ? newItem as any : q) : [...quizzes, newItem as any]); break;
    }
    closeForm();
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'layout', label: 'হোম লেআউট', icon: '🎨' },
    { id: 'staff', label: 'শিক্ষক-কর্মী', icon: '🏫' },
    { id: 'notices', label: 'নোটিশ', icon: '📢' },
    { id: 'gallery', label: 'গ্যালারি', icon: '🖼️' },
    { id: 'courses', label: 'কোর্সসমূহ', icon: '📖' },
    { id: 'students', label: 'শিক্ষার্থী', icon: '🎓' },
    { id: 'quizzes', label: 'কুইজ', icon: '📝' },
    { id: 'settings', label: 'সাইট সেটিংস', icon: '⚙️' },
    { id: 'database', label: 'সার্ভার সিঙ্ক', icon: '☁️' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24 overflow-hidden">
            <div className="text-center mb-8 border-b pb-4">
               <h1 className="font-black text-emerald-800 text-lg uppercase">SIA Admin</h1>
            </div>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-5 py-3 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold' : 'text-gray-500 hover:bg-emerald-50'}`}>
                  <span>{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'overview' && (
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
                 <p className="text-xs font-black text-gray-400 uppercase mb-2">মোট শিক্ষার্থী</p>
                 <h4 className="text-5xl font-black text-gray-800">{students.length}</h4>
              </div>
            </div>
          )}

          {activeTab === 'layout' && (
            <div className="bg-white p-10 rounded-[48px] shadow-sm animate-fade-in space-y-8">
               <h3 className="text-2xl font-black text-gray-800">হোম পেজ লেআউট নির্বাচন করুন</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'classic', label: 'Classic Style', color: 'bg-emerald-50', icon: '🏛️' },
                    { id: 'modern', label: 'Modern Style', color: 'bg-blue-50', icon: '🚀' },
                    { id: 'focus', label: 'Minimal Focus', color: 'bg-gray-50', icon: '⚖️' }
                  ].map(layout => (
                    <button 
                      key={layout.id} 
                      onClick={() => setSettings({...settings, homeLayout: layout.id as any})}
                      className={`p-8 rounded-[32px] border-4 transition-all text-center group ${settings.homeLayout === layout.id ? 'border-emerald-500 shadow-xl' : 'border-transparent hover:border-gray-100'}`}
                    >
                       <div className={`w-16 h-16 ${layout.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl`}>{layout.icon}</div>
                       <p className="font-black text-gray-800">{layout.label}</p>
                       <p className="text-[10px] text-gray-400 mt-2">লেআউট স্টাইল {layout.id}</p>
                    </button>
                  ))}
               </div>
               <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                  <p className="text-emerald-800 font-bold">লেআউট পরিবর্তন করে "সার্ভার সিঙ্ক" থেকে সেভ করুন।</p>
               </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-10 rounded-[48px] shadow-sm animate-fade-in space-y-8">
               <h3 className="text-2xl font-black text-emerald-900 mb-6">সাইট জেনারেল সেটিংস</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase">স্কুলের নাম</label>
                    <input value={settings.schoolName} onChange={e => setSettings({...settings, schoolName: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase">ট্যাগলাইন</label>
                    <input value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase">ব্যানার ইমেজ URL</label>
                    <input value={settings.bannerImage} onChange={e => setSettings({...settings, bannerImage: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase">মোবাইল নম্বর</label>
                    <input value={settings.phone1} onChange={e => setSettings({...settings, phone1: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
               </div>
               <div className="pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="font-black text-gray-700">প্রধান শিক্ষকের তথ্য</h4>
                     <input value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} placeholder="নাম" className="w-full p-3 rounded-xl border" />
                     <textarea value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} placeholder="বাণী" className="w-full p-3 rounded-xl border h-24" />
                     <input value={settings.principalPhoto} onChange={e => setSettings({...settings, principalPhoto: e.target.value})} placeholder="ফটো URL" className="w-full p-3 rounded-xl border" />
                  </div>
                  <div className="space-y-4">
                     <h4 className="font-black text-gray-700">সভাপতির তথ্য</h4>
                     <input value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} placeholder="নাম" className="w-full p-3 rounded-xl border" />
                     <textarea value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} placeholder="বাণী" className="w-full p-3 rounded-xl border h-24" />
                     <input value={settings.chairmanPhoto} onChange={e => setSettings({...settings, chairmanPhoto: e.target.value})} placeholder="ফটো URL" className="w-full p-3 rounded-xl border" />
                  </div>
               </div>
               <button onClick={() => alert('সেভ করা হয়েছে!')} className="w-full bg-emerald-600 text-white p-5 rounded-3xl font-black shadow-xl">সেটিংস আপডেট করুন</button>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-white p-12 rounded-[48px] shadow-sm text-center animate-fade-in">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl">
                <i className="fas fa-server"></i>
              </div>
              <h3 className="text-3xl font-black mb-4">ক্লাউড ডাটাবেজ কন্ট্রোল</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">আপনার করা সকল পরিবর্তন লাইভ সার্ভারে সেভ করার জন্য নিচের বাটনে ক্লিক করুন।</p>
              {lastSync && <p className="text-xs font-bold text-emerald-600 mb-10 italic">সর্বশেষ আপডেট: {lastSync}</p>}
              <button onClick={saveToCloud} disabled={isSyncing} className={`w-full max-w-sm ${isSyncing ? 'bg-gray-400' : 'bg-emerald-600'} text-white p-6 rounded-[32px] font-black shadow-2xl transition transform active:scale-95`}>
                {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সার্ভারে আপডেট করুন ➔'}
              </button>
            </div>
          )}

          {['staff', 'notices', 'gallery', 'courses', 'students', 'quizzes'].includes(activeTab) && (
            <div className="bg-white p-8 rounded-[48px] shadow-sm animate-fade-in space-y-8">
               <div className="flex justify-between items-center pb-6 border-b">
                  <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3 capitalize">
                    {menuItems.find(m => m.id === activeTab)?.icon} {menuItems.find(m => m.id === activeTab)?.label}
                  </h3>
                  <button onClick={() => openForm()} className="bg-emerald-600 text-white px-6 py-2 rounded-2xl font-black shadow-lg">নতুন যোগ করুন +</button>
               </div>

               <div className="space-y-4">
                  {activeTab === 'staff' && staff.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <img src={s.photo || "https://picsum.photos/100/100"} className="w-12 h-12 rounded-xl object-cover" />
                        <div><h4 className="font-black text-gray-800">{s.name}</h4><p className="text-xs text-emerald-600 font-bold">{s.designation}</p></div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openForm(s)} className="p-2 text-blue-600"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDelete(s.id, staff, setStaff)} className="p-2 text-red-600"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                  {/* Similar mapping for others... logic is same */}
                  {activeTab === 'notices' && notices.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div><h4 className="font-black text-gray-800">{n.title}</h4><p className="text-[10px] text-gray-400 font-bold">{n.date} | {n.type}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => openForm(n)} className="p-2 text-blue-600"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDelete(n.id, notices, setNotices)} className="p-2 text-red-600"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                  {activeTab === 'students' && students.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div><h4 className="font-black text-gray-800">{s.name}</h4><p className="text-[10px] text-emerald-600 font-bold">ID: {s.id} | Class: {s.class}</p></div>
                      <div className="flex gap-2">
                        <button onClick={() => openForm(s)} className="p-2 text-blue-600"><i className="fas fa-edit"></i></button>
                        <button onClick={() => handleDelete(s.id, students, setStudents)} className="p-2 text-red-600"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-xl font-black text-emerald-900">{editingItem ? 'তথ্য আপডেট করুন' : 'নতুন ডাটা যোগ করুন'}</h3>
              <button onClick={closeForm} className="text-gray-400 hover:text-red-500 text-2xl">✕</button>
            </div>
            <form onSubmit={handleSaveItem} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {activeTab === 'staff' && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="নাম" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="designation" defaultValue={editingItem?.designation} placeholder="পদবী" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="mobile" defaultValue={editingItem?.mobile} placeholder="মোবাইল নম্বর" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="photo" defaultValue={editingItem?.photo} placeholder="ফটোর লিংক (URL)" className="w-full p-4 rounded-2xl bg-gray-50 border" />
                </>
              )}
              {activeTab === 'notices' && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="নোটিশ টাইটেল" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="date" defaultValue={editingItem?.date || new Date().toLocaleDateString('bn-BD')} placeholder="তারিখ" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="type" defaultValue={editingItem?.type || 'সাধারণ'} placeholder="টাইপ (জরুরি/ভর্তি/একাডেমিক)" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <textarea name="content" defaultValue={editingItem?.content} placeholder="বিস্তারিত..." className="w-full p-4 rounded-2xl bg-gray-50 border h-32" />
                </>
              )}
              {activeTab === 'students' && (
                <>
                  <input name="id" defaultValue={editingItem?.id} placeholder="আইডি" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="name" defaultValue={editingItem?.name} placeholder="নাম" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="class" defaultValue={editingItem?.class} placeholder="শ্রেণি" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="roll" defaultValue={editingItem?.roll} placeholder="রোল" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                </>
              )}
              {activeTab === 'quizzes' && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="কুইজের নাম" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="subject" defaultValue={editingItem?.subject} placeholder="বিষয়" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <input name="class" defaultValue={editingItem?.class} placeholder="শ্রেণি (যেমন: ১০ম)" className="w-full p-4 rounded-2xl bg-gray-50 border" required />
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400">প্রশ্নসমূহ (JSON Format)</label>
                    <textarea 
                        name="questions_raw" 
                        defaultValue={JSON.stringify(editingItem?.questions || [{question: 'Sample?', options: ['A','B','C','D'], correctIndex: 0}], null, 2)} 
                        className="w-full p-4 rounded-2xl bg-gray-50 border h-48 font-mono text-xs" 
                    />
                  </div>
                </>
              )}
              <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-3xl font-black shadow-xl">সংরক্ষণ করুন</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
