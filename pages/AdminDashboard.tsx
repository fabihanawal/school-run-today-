
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

  const openForm = (mode: 'ADD' | 'EDIT', item: any = null) => {
    setEditMode(mode);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const deleteItem = (id: string, list: any[], setList: Function) => {
    if (confirm('আপনি কি নিশ্চিত যে এটি রিমুভ করতে চান?')) {
      setList(list.filter((i: any) => i.id !== id));
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(fd.entries());
    const id = editMode === 'EDIT' ? editingItem.id : (activeTab === 'students' ? data.id : Date.now().toString());

    const newItem = { ...editingItem, ...data, id };

    switch(activeTab) {
      case 'admissions': setAdmissions(editMode === 'EDIT' ? admissions.map(a => a.id === id ? newItem as any : a) : [newItem as any, ...admissions]); break;
      case 'students': setStudents(editMode === 'EDIT' ? students.map(s => s.id === id ? newItem as any : s) : [...students, newItem as any]); break;
      case 'staff': setStaff(editMode === 'EDIT' ? staff.map(s => s.id === id ? newItem as any : s) : [...staff, newItem as any]); break;
      case 'notices': setNotices(editMode === 'EDIT' ? notices.map(n => n.id === id ? newItem as any : n) : [newItem as any, ...notices]); break;
      case 'courses': setCourses(editMode === 'EDIT' ? courses.map(c => c.id === id ? newItem as any : c) : [...courses, newItem as any]); break;
      case 'gallery': setGallery(editMode === 'EDIT' ? gallery.map(g => g.id === id ? newItem as any : g) : [...gallery, newItem as any]); break;
    }
    setIsFormOpen(false);
  };

  const addSliderImage = (url: string, title: string) => {
    if(!url) return;
    const newImg: SliderImage = { id: Date.now().toString(), url, title };
    setSettings({...settings, sliderImages: [...settings.sliderImages, newImg]});
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
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24 overflow-hidden border border-gray-100">
            <div className="text-center mb-8 border-b pb-4">
              <h1 className="font-black text-emerald-800 text-lg uppercase tracking-tighter">SIA Admin</h1>
            </div>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full text-left px-5 py-3 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-lg' : 'text-gray-500 hover:bg-emerald-50'}`}>
                  <span className="text-lg">{item.icon}</span><span className="text-xs">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Header Action Bar for Lists */}
          {['admissions', 'students', 'staff', 'notices', 'courses', 'gallery'].includes(activeTab) && (
            <div className="bg-white p-6 rounded-[32px] shadow-sm flex justify-between items-center border border-emerald-50 mb-6">
               <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                 {menuItems.find(m => m.id === activeTab)?.icon} {menuItems.find(m => m.id === activeTab)?.label}
               </h2>
               <button onClick={() => openForm('ADD')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition text-sm">নতুন যোগ করুন +</button>
            </div>
          )}

          {/* Home Content Tab */}
          {activeTab === 'home_content' && (
            <div className="space-y-8 animate-fade-in">
               {/* Slider Management */}
               <div className="bg-white p-10 rounded-[48px] shadow-sm border border-emerald-50">
                  <h3 className="text-xl font-black text-emerald-800 mb-6 flex items-center gap-3">🖼️ স্লাইডার ইমেজ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl mb-8">
                     <input id="slideUrl" placeholder="ছবির URL (যেমন: https://...)" className="p-4 rounded-xl border outline-none text-sm" />
                     <input id="slideTitle" placeholder="ছবির টাইটেল" className="p-4 rounded-xl border outline-none text-sm" />
                     <button onClick={() => {
                       const url = (document.getElementById('slideUrl') as HTMLInputElement).value;
                       const title = (document.getElementById('slideTitle') as HTMLInputElement).value;
                       if(url) {
                         addSliderImage(url, title);
                         (document.getElementById('slideUrl') as HTMLInputElement).value = '';
                         (document.getElementById('slideTitle') as HTMLInputElement).value = '';
                       }
                     }} className="md:col-span-2 bg-emerald-600 text-white p-4 rounded-xl font-black shadow-lg">নতুন স্লাইড যোগ করুন</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                     {settings.sliderImages.map(img => (
                       <div key={img.id} className="relative group aspect-video rounded-2xl overflow-hidden shadow-sm border-2 border-gray-100">
                          <img src={img.url} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button onClick={() => setSettings({...settings, sliderImages: settings.sliderImages.filter(s => s.id !== img.id)})} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">ডিলিট</button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-[10px] text-white font-bold truncate">{img.title}</div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Scrolling Headline */}
               <div className="bg-white p-10 rounded-[48px] shadow-sm border border-emerald-50">
                  <h3 className="text-xl font-black text-emerald-800 mb-4 flex items-center gap-3">📢 মুভিং নোটিশ</h3>
                  <textarea 
                    value={settings.scrollingHeadline} 
                    onChange={e => setSettings({...settings, scrollingHeadline: e.target.value})} 
                    placeholder="নোটিশটি এখানে লিখুন..."
                    className="w-full p-6 rounded-[32px] bg-gray-50 border outline-none focus:border-emerald-500 h-28 font-bold text-gray-700"
                  />
               </div>

               {/* Messages */}
               <div className="bg-white p-10 rounded-[48px] shadow-sm border border-emerald-50">
                  <h3 className="text-xl font-black text-emerald-800 mb-8 flex items-center gap-3">✍️ চেয়ারম্যান ও প্রধান শিক্ষকের বাণী</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-4 p-6 bg-amber-50 rounded-[40px] border border-amber-100">
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">সম্মানিত চেয়ারম্যান</span>
                        <input value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} placeholder="নাম" className="w-full p-4 rounded-2xl border bg-white" />
                        <input value={settings.chairmanPhoto} onChange={e => setSettings({...settings, chairmanPhoto: e.target.value})} placeholder="ফটো ইউআরএল" className="w-full p-4 rounded-2xl border bg-white" />
                        <textarea value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} placeholder="চেয়ারম্যানের বাণী..." className="w-full p-4 rounded-2xl border bg-white h-40" />
                     </div>
                     <div className="space-y-4 p-6 bg-emerald-50 rounded-[40px] border border-emerald-100">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">প্রধান শিক্ষক</span>
                        <input value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} placeholder="নাম" className="w-full p-4 rounded-2xl border bg-white" />
                        <input value={settings.principalPhoto} onChange={e => setSettings({...settings, principalPhoto: e.target.value})} placeholder="ফটো ইউআরএল" className="w-full p-4 rounded-2xl border bg-white" />
                        <textarea value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} placeholder="প্রধান শিক্ষকের বাণী..." className="w-full p-4 rounded-2xl border bg-white h-40" />
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Site Profile Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-emerald-50 animate-fade-in space-y-8">
               <h3 className="text-xl font-black text-emerald-800 flex items-center gap-3">⚙️ সাইট সেটিংস ও প্রোফাইল</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">প্রতিষ্ঠানের নাম</label>
                     <input value={settings.schoolName} onChange={e => setSettings({...settings, schoolName: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ট্যাগলাইন</label>
                     <input value={settings.tagline} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ফোন নম্বর</label>
                     <input value={settings.phone1} onChange={e => setSettings({...settings, phone1: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ইমেইল</label>
                     <input value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">ঠিকানা</label>
                     <input value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                  </div>
               </div>
               <div className="pt-6 border-t">
                  <p className="text-xs font-bold text-gray-400 mb-4">পরিবর্তনগুলো সেভ করতে নিচের "সার্ভার সিঙ্ক" ট্যাবে যান অথবা ডাটাবেজ আপডেট নিশ্চিত করুন।</p>
               </div>
            </div>
          )}

          {/* List Views (Generic) */}
          {['admissions', 'students', 'staff', 'notices', 'courses', 'gallery'].includes(activeTab) && (
            <div className="space-y-3 animate-fade-in">
              {(activeTab === 'admissions' ? admissions :
                activeTab === 'students' ? students :
                activeTab === 'staff' ? staff :
                activeTab === 'notices' ? notices :
                activeTab === 'courses' ? courses : gallery).map((item: any) => (
                  <div key={item.id} className="bg-white p-5 rounded-[32px] shadow-sm border border-gray-50 flex justify-between items-center hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-emerald-600 overflow-hidden shadow-inner">
                         {(item.photo || item.studentPhoto || item.url) ? 
                           <img src={item.photo || item.studentPhoto || item.url} className="w-full h-full object-cover" /> : 
                           <i className="fas fa-file-alt"></i>}
                       </div>
                       <div>
                         <h4 className="font-black text-gray-800 text-sm">{item.name || item.title}</h4>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                           {activeTab === 'students' ? `ID: ${item.id} | Class: ${item.class}` : 
                            activeTab === 'notices' ? `${item.date} | ${item.type}` : 
                            activeTab === 'admissions' ? `শ্রেণি: ${item.targetClass} | তারিখ: ${item.appliedDate}` :
                            item.designation || item.category || 'অ্যাকাডেমিক কন্টেন্ট'}
                         </p>
                       </div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => openForm('EDIT', item)} className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center text-xs"><i className="fas fa-edit"></i></button>
                       <button onClick={() => deleteItem(item.id, 
                         activeTab === 'admissions' ? admissions :
                         activeTab === 'students' ? students :
                         activeTab === 'staff' ? staff :
                         activeTab === 'notices' ? notices :
                         activeTab === 'courses' ? courses : gallery,
                         activeTab === 'admissions' ? setAdmissions :
                         activeTab === 'students' ? setStudents :
                         activeTab === 'staff' ? setStaff :
                         activeTab === 'notices' ? setNotices :
                         activeTab === 'courses' ? setCourses : setGallery
                       )} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-xs"><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
              ))}
              {(activeTab === 'admissions' ? admissions :
                activeTab === 'students' ? students :
                activeTab === 'staff' ? staff :
                activeTab === 'notices' ? notices :
                activeTab === 'courses' ? courses : gallery).length === 0 && (
                <div className="text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-gray-100 text-gray-300 italic">কোনো তথ্য নেই।</div>
              )}
            </div>
          )}

          {/* Result Manager */}
          {activeTab === 'results_manager' && (
            <div className="bg-white p-10 rounded-[48px] shadow-sm border border-emerald-50 animate-fade-in space-y-8">
               <h3 className="text-2xl font-black text-gray-800">📝 ফলাফল এন্ট্রি পোর্টাল</h3>
               {!selectedStudentForResult ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {students.map(s => (
                      <button key={s.id} onClick={() => setSelectedStudentForResult(s)} className="p-5 text-left bg-gray-50 hover:bg-emerald-50 rounded-3xl border border-gray-100 flex items-center gap-4 transition group">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white">{s.id.slice(-2)}</div>
                        <div><h4 className="font-black text-gray-800 text-sm">{s.name}</h4><p className="text-[10px] text-gray-400 font-bold">আইডি: {s.id} | শ্রেণি: {s.class}</p></div>
                      </button>
                    ))}
                    {students.length === 0 && <p className="col-span-2 text-center text-gray-400 italic">শিক্ষার্থী তালিকা ফাঁকা।</p>}
                 </div>
               ) : (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center bg-emerald-50 p-6 rounded-[32px] border border-emerald-100">
                       <div className="flex items-center gap-4">
                         <img src={selectedStudentForResult.studentPhoto || "https://picsum.photos/100/100"} className="w-12 h-12 rounded-xl object-cover" />
                         <div><h4 className="font-black text-emerald-900">{selectedStudentForResult.name}</h4><p className="text-xs font-bold text-emerald-600">আইডি: {selectedStudentForResult.id}</p></div>
                       </div>
                       <button onClick={() => setSelectedStudentForResult(null)} className="text-xs font-black text-emerald-600 bg-white px-5 py-2.5 rounded-xl hover:shadow-lg transition">শিক্ষার্থী পরিবর্তন করুন</button>
                    </div>
                    
                    <div className="p-8 border-2 border-dashed border-emerald-100 rounded-[40px] bg-white">
                       <h5 className="font-black text-gray-800 mb-6">নতুন ফলাফল যোগ করুন</h5>
                       <form onSubmit={(e) => {
                         e.preventDefault();
                         const fd = new FormData(e.currentTarget);
                         const gpaVal = parseFloat(fd.get('gpa') as string);
                         const gradeVal = fd.get('grade') as string;
                         const term: TermResult = {
                           id: 'RES-' + Date.now(),
                           termTitle: fd.get('title') as string,
                           date: new Date().toLocaleDateString('bn-BD'),
                           totalGPA: gpaVal,
                           finalGrade: gradeVal,
                           isPassed: gradeVal !== 'F' && gpaVal > 0,
                           subjects: [] // Placeholder
                         };
                         setStudents(students.map(s => s.id === selectedStudentForResult.id ? { ...s, academicResults: [term, ...(s.academicResults || [])] } : s));
                         alert('ফলাফল যোগ হয়েছে!'); e.currentTarget.reset();
                       }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input name="title" placeholder="পরীক্ষার নাম (উদা: বার্ষিক ২০২৪)" className="p-4 rounded-2xl bg-gray-50 border outline-none text-sm" required />
                          <input name="gpa" placeholder="GPA (যেমন: 5.00)" className="p-4 rounded-2xl bg-gray-50 border outline-none text-sm" required />
                          <input name="grade" placeholder="গ্রেড (যেমন: A+)" className="p-4 rounded-2xl bg-gray-50 border outline-none text-sm" required />
                          <button type="submit" className="md:col-span-3 bg-emerald-600 text-white p-4 rounded-2xl font-black shadow-lg">সংরক্ষণ করুন</button>
                       </form>
                    </div>

                    <div className="space-y-3">
                       <h5 className="font-black text-gray-400 uppercase text-[10px] tracking-widest px-2">বিদ্যমান ফলাফলসমূহ</h5>
                       {(selectedStudentForResult.academicResults || []).map(res => (
                         <div key={res.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-3xl border border-gray-100">
                           <div><h6 className="font-black text-gray-800 text-sm">{res.termTitle}</h6><p className="text-[10px] font-bold text-emerald-600">জিপিএ: {res.totalGPA.toFixed(2)} | গ্রেড: {res.finalGrade}</p></div>
                           <button onClick={() => {
                             if(confirm('ফলাফলটি ডিলিট করতে চান?')) {
                               setStudents(students.map(s => s.id === selectedStudentForResult.id ? { ...s, academicResults: s.academicResults?.filter(r => r.id !== res.id) } : s));
                               setSelectedStudentForResult(null);
                             }
                           }} className="text-red-500 hover:text-red-700 p-2"><i className="fas fa-trash"></i></button>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* Cloud Sync Tab */}
          {activeTab === 'database' && (
            <div className="bg-white p-12 rounded-[48px] shadow-sm text-center animate-fade-in border border-emerald-50">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-4xl shadow-xl"><i className="fas fa-cloud-upload-alt"></i></div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-gray-800">লাইভ সার্ভার সিঙ্ক</h3>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto leading-relaxed text-sm font-medium">ড্যাশবোর্ডে করা সকল পরিবর্তন স্থায়ীভাবে ডাটাবেজে জমা করার জন্য নিচের বাটনে ক্লিক করুন।</p>
              {lastSync && <p className="text-xs font-bold text-emerald-600 mb-10 italic">সর্বশেষ আপডেট: {lastSync}</p>}
              <button onClick={saveToCloud} disabled={isSyncing} className={`w-full max-w-sm ${isSyncing ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'} text-white p-6 rounded-[32px] font-black shadow-2xl transition transform active:scale-95`}>
                {isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সার্ভারে সেভ করুন ➔'}
              </button>
            </div>
          )}

          {/* Overview Overview */}
          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
               <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-emerald-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">মোট শিক্ষার্থী</p>
                 <h4 className="text-5xl font-black text-gray-800">{students.length}</h4>
               </div>
               <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-blue-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">নতুন আবেদন</p>
                 <h4 className="text-5xl font-black text-blue-600">{admissions.length}</h4>
               </div>
               <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-8 border-amber-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">শিক্ষক ও স্টাফ</p>
                 <h4 className="text-5xl font-black text-amber-600">{staff.length}</h4>
               </div>
             </div>
          )}

        </div>
      </div>

      {/* Global Entry Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tighter">
                {editMode === 'EDIT' ? 'তথ্য সংশোধন' : 'নতুন সংযোজন'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl transition-colors">✕</button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {activeTab === 'students' && (
                <>
                  <input name="id" defaultValue={editingItem?.id} placeholder="শিক্ষার্থী আইডি (Unique)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required disabled={editMode === 'EDIT'} />
                  <input name="name" defaultValue={editingItem?.name} placeholder="পূর্ণ নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <div className="grid grid-cols-2 gap-4">
                     <input name="class" defaultValue={editingItem?.class} placeholder="শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                     <input name="roll" defaultValue={editingItem?.roll} placeholder="রোল" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  </div>
                  <input name="guardianPhone" defaultValue={editingItem?.guardianPhone} placeholder="অভিভাবকের মোবাইল নম্বর" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <input name="studentPhoto" defaultValue={editingItem?.studentPhoto} placeholder="ফটো ইউআরএল" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none text-xs" />
                </>
              )}

              {activeTab === 'staff' && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <input name="designation" defaultValue={editingItem?.designation} placeholder="পদবী (উদা: সহকারী শিক্ষক)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <select name="type" defaultValue={editingItem?.type || 'TEACHER'} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold">
                     <option value="TEACHER">শিক্ষক</option>
                     <option value="STAFF">সহায়ক কর্মী / স্টাফ</option>
                  </select>
                  <input name="subject" defaultValue={editingItem?.subject} placeholder="বিষয় (উদা: গণিত)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" />
                  <input name="mobile" defaultValue={editingItem?.mobile} placeholder="মোবাইল নম্বর" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <input name="photo" defaultValue={editingItem?.photo} placeholder="ফটো ইউআরএল" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none text-xs" />
                </>
              )}

              {activeTab === 'notices' && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="নোটিশের শিরোনাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="date" defaultValue={editingItem?.date || new Date().toLocaleDateString('bn-BD')} placeholder="তারিখ" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                    <input name="type" defaultValue={editingItem?.type || 'সাধারণ'} placeholder="ধরন (উদা: জরুরি / ভর্তি)" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  </div>
                  <textarea name="content" defaultValue={editingItem?.content} placeholder="বিস্তারিত তথ্য..." className="w-full p-4 rounded-2xl bg-gray-50 border outline-none h-32 font-medium" />
                </>
              )}

              {activeTab === 'courses' && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="কোর্স বা শাখার নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <input name="category" defaultValue={editingItem?.category} placeholder="শ্রেণি সীমা (উদা: ৬ষ্ঠ - ১০ম)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <textarea name="description" defaultValue={editingItem?.description} placeholder="বর্ণনা..." className="w-full p-4 rounded-2xl bg-gray-50 border outline-none h-24 font-medium" />
                  <input name="icon" defaultValue={editingItem?.icon} placeholder="আইকন ইমোজি (উদা: 📖)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none" />
                </>
              )}

              {activeTab === 'gallery' && (
                <>
                  <input name="title" defaultValue={editingItem?.title} placeholder="ছবির শিরোনাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <input name="url" defaultValue={editingItem?.url} placeholder="ইমেজ ডাইরেক্ট লিঙ্ক (URL)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none text-xs" required />
                </>
              )}

              {activeTab === 'admissions' && (
                <>
                  <input name="name" defaultValue={editingItem?.name} placeholder="আবেদনকারীর নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <div className="grid grid-cols-2 gap-4">
                     <input name="targetClass" defaultValue={editingItem?.targetClass} placeholder="ভর্তির শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                     <input name="phone" defaultValue={editingItem?.phone} placeholder="মোবাইল নম্বর" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  </div>
                  <textarea name="address" defaultValue={editingItem?.address} placeholder="ঠিকানা" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none h-24" />
                  <select name="status" defaultValue={editingItem?.status || 'PENDING'} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold">
                     <option value="PENDING">PENDING</option>
                     <option value="APPROVED">APPROVED</option>
                     <option value="REJECTED">REJECTED</option>
                  </select>
                </>
              )}

              <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-3xl font-black shadow-xl mt-6 uppercase tracking-widest hover:bg-emerald-700 transition transform active:scale-95">সংরক্ষণ করুন</button>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
