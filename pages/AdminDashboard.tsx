
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
  const [quizzes, setQuizzes] = useState<any[]>(() => JSON.parse(localStorage.getItem('sia_quizzes') || '[]'));
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

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
    localStorage.setItem('sia_staff', JSON.stringify(staff));
    localStorage.setItem('sia_notices', JSON.stringify(notices));
    localStorage.setItem('sia_admissions', JSON.stringify(admissions));
    localStorage.setItem('sia_courses', JSON.stringify(courses));
    localStorage.setItem('sia_gallery', JSON.stringify(gallery));
    localStorage.setItem('sia_quizzes', JSON.stringify(quizzes));
    localStorage.setItem('sia_site_settings', JSON.stringify(settings));
  }, [students, staff, notices, admissions, courses, gallery, quizzes, settings]);

  const saveToCloud = async () => {
    setIsSyncing(true);
    const db = { students, notices, staff, gallery, courses, settings, admissions, quizzes };
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

    let updatedItem = { ...editingItem, ...data, id };
    
    // File processing for Admissions and Staff if applicable
    if (activeTab === 'admissions' || activeTab === 'staff' || activeTab === 'students') {
      const fileInputs = (e.currentTarget as HTMLFormElement).querySelectorAll('input[type="file"]');
      for (const input of Array.from(fileInputs) as HTMLInputElement[]) {
        if (input.files?.[0]) {
          const base64 = await toBase64(input.files[0]);
          updatedItem[input.name] = base64;
        }
      }
    }

    // Quiz Specific Logic: Parse JSON Questions
    if (activeTab === 'quizzes') {
      try {
        const questionsJson = fd.get('questionsJson') as string;
        updatedItem.questions = JSON.parse(questionsJson);
        delete updatedItem.questionsJson; // Remove temp field
      } catch (err) {
        alert('কুইজের প্রশ্নগুলোর ফরম্যাট সঠিক নয়। দয়া করে JSON ফরম্যাট চেক করুন।');
        return;
      }
    }

    switch(activeTab) {
      case 'admissions': setAdmissions(editMode === 'EDIT' ? admissions.map(a => a.id === id ? updatedItem as any : a) : [updatedItem as any, ...admissions]); break;
      case 'students': setStudents(editMode === 'EDIT' ? students.map(s => s.id === id ? updatedItem as any : s) : [...students, updatedItem as any]); break;
      case 'staff': setStaff(editMode === 'EDIT' ? staff.map(s => s.id === id ? updatedItem as any : s) : [...staff, updatedItem as any]); break;
      case 'notices': setNotices(editMode === 'EDIT' ? notices.map(n => n.id === id ? updatedItem as any : n) : [updatedItem as any, ...notices]); break;
      case 'courses': setCourses(editMode === 'EDIT' ? courses.map(c => c.id === id ? updatedItem as any : c) : [...courses, updatedItem as any]); break;
      case 'gallery': setGallery(editMode === 'EDIT' ? gallery.map(g => g.id === id ? updatedItem as any : g) : [...gallery, updatedItem as any]); break;
      case 'quizzes': setQuizzes(editMode === 'EDIT' ? quizzes.map(q => q.id === id ? updatedItem as any : q) : [...quizzes, updatedItem as any]); break;
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
    { id: 'quizzes', label: 'অনলাইন কুইজ', icon: '🧠' },
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

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Section Header */}
          {['admissions', 'students', 'staff', 'notices', 'courses', 'gallery', 'quizzes'].includes(activeTab) && (
            <div className="bg-white p-6 rounded-[32px] shadow-sm flex justify-between items-center border border-emerald-50 mb-6">
               <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                 {menuItems.find(m => m.id === activeTab)?.icon} {menuItems.find(m => m.id === activeTab)?.label}
               </h2>
               <button onClick={() => openForm('ADD')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-2xl font-black shadow-lg hover:bg-emerald-700 transition text-sm">নতুন যোগ করুন +</button>
            </div>
          )}

          {/* List Views */}
          {['admissions', 'students', 'staff', 'notices', 'courses', 'gallery', 'quizzes'].includes(activeTab) && (
             <div className="space-y-3 animate-fade-in">
                {(activeTab === 'admissions' ? admissions :
                  activeTab === 'students' ? students :
                  activeTab === 'staff' ? staff :
                  activeTab === 'notices' ? notices :
                  activeTab === 'courses' ? courses :
                  activeTab === 'gallery' ? gallery : quizzes).map((item: any) => (
                    <div key={item.id} className="bg-white p-4 rounded-[32px] shadow-sm border border-gray-50 flex justify-between items-center group hover:border-emerald-200 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-black text-emerald-600 overflow-hidden shadow-inner">
                           {(item.studentPhoto || item.photo || item.url) ? 
                             <img src={item.studentPhoto || item.photo || item.url} className="w-full h-full object-cover" /> : 
                             <i className={`fas ${activeTab === 'quizzes' ? 'fa-brain' : 'fa-file-alt'}`}></i>}
                         </div>
                         <div>
                           <h4 className="font-black text-gray-800 text-sm">{item.name || item.title}</h4>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                             {activeTab === 'quizzes' ? `শ্রেণি: ${item.class} | বিষয়: ${item.subject}` :
                              activeTab === 'admissions' ? `শ্রেণি: ${item.targetClass} | তারিখ: ${item.appliedDate}` : 
                              activeTab === 'students' ? `আইডি: ${item.id} | রোল: ${item.roll}` : item.designation || 'আইটেম'}
                           </p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => openForm('EDIT', item)} className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition flex items-center justify-center text-xs"><i className="fas fa-edit"></i></button>
                         <button onClick={() => deleteItem(item.id, (activeTab === 'quizzes' ? quizzes : activeTab === 'admissions' ? admissions : activeTab === 'students' ? students : activeTab === 'staff' ? staff : activeTab === 'notices' ? notices : activeTab === 'courses' ? courses : gallery), (activeTab === 'quizzes' ? setQuizzes : activeTab === 'admissions' ? setAdmissions : activeTab === 'students' ? setStudents : activeTab === 'staff' ? setStaff : activeTab === 'notices' ? setNotices : activeTab === 'courses' ? setCourses : setGallery))} className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition flex items-center justify-center text-xs"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                ))}
             </div>
          )}

          {/* Homepage Content Control */}
          {activeTab === 'home_content' && (
            <div className="space-y-8 animate-fade-in">
              {/* Slider Controller */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
                <h3 className="text-xl font-black text-emerald-800 mb-6 flex items-center gap-2"><i className="fas fa-images"></i> স্লাইডার কন্ট্রোল</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-3xl mb-8">
                  <input id="slideUrl" placeholder="ইমেজ URL (যেমন: https://...)" className="p-4 rounded-xl border bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                  <input id="slideTitle" placeholder="ছবির টাইটেল" className="p-4 rounded-xl border bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button onClick={() => {
                    const url = (document.getElementById('slideUrl') as HTMLInputElement).value;
                    const title = (document.getElementById('slideTitle') as HTMLInputElement).value;
                    if(url) {
                      setSettings({...settings, sliderImages: [...settings.sliderImages, {id: Date.now().toString(), url, title}]});
                      (document.getElementById('slideUrl') as HTMLInputElement).value = '';
                      (document.getElementById('slideTitle') as HTMLInputElement).value = '';
                    }
                  }} className="md:col-span-2 bg-emerald-600 text-white p-4 rounded-xl font-black shadow-lg hover:bg-emerald-700 transition">স্লাইডারে যুক্ত করুন</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {settings.sliderImages.map(img => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden border-2 border-emerald-50 aspect-video shadow-sm">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => setSettings({...settings, sliderImages: settings.sliderImages.filter(s => s.id !== img.id)})} className="bg-red-500 text-white p-2 rounded-xl"><i className="fas fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notice Controller */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
                <h3 className="text-xl font-black text-emerald-800 mb-4 flex items-center gap-2"><i className="fas fa-bullhorn"></i> স্ক্রলিং নোটিশ</h3>
                <textarea value={settings.scrollingHeadline} onChange={e => setSettings({...settings, scrollingHeadline: e.target.value})} className="w-full p-6 rounded-[32px] bg-gray-50 border border-transparent outline-none font-bold text-gray-700 h-28 focus:bg-white focus:border-emerald-200" />
              </div>

              {/* Messages Controller */}
              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-emerald-50">
                <h3 className="text-xl font-black text-emerald-800 mb-8 flex items-center gap-2"><i className="fas fa-pen-nib"></i> বাণী ও ছবি আপডেট</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-amber-50/50 p-8 rounded-[40px] border border-amber-100 space-y-4">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">সম্মানিত চেয়ারম্যান</span>
                    <input value={settings.chairmanName} onChange={e => setSettings({...settings, chairmanName: e.target.value})} className="w-full p-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="নাম" />
                    <input value={settings.chairmanPhoto} onChange={e => setSettings({...settings, chairmanPhoto: e.target.value})} className="w-full p-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-amber-500" placeholder="ফটো URL" />
                    <textarea value={settings.chairmanMsg} onChange={e => setSettings({...settings, chairmanMsg: e.target.value})} className="w-full p-4 rounded-2xl border bg-white outline-none h-32 focus:ring-2 focus:ring-amber-500" placeholder="বাণী" />
                  </div>
                  <div className="bg-emerald-50/50 p-8 rounded-[40px] border border-emerald-100 space-y-4">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">প্রধান শিক্ষক</span>
                    <input value={settings.principalName} onChange={e => setSettings({...settings, principalName: e.target.value})} className="w-full p-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="নাম" />
                    <input value={settings.principalPhoto} onChange={e => setSettings({...settings, principalPhoto: e.target.value})} className="w-full p-4 rounded-2xl border bg-white outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ফটো URL" />
                    <textarea value={settings.principalMsg} onChange={e => setSettings({...settings, principalMsg: e.target.value})} className="w-full p-4 rounded-2xl border bg-white outline-none h-32 focus:ring-2 focus:ring-emerald-500" placeholder="বাণী" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
               <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-8 border-emerald-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">মোট শিক্ষার্থী</p>
                 <h4 className="text-5xl font-black text-gray-800">{students.length}</h4>
               </div>
               <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-8 border-blue-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">ভর্তি আবেদন</p>
                 <h4 className="text-5xl font-black text-blue-600">{admissions.length}</h4>
               </div>
               <div className="bg-white p-10 rounded-[40px] shadow-sm border-b-8 border-amber-500 text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">কুইজ সংখ্যা</p>
                 <h4 className="text-5xl font-black text-amber-600">{quizzes.length}</h4>
               </div>
             </div>
          )}

          {activeTab === 'database' && (
            <div className="bg-white p-12 rounded-[48px] shadow-sm text-center border border-emerald-50 animate-fade-in">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner"><i className="fas fa-cloud-upload-alt"></i></div>
              <h3 className="text-2xl font-black mb-4 uppercase text-gray-800 tracking-tighter">সার্ভার ডাটাবেজ আপডেট</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto text-sm leading-relaxed">ড্যাশবোর্ডের সকল পরিবর্তন স্থায়ীভাবে অনলাইনে সেভ করতে নিচের বাটনে ক্লিক করুন।</p>
              {lastSync && <p className="text-xs font-bold text-emerald-500 mb-6 italic">সর্বশেষ সিঙ্ক: {lastSync}</p>}
              <button onClick={saveToCloud} disabled={isSyncing} className={`w-full max-w-xs ${isSyncing ? 'bg-gray-300' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl'} text-white p-5 rounded-[32px] font-black transition-all transform active:scale-95`}>
                {isSyncing ? 'প্রসেসিং হচ্ছে...' : 'সার্ভারে সেভ করুন ➔'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden animate-fade-in border border-emerald-50">
            <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-emerald-900 uppercase tracking-tighter">
                {activeTab === 'quizzes' ? 'কুইজ ম্যানেজমেন্ট' : (editMode === 'EDIT' ? 'তথ্য সংশোধন' : 'নতুন আইটেম')}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl transition-colors">✕</button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {activeTab === 'quizzes' && (
                <div className="space-y-6">
                  <input name="title" defaultValue={editingItem?.title} placeholder="কুইজের শিরোনাম (উদা: ইসলামের ইতিহাস)" className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold focus:bg-white focus:border-emerald-200" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="subject" defaultValue={editingItem?.subject} placeholder="বিষয়" className="p-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold focus:bg-white focus:border-emerald-200" required />
                    <input name="class" defaultValue={editingItem?.class} placeholder="শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold focus:bg-white focus:border-emerald-200" required />
                  </div>
                  <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-4 tracking-widest">প্রশ্নমালা (JSON Format)</p>
                    <textarea 
                      name="questionsJson" 
                      defaultValue={editingItem?.questions ? JSON.stringify(editingItem.questions, null, 2) : '[\n  {\n    "question": "বাংলাদেশের রাজধানী কি?",\n    "options": ["ঢাকা", "খুলনা", "রাজশাহী", "সিলেট"],\n    "correctIndex": 0\n  }\n]'} 
                      className="w-full h-64 p-5 rounded-2xl bg-white border border-emerald-100 font-mono text-xs outline-none focus:ring-4 focus:ring-emerald-100"
                      required
                    />
                    <div className="mt-4 p-4 bg-white/50 rounded-xl border border-dashed border-emerald-200">
                       <p className="text-[10px] text-emerald-800 leading-relaxed italic">
                         * প্রশ্নগুলো সঠিক JSON ফরম্যাটে দিন। প্রতিটি অবজেক্টে `question`, `options` (অ্যারে) এবং `correctIndex` থাকতে হবে।
                       </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'admissions' && (
                <div className="space-y-6">
                   <input name="name" defaultValue={editingItem?.name} placeholder="আবেদনকারীর নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                   <div className="grid grid-cols-2 gap-4">
                      <input name="targetClass" defaultValue={editingItem?.targetClass} placeholder="ভর্তির শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                      <input name="phone" defaultValue={editingItem?.phone} placeholder="মোবাইল নম্বর" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                   </div>
                   <div className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">শিক্ষার্থীর ছবি</label>
                        <input type="file" name="studentPhoto" accept="image/*" className="w-full text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">জন্ম সনদ</label>
                        <input type="file" name="birthCertificate" accept="image/*" className="w-full text-xs" />
                      </div>
                   </div>
                   <select name="status" defaultValue={editingItem?.status || 'PENDING'} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold">
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                   </select>
                </div>
              )}

              {activeTab === 'students' && (
                <div className="space-y-6">
                  <input name="id" defaultValue={editingItem?.id} placeholder="স্টুডেন্ট আইডি (Unique)" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required disabled={editMode === 'EDIT'} />
                  <input name="name" defaultValue={editingItem?.name} placeholder="শিক্ষার্থীর পূর্ণ নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  <div className="grid grid-cols-2 gap-4">
                    <input name="class" defaultValue={editingItem?.class} placeholder="শ্রেণি" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                    <input name="roll" defaultValue={editingItem?.roll} placeholder="রোল" className="p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                  </div>
                  <input name="guardianPhone" defaultValue={editingItem?.guardianPhone} placeholder="অভিভাবকের মোবাইল" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" />
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-2">শিক্ষার্থীর ছবি</label>
                    <input type="file" name="studentPhoto" accept="image/*" className="w-full text-xs" />
                  </div>
                </div>
              )}

              {['notices', 'gallery', 'staff', 'courses'].includes(activeTab) && (
                <div className="space-y-4">
                  <input name="title" defaultValue={editingItem?.title || editingItem?.name} placeholder="টাইটেল / নাম" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold focus:bg-white" required />
                  {activeTab === 'gallery' && <input name="url" defaultValue={editingItem?.url} placeholder="ইমেজ URL" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold focus:bg-white" required />}
                  {activeTab === 'staff' && (
                    <>
                      <input name="designation" defaultValue={editingItem?.designation} placeholder="পদবী" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                      <select name="type" defaultValue={editingItem?.type || 'TEACHER'} className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold">
                        <option value="TEACHER">শিক্ষক</option>
                        <option value="STAFF">সহায়ক কর্মী</option>
                      </select>
                      <input name="mobile" defaultValue={editingItem?.mobile} placeholder="মোবাইল নম্বর" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none font-bold" required />
                    </>
                  )}
                  {activeTab === 'courses' && <textarea name="description" defaultValue={editingItem?.description} placeholder="বর্ণনা" className="w-full p-4 rounded-2xl bg-gray-50 border outline-none h-32 font-bold focus:bg-white" />}
                </div>
              )}
              
              <button type="submit" className="w-full bg-emerald-600 text-white p-5 rounded-[32px] font-black shadow-xl mt-6 transform transition active:scale-95 text-lg">সংরক্ষণ করুন</button>
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
