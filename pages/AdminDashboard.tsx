
import React, { useState, useEffect } from 'react';
import { StaffProfile, Notice, GalleryImage, SiteSettings, Course, Student, AdmissionSubmission, TermResult, SliderImage } from '../types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(localStorage.getItem('sia_last_sync'));
  
  // Core Data States
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [staff, setStaff] = useState<StaffProfile[]>(() => JSON.parse(localStorage.getItem('sia_staff') || '[]'));
  const [notices, setNotices] = useState<Notice[]>(() => JSON.parse(localStorage.getItem('sia_notices') || '[]'));
  const [admissions, setAdmissions] = useState<AdmissionSubmission[]>(() => JSON.parse(localStorage.getItem('sia_admissions') || '[]'));
  const [courses, setCourses] = useState<Course[]>(() => JSON.parse(localStorage.getItem('sia_courses') || '[]'));
  const [gallery, setGallery] = useState<GalleryImage[]>(() => JSON.parse(localStorage.getItem('sia_gallery') || '[]'));
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('sia_site_settings');
    return saved ? JSON.parse(saved) : {
      schoolName: 'শিবগঞ্জ ইসলামী একাডেমী', tagline: 'সততা, নৈতিকতা ও শিক্ষার সমন্বয়',
      phone1: '০১৭১৬১৩৭৭০৮', email: 's124611@gmail.com', address: 'শিবগঞ্জ, চাঁপাইনবাবগঞ্জ',
      principalName: 'মোহা: ইব্রাহিম খলিল', principalMsg: 'আদর্শ মানুষ গড়াই আমাদের লক্ষ্য।',
      principalPhoto: 'https://picsum.photos/400/400?principal',
      chairmanName: 'আলহাজ্ব মোঃ জয়নাল আবেদিন', chairmanMsg: 'শিক্ষাই জাতির মেরুদণ্ড, আর নৈতিকতা তার ভিত্তি।',
      chairmanPhoto: 'https://picsum.photos/400/400?chairman',
      bannerImage: 'https://picsum.photos/1920/1080?school',
      scrollingHeadline: '২০২৪ শিক্ষাবর্ষের ভর্তি কার্যক্রম চলছে।',
      sliderImages: [
        { id: '1', url: 'https://picsum.photos/1920/800?education=1', title: 'আধুনিক ও দ্বীনি শিক্ষার সমন্বয়' },
        { id: '2', url: 'https://picsum.photos/1920/800?education=2', title: 'স্মার্ট ক্লাসরুম ও দক্ষ শিক্ষক' }
      ],
      homeLayout: 'classic'
    };
  });

  // UI / Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editMode, setEditMode] = useState<'ADD' | 'EDIT'>('ADD');
  const [selectedStudentForResult, setSelectedStudentForResult] = useState<Student | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
    localStorage.setItem('sia_staff', JSON.stringify(staff));
    localStorage.setItem('sia_notices', JSON.stringify(notices));
    localStorage.setItem('sia_admissions', JSON.stringify(admissions));
    localStorage.setItem('sia_courses', JSON.stringify(courses));
    localStorage.setItem('sia_gallery', JSON.stringify(gallery));
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, staff, notices, admissions, courses, gallery, settings]);

  const saveToCloud = async () => {
    setIsSyncing(true);
    const db = { students, notices, staff, gallery, courses, settings, admissions };
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
      } else { alert('সার্ভার এরর!'); }
    } catch (err) { alert('সংযোগ বিচ্ছিন্ন!'); }
    finally { setIsSyncing(false); }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const openForm = (mode: 'ADD' | 'EDIT', item: any = null) => {
    setEditMode(mode);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    const id = editMode === 'EDIT' ? editingItem.id : (activeTab === 'students' ? data.id : Date.now().toString());

    // File processing for Admission if files are uploaded manually in modal
    let updatedItem = { ...editingItem, ...data, id };
    
    // Process files if it's an admission form in the modal
    if (activeTab === 'admissions') {
      const fileInputs = (e.currentTarget as HTMLFormElement).querySelectorAll('input[type="file"]');
      for (const input of Array.from(fileInputs) as HTMLInputElement[]) {
        if (input.files?.[0]) {
          const base64 = await toBase64(input.files[0]);
          updatedItem[input.name] = base64;
        }
      }
    }

    switch(activeTab) {
      case 'admissions': setAdmissions(editMode === 'EDIT' ? admissions.map(a => a.id === id ? updatedItem as any : a) : [updatedItem as any, ...admissions]); break;
      case 'students': setStudents(editMode === 'EDIT' ? students.map(s => s.id === id ? updatedItem as any : s) : [...students, updatedItem as any]); break;
      case 'staff': setStaff(editMode === 'EDIT' ? staff.map(s => s.id === id ? updatedItem as any : s) : [...staff, updatedItem as any]); break;
      case 'notices': setNotices(editMode === 'EDIT' ? notices.map(n => n.id === id ? updatedItem as any : n) : [updatedItem as any, ...notices]); break;
      case 'courses': setCourses(editMode === 'EDIT' ? courses.map(c => c.id === id ? updatedItem as any : c) : [...courses, updatedItem as any]); break;
      case 'gallery': setGallery(editMode === 'EDIT' ? gallery.map(g => g.id === id ? updatedItem as any : g) : [...gallery, updatedItem as any]); break;
    }
    setIsFormOpen(false);
  };

  const deleteItem = (id: string, list: any[], setList: Function) => {
    if (confirm('আপনি কি নিশ্চিত যে এটি রিমুভ করতে চান?')) {
      setList(list.filter((i: any) => i.id !== id));
    }
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'home_content', label: 'হোমপেজ কন্ট্রোল', icon: '🏠' },
    { id: 'admissions', label: 'ভর্তি আবেদন', icon: '📩' },
    { id: 'results_manager', label: 'ফলাফল এন্ট্রি', icon: '📝' },
    { id: 'students', label: 'শিক্ষার্থী তালিকা', icon: '🎓' },
    { id: 'staff', label: 'শিক্ষক ও কর্মী', icon: '🏫' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: '📢' },
    { id: 'courses', label: 'একাডেমিক শাখা', icon: '📖' },
    { id: 'gallery', label: 'গ্যালারি', icon: '🖼️' },
    { id: 'settings', label: 'সাইট প্রোফাইল', icon: '⚙️' },
    { id: 'database', label: 'সার্ভার সিঙ্ক', icon: '☁️' },
  ];

  return (
    <div className="bg-gray-100 min-h-screen py-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24 border border-gray-100">
            <h1 className="font-black text-emerald-800 text-lg uppercase mb-8 text-center pb-4 border-b">SIA Dashboard</h1>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-5 py-3 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-lg' : 'text-gray-500 hover:bg-emerald-50'}`}>
                  <span>{item.icon}</span><span className="text-xs">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {/* Dashboard Header Actions */}
          {['admissions', 'students', 'staff', 'notices', 'courses', 'gallery'].includes(activeTab) && (
            <div className="bg-white p-6 rounded-[32px] shadow-sm flex justify-between items-center border border-emerald-50 mb-6">
               <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                 {menuItems.find(m => m.id === activeTab)?.icon} {menuItems.find(m => m.id === activeTab)?.label}
               </h2>
               <button onClick={() => openForm('ADD')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition text-sm">নতুন যোগ করুন +</button>
            </div>
          )}

          {/* Tab Contents */}
          {activeTab === 'home_content' && (
            <div className="space-y-8 animate-fade-in">
              {/* Slider Controller */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
                <h3 className="text-xl font-black text-emerald-800 mb-6">🖼️ স্লাইডার ইমেজ ও কন্ট্রোল</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl mb-8">
                  <input id="slideUrl" placeholder="ইমেজ URL" className="p-4 rounded-xl border bg-white text-xs" />
                  <input id="slideTitle" placeholder="ছবির টাইটেল" className="p-4 rounded-xl border bg-white text-xs" />
                  <button onClick={() => {
                    const url = (document.getElementById('slideUrl') as HTMLInputElement).value;
                    const title = (document.getElementById('slideTitle') as HTMLInputElement).value;
                    if(url) setSettings({...settings, sliderImages: [...settings.sliderImages, {id: Date.now().toString(), url, title}]});
                  }} className="md:col-span-2 bg-emerald-600 text-white p-4 rounded-xl font-black">স্লাইডারে যুক্ত করুন</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {settings.sliderImages.map(img => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden border-2 aspect-video">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <button onClick={() => setSettings({...settings, sliderImages: settings.sliderImages.filter(s => s.id !== img.id)})} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition"><i className="fas fa-trash"></i></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice Controller */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
                <h3 className="text-xl font-black text-emerald-800 mb-4">📢 মুভিং নোটিশ টেক্সট</h3>
                <textarea value={settings.scrollingHeadline} onChange={e => setSettings({...settings, scrollingHeadline: e.target.value})} className="w-full p-5 rounded-[32px] bg-gray-50 border outline-none font-bold text-gray-700 h-24" />
              </div>

              {/* Messages Controller */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
                <h3 className="text-xl font-black text-emerald-800 mb-8">✍️ বাণী ও ছবি এডিট</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-amber-50/50 p-6 rounded-[32px] border border-amber-100 space-y-4">
                    <span className="text-[10px] font-black text-amber-600 uppercase">সম্মানিত চেয়ারম্যান</span>
                    <input value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} className="w-full p-4 rounded-2xl border" placeholder="নাম" />
                    <input value={settings.chairmanPhoto} onChange={e => setSettings({...settings, chairmanPhoto: e.target.value})} className="w-full p-4 rounded-2xl border" placeholder="ফটো URL" />
                    <textarea value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} className="w-full p-4 rounded-2xl border h-32" placeholder="বাণী" />
                  </div>
                  <div className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100 space-y-4">
                    <span className="text-[10px] font-black text-emerald-600 uppercase">প্রধান শিক্ষক</span>
                    <input value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} className="w-full p-4 rounded-2xl border" placeholder="নাম" />
                    <input value={settings.principalPhoto} onChange={e => setSettings({...settings, principalPhoto: e.target.value})} className="w-full p-4 rounded-2xl border" placeholder="ফটো URL" />
                    <textarea value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} className="w-full p-4 rounded-2xl border h-32" placeholder="বাণী" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
               <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-8 border-emerald-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-2">মোট শিক্ষার্থী</p>
                 <h4 className="text-5xl font-black text-gray-800">{students.length}</h4>
               </div>
               <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-8 border-blue-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-2">নতুন আবেদন</p>
                 <h4 className="text-5xl font-black text-blue-600">{admissions.length}</h4>
               </div>
               <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-8 border-amber-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase mb-2">স্টাফ</p>
                 <h4 className="text-5xl font-black text-amber-600">{staff.length}</h4>
               </div>
             </div>
          )}

          {['admissions', 'students', 'staff', 'notices', 'courses', 'gallery'].includes(activeTab) && (
             <div className="space-y-3 animate-fade-in">
                {(activeTab === 'admissions' ? admissions :
                  activeTab === 'students' ? students :
                  activeTab === 'staff' ? staff :
                  activeTab === 'notices' ? notices :
                  activeTab === 'courses' ? courses : gallery).map((item: any) => (
                    <div key={item.id} className="bg-white p-4 rounded-[32px] shadow-sm border border-gray-50 flex justify-between items-center group">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-emerald-600 overflow-hidden">
                           {(item.studentPhoto || item.photo || item.url) ? 
                             <img src={item.studentPhoto || item.photo || item.url} className="w-full h-full object-cover" /> : 
                             <i className="fas fa-file-alt"></i>}
                         </div>
                         <div>
                           <h4 className="font-black text-gray-800 text-sm">{item.name || item.title}</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                             {activeTab === 'admissions' ? `শ্রেণি: ${item.targetClass} | তারিখ: ${item.appliedDate}` : 
                              activeTab === 'students' ? `আইডি: ${item.id}` : item.designation || 'আইটেম'}
                           </p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => openForm('EDIT', item)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs"><i className="fas fa-edit"></i></button>
                         <button onClick={() => deleteItem(item.id, (activeTab === 'admissions' ? admissions : students), (activeTab === 'admissions' ? setAdmissions : setStudents))} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xs"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                ))}
             </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-white p-12 rounded-[48px] shadow-sm text-center border border-emerald-50">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-3xl"><i className="fas fa-cloud-upload-alt"></i></div>
              <h3 className="text-2xl font-black mb-4 uppercase text-gray-800">সার্ভার ডাটাবেজ আপডেট</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm">ড্যাশবোর্ডের সব পরিবর্তন স্থায়ী করতে সার্ভারে সেভ করুন।</p>
              <button onClick={saveToCloud} disabled={isSyncing} className="w-full max-w-xs bg-emerald-600 text-white p-5 rounded-[32px] font-black shadow-xl">
                {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সার্ভারে সেভ করুন ➔'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-emerald-900 uppercase">{editMode === 'EDIT' ? 'সংশোধন' : 'নতুন সংযোজন'}</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto">
              {activeTab === 'admissions' && (
                <div className="space-y-6">
                   <input name="name" defaultValue={editingItem?.name} placeholder="নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                   <div className="grid grid-cols-2 gap-4">
                      <input name="targetClass" defaultValue={editingItem?.targetClass} placeholder="শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                      <input name="phone" defaultValue={editingItem?.phone} placeholder="মোবাইল" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">শিক্ষার্থীর ছবি</label>
                        <input type="file" name="studentPhoto" accept="image/*" className="w-full text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">জন্ম সনদ</label>
                        <input type="file" name="birthCertificate" accept="image/*" className="w-full text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">পিতার ছবি</label>
                        <input type="file" name="fatherPhoto" accept="image/*" className="w-full text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">মাতার ছবি</label>
                        <input type="file" name="motherPhoto" accept="image/*" className="w-full text-xs" />
                      </div>
                   </div>
                </div>
              )}
              {activeTab === 'students' && (
                <>
                  <input name="id" defaultValue={editingItem?.id} placeholder="আইডি" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <input name="name" defaultValue={editingItem?.name} placeholder="পূর্ণ নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="class" defaultValue={editingItem?.class} placeholder="শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                    <input name="roll" defaultValue={editingItem?.roll} placeholder="রোল" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  </div>
                </>
              )}
              {/* Other simple forms (notices, gallery etc) */}
              {['notices', 'gallery', 'staff'].includes(activeTab) && (
                <div className="space-y-4">
                  <input name="title" defaultValue={editingItem?.title || editingItem?.name} placeholder="টাইটেল / নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  {activeTab === 'gallery' && <input name="url" defaultValue={editingItem?.url} placeholder="ইমেজ URL" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />}
                  {activeTab === 'staff' && <input name="designation" defaultValue={editingItem?.designation} placeholder="পদবী" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />}
                </div>
              )}
              <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-3xl font-black shadow-xl mt-6">সংরক্ষণ করুন</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
