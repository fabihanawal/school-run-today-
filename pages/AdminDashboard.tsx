import React, { useState, useEffect } from 'react';
import {
  StaffProfile,
  Notice,
  GalleryImage,
  SiteSettings,
  Course,
  Student,
  AdmissionSubmission,
  Quiz,
  ContactMessage,
  SchoolStat,
  FeatureItem,
  SliderImage
} from '../types';
import {
  useSchoolSettings,
  useCollection,
  KEYS,
  notifyDataUpdated
} from '../src/lib/storage';
import {
  DEFAULT_SETTINGS,
  DEFAULT_COURSES,
  DEFAULT_STAFF,
  DEFAULT_NOTICES,
  DEFAULT_GALLERY,
  DEFAULT_STUDENTS,
  DEFAULT_QUIZZES
} from '../src/data/initialData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<string | null>(() => localStorage.getItem('sia_last_sync'));

  // Reactive State Collections
  const [settings, setSettings] = useSchoolSettings();
  const [students, setStudents] = useCollection<Student>(KEYS.STUDENTS, []);
  const [staff, setStaff] = useCollection<StaffProfile>(KEYS.STAFF, []);
  const [notices, setNotices] = useCollection<Notice>(KEYS.NOTICES, []);
  const [admissions, setAdmissions] = useCollection<AdmissionSubmission>(KEYS.ADMISSIONS, []);
  const [courses, setCourses] = useCollection<Course>(KEYS.COURSES, []);
  const [gallery, setGallery] = useCollection<GalleryImage>(KEYS.GALLERY, []);
  const [quizzes, setQuizzes] = useCollection<Quiz>(KEYS.QUIZZES, []);
  const [messages, setMessages] = useCollection<ContactMessage>(KEYS.MESSAGES, []);

  // Form Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);

  // Local state for complex sub-forms
  const [tempQuizQuestions, setTempQuizQuestions] = useState<any[]>([]);
  const [selectedStudentForMarks, setSelectedStudentForMarks] = useState<string>('');
  const [termTitle, setTermTitle] = useState('বার্ষিক পরীক্ষা ২০২৪');
  const [subjectMarksInput, setSubjectMarksInput] = useState([
    { subject: 'বাংলা ১ম ও ২য়', mark: 80 },
    { subject: 'ইংরেজি ১ম ও ২য়', mark: 75 },
    { subject: 'গণিত', mark: 85 },
    { subject: 'ইসলাম ও নৈতিক শিক্ষা', mark: 90 },
    { subject: 'সাধারণ বিজ্ঞান', mark: 80 }
  ]);

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleCloudSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);
    const db = {
      settings,
      students,
      staff,
      notices,
      admissions,
      courses,
      gallery,
      quizzes,
      messages
    };
    try {
      const res = await fetch('api.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      if (res.ok) {
        const now = new Date().toLocaleString('bn-BD');
        setLastSync(now);
        localStorage.setItem('sia_last_sync', now);
        setSyncStatus('সফলভাবে সার্ভারে ব্যাকআপ সংরক্ষিত হয়েছে!');
      } else {
        setSyncStatus('সার্ভার রেসপন্স দেয়নি, তবে ব্রাউজার ক্যাশে ডাটা সংরক্ষিত আছে।');
      }
    } catch {
      setSyncStatus('লোকাল মোডে সংরক্ষিত হয়েছে (সার্ভার সংযোগ পাওয়া যায়নি)।');
    } finally {
      setIsSyncing(false);
    }
  };

  const exportBackupJSON = () => {
    const backupData = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      settings,
      students,
      staff,
      notices,
      admissions,
      courses,
      gallery,
      quizzes,
      messages
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SIA_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackupJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings) setSettings(data.settings);
        if (data.students) setStudents(data.students);
        if (data.staff) setStaff(data.staff);
        if (data.notices) setNotices(data.notices);
        if (data.admissions) setAdmissions(data.admissions);
        if (data.courses) setCourses(data.courses);
        if (data.gallery) setGallery(data.gallery);
        if (data.quizzes) setQuizzes(data.quizzes);
        if (data.messages) setMessages(data.messages);
        setSyncStatus('ব্যাকআপ ফাইল থেকে সফলভাবে তথ্য রিস্টোর করা হয়েছে!');
      } catch {
        setSyncStatus('ভুল বা নষ্ট ব্যাকআপ ফাইল!');
      }
    };
    reader.readAsText(file);
  };

  const resetToFactoryDefaults = () => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিত যে সমস্ত তথ্য প্রাথমিক ডেমো তথ্যে রূপান্তর করতে চান?')) {
      setSettings(DEFAULT_SETTINGS);
      setCourses(DEFAULT_COURSES);
      setStaff(DEFAULT_STAFF);
      setNotices(DEFAULT_NOTICES);
      setGallery(DEFAULT_GALLERY);
      setStudents(DEFAULT_STUDENTS);
      setQuizzes(DEFAULT_QUIZZES);
      setAdmissions([]);
      setMessages([]);
      notifyDataUpdated();
      setSyncStatus('সকল তথ্য সফলভাবে ফ্যাক্টরি ডিফল্টে রিসেট করা হয়েছে!');
    }
  };

  // Grade calculator helper
  const calculateGradePoint = (mark: number) => {
    if (mark >= 80) return { grade: 'A+', point: 5.0 };
    if (mark >= 70) return { grade: 'A', point: 4.0 };
    if (mark >= 60) return { grade: 'A-', point: 3.5 };
    if (mark >= 50) return { grade: 'B', point: 3.0 };
    if (mark >= 40) return { grade: 'C', point: 2.0 };
    if (mark >= 33) return { grade: 'D', point: 1.0 };
    return { grade: 'F', point: 0.0 };
  };

  const handleSaveResultForStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForMarks) return;

    const subjectsWithGrades = subjectMarksInput.map((sm) => {
      const { grade, point } = calculateGradePoint(Number(sm.mark));
      return {
        subject: sm.subject,
        mark: Number(sm.mark),
        grade,
        point
      };
    });

    const hasFailed = subjectsWithGrades.some((s) => s.grade === 'F');
    const totalPoints = subjectsWithGrades.reduce((acc, curr) => acc + curr.point, 0);
    const totalGPA = hasFailed ? 0 : Number((totalPoints / subjectsWithGrades.length).toFixed(2));
    let finalGrade = 'F';
    if (!hasFailed) {
      if (totalGPA >= 5.0) finalGrade = 'A+';
      else if (totalGPA >= 4.0) finalGrade = 'A';
      else if (totalGPA >= 3.5) finalGrade = 'A-';
      else if (totalGPA >= 3.0) finalGrade = 'B';
      else if (totalGPA >= 2.0) finalGrade = 'C';
      else finalGrade = 'D';
    }

    const newResult = {
      id: 'term-' + Date.now(),
      termTitle,
      date: new Date().toLocaleDateString('bn-BD'),
      subjects: subjectsWithGrades,
      totalGPA,
      finalGrade,
      isPassed: !hasFailed
    };

    const updatedStudents = students.map((s) => {
      if (s.id === selectedStudentForMarks) {
        const existingResults = s.academicResults || [];
        return {
          ...s,
          academicResults: [newResult, ...existingResults]
        };
      }
      return s;
    });

    setStudents(updatedStudents);
    setSyncStatus('শিক্ষার্থীর ফলাফল সফলভাবে যুক্ত হয়েছে!');
    setSelectedStudentForMarks('');
  };

  const navMenuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: 'fas fa-chart-pie' },
    { id: 'school_profile', label: 'বিদ্যালয় প্রোফাইল ও ব্র্যান্ডিং', icon: 'fas fa-school' },
    { id: 'home_slider', label: 'হিরো স্লাইডার ও ব্যানার', icon: 'fas fa-images' },
    { id: 'home_features', label: 'হোমপেজ ফিচার কার্ড', icon: 'fas fa-th-large' },
    { id: 'leadership', label: 'চেয়ারম্যান ও প্রধান শিক্ষকের বাণী', icon: 'fas fa-user-tie' },
    { id: 'about_settings', label: 'পরিচিতি ও ইতিহাস', icon: 'fas fa-landmark' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: 'fas fa-bullhorn', badge: notices.length },
    { id: 'courses', label: 'একাডেমিক শাখা ও কোর্স', icon: 'fas fa-book-open', badge: courses.length },
    { id: 'staff', label: 'শিক্ষক ও কর্মচারী', icon: 'fas fa-chalkboard-teacher', badge: staff.length },
    { id: 'admissions', label: 'ভর্তি আবেদনসমূহ', icon: 'fas fa-file-signature', badge: admissions.length },
    { id: 'students', label: 'শিক্ষার্থী ডাটাবেজ', icon: 'fas fa-user-graduate', badge: students.length },
    { id: 'results_manager', label: 'ফলাফল ও মার্কশিট এন্ট্রি', icon: 'fas fa-poll' },
    { id: 'quizzes', label: 'অনলাইন পরীক্ষা ও কুইজ', icon: 'fas fa-laptop-code', badge: quizzes.length },
    { id: 'gallery', label: 'ফটো গ্যালারি', icon: 'fas fa-camera-retro', badge: gallery.length },
    { id: 'contact_messages', label: 'ইনবক্স বার্তা', icon: 'fas fa-envelope', badge: messages.length },
    { id: 'backup_sync', label: 'ব্যাকআপ ও সার্ভার সিঙ্ক', icon: 'fas fa-cloud-upload-alt' },
  ];

  return (
    <div className="bg-slate-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl text-emerald-300">
              <i className="fas fa-user-shield"></i>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                School Management Center
              </span>
              <h1 className="text-2xl sm:text-3xl font-black">{settings.schoolName}</h1>
              <p className="text-xs text-emerald-200 mt-1">
                EIIN: {settings.eiin} · সেশন: {settings.currentSession} · সর্বমোট শিক্ষার্থী: {students.length} জন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <button
              onClick={handleCloudSync}
              disabled={isSyncing}
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-5 py-2.5 rounded-xl text-xs font-black transition shadow flex items-center gap-2"
            >
              <i className={`fas ${isSyncing ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}></i>
              <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'সার্ভারে সংরক্ষণ'}</span>
            </button>
            <button
              onClick={exportBackupJSON}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <i className="fas fa-download"></i>
              <span>ব্যাকআপ ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* Global Alert Notification */}
        {syncStatus && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <i className="fas fa-check-circle text-emerald-600 text-base"></i>
              <span>{syncStatus}</span>
            </div>
            <button onClick={() => setSyncStatus(null)} className="text-emerald-700 hover:text-emerald-900">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* Main Grid: Sidebar + Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200/80 sticky top-24 space-y-1">
              <div className="px-4 py-2 mb-2 border-b border-slate-100">
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  ম্যানেজমেন্ট মেনু
                </span>
              </div>
              <nav className="space-y-1 max-h-[75vh] overflow-y-auto pr-1">
                {navMenuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSyncStatus(null);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between text-xs font-bold transition ${
                      activeTab === item.id
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <i className={`${item.icon} w-4 text-center`}></i>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                          activeTab === item.id
                            ? 'bg-emerald-900 text-emerald-200'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Workspace */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                      <span className="font-bold">মোট শিক্ষার্থী</span>
                      <i className="fas fa-user-graduate text-emerald-600"></i>
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">{students.length} জন</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                      <span className="font-bold">শিক্ষক ও স্টাফ</span>
                      <i className="fas fa-chalkboard-teacher text-blue-600"></i>
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">{staff.length} জন</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                      <span className="font-bold">ভর্তি আবেদন</span>
                      <i className="fas fa-file-signature text-amber-600"></i>
                    </div>
                    <div className="text-2xl font-black text-amber-600 font-mono">{admissions.length} টি</div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                      <span className="font-bold">নতুন বার্তা</span>
                      <i className="fas fa-envelope text-purple-600"></i>
                    </div>
                    <div className="text-2xl font-black text-purple-600 font-mono">{messages.length} টি</div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h3 className="text-base font-black text-slate-900 mb-4 flex items-center gap-2">
                    <i className="fas fa-bolt text-amber-500"></i>
                    <span>কুইক অ্যাকশন</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      onClick={() => setActiveTab('school_profile')}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition group"
                    >
                      <i className="fas fa-edit text-emerald-700 text-lg mb-2 block"></i>
                      <span className="text-xs font-bold text-slate-800 block">বিদ্যালয় তথ্য এডিট</span>
                      <span className="text-[10px] text-slate-400">নাম, ঠিকানা ও যোগাযোগ</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('notices')}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition group"
                    >
                      <i className="fas fa-bullhorn text-amber-600 text-lg mb-2 block"></i>
                      <span className="text-xs font-bold text-slate-800 block">নতুন নোটিশ প্রকাশ</span>
                      <span className="text-[10px] text-slate-400">বিজ্ঞপ্তি ও পরীক্ষার রুটিন</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('admissions')}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition group"
                    >
                      <i className="fas fa-check-circle text-blue-600 text-lg mb-2 block"></i>
                      <span className="text-xs font-bold text-slate-800 block">ভর্তি আবেদন যাচাই</span>
                      <span className="text-[10px] text-slate-400">অনলাইন আবেদন অনুমোদন</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('results_manager')}
                      className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-left transition group"
                    >
                      <i className="fas fa-award text-purple-600 text-lg mb-2 block"></i>
                      <span className="text-xs font-bold text-slate-800 block">গ্রেডশিট তৈরি</span>
                      <span className="text-[10px] text-slate-400">নম্বর এন্ট্রি ও জিপিএ</span>
                    </button>
                  </div>
                </div>

                {/* Recent Admissions table */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-slate-900">সাম্প্রতিক ভর্তি আবেদনসমূহ</h3>
                    <button onClick={() => setActiveTab('admissions')} className="text-xs font-bold text-emerald-700 hover:underline">
                      সকল আবেদন দেখুন ➔
                    </button>
                  </div>
                  {admissions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600 uppercase font-bold">
                            <th className="py-2.5 px-3">ট্র্যাকিং নং</th>
                            <th className="py-2.5 px-3">শিক্ষার্থী</th>
                            <th className="py-2.5 px-3">শ্রেণি</th>
                            <th className="py-2.5 px-3">মোবাইল</th>
                            <th className="py-2.5 px-3">স্ট্যাটাস</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {admissions.slice(0, 4).map((a) => (
                            <tr key={a.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{a.trackingNo || a.id}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-800">{a.name}</td>
                              <td className="py-2.5 px-3">{a.targetClass}</td>
                              <td className="py-2.5 px-3 font-mono">{a.phone}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  a.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 py-6 text-center">এখনো কোনো ভর্তি আবেদন জমা পড়েনি।</p>
                  )}
                </div>
              </div>
            )}

            {/* 2. SCHOOL PROFILE & BRANDING TAB */}
            {activeTab === 'school_profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900">বিদ্যালয় প্রোফাইল ও ব্র্যান্ডিং</h2>
                  <p className="text-xs text-slate-500 mt-1">বিদ্যালয়ের নাম, মোটো, ইআইআইএন, লোগো এবং অফিসিয়াল তথ্য কাস্টমাইজ করুন।</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">বিদ্যালয়ের নাম</label>
                    <input
                      type="text"
                      value={settings.schoolName}
                      onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">ট্যাগলাইন / স্লোগান</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">EIIN নম্বর</label>
                    <input
                      type="text"
                      value={settings.eiin}
                      onChange={(e) => setSettings({ ...settings, eiin: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">প্রতিষ্ঠার সাল</label>
                    <input
                      type="text"
                      value={settings.estYear}
                      onChange={(e) => setSettings({ ...settings, estYear: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">মূলনীতি / Motto</label>
                    <input
                      type="text"
                      value={settings.motto}
                      onChange={(e) => setSettings({ ...settings, motto: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">বর্তমান শিক্ষাবর্ষ / সেশন</label>
                    <input
                      type="text"
                      value={settings.currentSession}
                      onChange={(e) => setSettings({ ...settings, currentSession: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white"
                    />
                  </div>
                </div>

                {/* Admission Status Switcher */}
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-emerald-900">অনলাইন ভর্তি কার্যক্রম স্ট্যাটাস</h4>
                    <p className="text-xs text-emerald-700 mt-0.5">ভর্তি ফরম চালু বা সাময়িকভাবে বন্ধ করতে সুইচ করুন।</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.admissionOpen}
                        onChange={(e) => setSettings({ ...settings, admissionOpen: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      <span className="ms-3 text-xs font-bold text-slate-900">
                        {settings.admissionOpen ? 'ভর্তি চালু আছে' : 'ভর্তি বন্ধ আছে'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Contact & Map Config */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-base font-black text-slate-900 mb-4">যোগাযোগ ও লোকেশন সেটিংস</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">প্রধান মোবাইল / হেল্পলাইন</label>
                      <input
                        type="text"
                        value={settings.phone1}
                        onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">দ্বিতীয় মোবাইল (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={settings.phone2}
                        onChange={(e) => setSettings({ ...settings, phone2: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">অফিসিয়াল ইমেইল</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">অফিস সময়সূচি</label>
                      <input
                        type="text"
                        value={settings.officeHours}
                        onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">ক্যাম্পাসের পূর্ণ ঠিকানা</label>
                      <textarea
                        rows={2}
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">গুগল ম্যাপ Embed URL</label>
                      <input
                        type="text"
                        value={settings.googleMapUrl}
                        onChange={(e) => setSettings({ ...settings, googleMapUrl: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-base font-black text-slate-900 mb-4">সোশ্যাল মিডিয়া ও ওয়াটসঅ্যাপ লিংক</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Facebook Page URL</label>
                      <input
                        type="text"
                        value={settings.facebookUrl}
                        onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">YouTube Channel URL</label>
                      <input
                        type="text"
                        value={settings.youtubeUrl}
                        onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp নম্বর</label>
                      <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setSyncStatus('বিদ্যালয় প্রোফাইল সেটিংস সফলভাবে আপডেট হয়েছে!');
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-2.5 rounded-xl text-xs transition shadow"
                  >
                    সেটিংস সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            )}

            {/* 3. HERO SLIDER & BANNER TAB */}
            {activeTab === 'home_slider' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">হিরো স্লাইডার ও ব্যানার ম্যানেজমেন্ট</h2>
                    <p className="text-xs text-slate-500 mt-1">হোমপেজের স্লাইডার ছবি, শিরোনাম, সাবটাইটেল ও বাটন লিংক কন্ট্রোল করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      const newSlide: SliderImage = {
                        id: Date.now().toString(),
                        url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=900&fit=crop&q=80',
                        title: 'নতুন স্লাইডার শিরোনাম',
                        subtitle: 'আলোকিত মানুষ গড়ার বিশ্বস্ত প্রতিষ্ঠান',
                        buttonText: 'ভর্তি আবেদন',
                        buttonLink: '/admission'
                      };
                      setSettings({ ...settings, sliderImages: [...settings.sliderImages, newSlide] });
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-plus"></i>
                    <span>নতুন স্লাইড যোগ করুন</span>
                  </button>
                </div>

                {/* Scrolling Notice Ticker Setting */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <label className="block text-xs font-black text-amber-900 uppercase">
                    জরুরি স্ক্রলিং নোটিশ (Ticker)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.scrollingHeadline}
                    onChange={(e) => setSettings({ ...settings, scrollingHeadline: e.target.value })}
                    className="w-full p-3 rounded-xl bg-white border border-amber-300 text-sm font-medium focus:outline-none"
                    placeholder="জরুরি নোটিশ লিখুন যা হোমপেজের ব্যানারের নিচে স্ক্রল করবে..."
                  />
                </div>

                {/* Slider Items List */}
                <div className="space-y-6">
                  {settings.sliderImages.map((slide, idx) => (
                    <div key={slide.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row gap-6">
                      <div className="md:w-64 flex-shrink-0">
                        <img src={slide.url} alt="Slide Preview" className="w-full h-36 object-cover rounded-xl border border-slate-200 mb-2" />
                        <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 block text-center transition">
                          ছবি পরিবর্তন করুন
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await toBase64(file);
                                const updated = settings.sliderImages.map((s) => s.id === slide.id ? { ...s, url: base64 } : s);
                                setSettings({ ...settings, sliderImages: updated });
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-800">স্লাইড #{idx + 1}</span>
                          <button
                            onClick={() => {
                              if (settings.sliderImages.length <= 1) {
                                alert('কমপক্ষে একটি স্লাইড থাকা আবশ্যক!');
                                return;
                              }
                              const filtered = settings.sliderImages.filter((s) => s.id !== slide.id);
                              setSettings({ ...settings, sliderImages: filtered });
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                          >
                            <i className="fas fa-trash-alt"></i> মুছে ফেলুন
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">স্লাইড প্রধান শিরোনাম</label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const updated = settings.sliderImages.map((s) => s.id === slide.id ? { ...s, title: e.target.value } : s);
                              setSettings({ ...settings, sliderImages: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">উপ-শিরোনাম / বার্তা</label>
                          <input
                            type="text"
                            value={slide.subtitle || ''}
                            onChange={(e) => {
                              const updated = settings.sliderImages.map((s) => s.id === slide.id ? { ...s, subtitle: e.target.value } : s);
                              setSettings({ ...settings, sliderImages: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">বাটন টেক্সট</label>
                            <input
                              type="text"
                              value={slide.buttonText || ''}
                              onChange={(e) => {
                                const updated = settings.sliderImages.map((s) => s.id === slide.id ? { ...s, buttonText: e.target.value } : s);
                                setSettings({ ...settings, sliderImages: updated });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-600 mb-1">বাটন লিংক</label>
                            <input
                              type="text"
                              value={slide.buttonLink || ''}
                              onChange={(e) => {
                                const updated = settings.sliderImages.map((s) => s.id === slide.id ? { ...s, buttonLink: e.target.value } : s);
                                setSettings({ ...settings, sliderImages: updated });
                              }}
                              className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. HOMEPAGE FEATURES CARD TAB */}
            {activeTab === 'home_features' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">হোমপেজ ফিচার কার্ড ম্যানেজার</h2>
                    <p className="text-xs text-slate-500 mt-1">হোমপেজে প্রদর্শিত ৪টি অনন্য বৈশিষ্ট্য কার্ড এডিট ও কাস্টমাইজ করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      const newFeat: FeatureItem = {
                        id: Date.now().toString(),
                        title: 'নতুন বৈশিষ্ট্য',
                        description: 'এখানে সংক্ষিপ্ত বিবরণ লিখুন',
                        icon: 'fas fa-star',
                        color: 'emerald'
                      };
                      setSettings({ ...settings, features: [...(settings.features || []), newFeat] });
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-plus"></i>
                    <span>নতুন ফিচার যোগ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {settings.features?.map((feat, idx) => (
                    <div key={feat.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800">ফিচার কার্ড #{idx + 1}</span>
                        <button
                          onClick={() => {
                            const filtered = settings.features.filter((_, i) => i !== idx);
                            setSettings({ ...settings, features: filtered });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">শিরোনাম</label>
                          <input
                            type="text"
                            value={feat.title}
                            onChange={(e) => {
                              const updated = [...settings.features];
                              updated[idx].title = e.target.value;
                              setSettings({ ...settings, features: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">আইকন ক্লাস</label>
                          <input
                            type="text"
                            value={feat.icon}
                            onChange={(e) => {
                              const updated = [...settings.features];
                              updated[idx].icon = e.target.value;
                              setSettings({ ...settings, features: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-mono"
                            placeholder="fas fa-award"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">বিবরণ</label>
                        <textarea
                          rows={2}
                          value={feat.description}
                          onChange={(e) => {
                            const updated = [...settings.features];
                            updated[idx].description = e.target.value;
                            setSettings({ ...settings, features: updated });
                          }}
                          className="w-full p-2.5 rounded-lg bg-white border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. LEADERSHIP MESSAGES TAB */}
            {activeTab === 'leadership' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900">সম্মানিত সভাপতি ও প্রধান শিক্ষকের বাণী</h2>
                  <p className="text-xs text-slate-500 mt-1">হোমপেজে প্রদর্শিত সভাপতি ও প্রধান শিক্ষকের ছবি, পদবি ও বাণী আপডেট করুন।</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Chairman Box */}
                  <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                    <span className="text-xs font-black text-amber-800 uppercase tracking-wider block">
                      সম্মানিত চেয়ারম্যান / সভাপতি
                    </span>
                    <div className="flex items-center gap-4">
                      <img src={settings.chairmanPhoto} alt="Chairman" className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow" />
                      <div>
                        <label className="cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 block transition hover:bg-slate-50">
                          ছবি আপলোড করুন
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await toBase64(file);
                                setSettings({ ...settings, chairmanPhoto: base64 });
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">নাম</label>
                      <input
                        type="text"
                        value={settings.chairmanName}
                        onChange={(e) => setSettings({ ...settings, chairmanName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পদবি</label>
                      <input
                        type="text"
                        value={settings.chairmanDesignation}
                        onChange={(e) => setSettings({ ...settings, chairmanDesignation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">বাণী / বক্তব্য</label>
                      <textarea
                        rows={5}
                        value={settings.chairmanMsg}
                        onChange={(e) => setSettings({ ...settings, chairmanMsg: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Principal Box */}
                  <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-4">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                      প্রধান শিক্ষক
                    </span>
                    <div className="flex items-center gap-4">
                      <img src={settings.principalPhoto} alt="Principal" className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow" />
                      <div>
                        <label className="cursor-pointer bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 block transition hover:bg-slate-50">
                          ছবি আপলোড করুন
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await toBase64(file);
                                setSettings({ ...settings, principalPhoto: base64 });
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">নাম</label>
                      <input
                        type="text"
                        value={settings.principalName}
                        onChange={(e) => setSettings({ ...settings, principalName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পদবি</label>
                      <input
                        type="text"
                        value={settings.principalDesignation}
                        onChange={(e) => setSettings({ ...settings, principalDesignation: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">বাণী / বক্তব্য</label>
                      <textarea
                        rows={5}
                        value={settings.principalMsg}
                        onChange={(e) => setSettings({ ...settings, principalMsg: e.target.value })}
                        className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSyncStatus('নেতৃত্বের বাণী ও ছবি সফলভাবে সংরক্ষিত হয়েছে!')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </div>
            )}

            {/* 6. ABOUT & HISTORY TAB */}
            {activeTab === 'about_settings' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900">পরিচিতি ও ইতিহাস পেজ কনফিগারেশন</h2>
                  <p className="text-xs text-slate-500 mt-1">আমাদের কথা, ইতিহাস, মিশন, ভিশন ও পরিসংখ্যান সংখ্যাসমূহ নিয়ন্ত্রণ করুন।</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">পরিচিতি পেজ শিরোনাম</label>
                    <input
                      type="text"
                      value={settings.aboutTitle}
                      onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">প্রতিষ্ঠার পূর্ণ ইতিহাস</label>
                    <textarea
                      rows={5}
                      value={settings.aboutHistory}
                      onChange={(e) => setSettings({ ...settings, aboutHistory: e.target.value })}
                      className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">আমাদের মিশন (Mission)</label>
                      <textarea
                        rows={3}
                        value={settings.aboutMission}
                        onChange={(e) => setSettings({ ...settings, aboutMission: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">আমাদের ভিশন (Vision)</label>
                      <textarea
                        rows={3}
                        value={settings.aboutVision}
                        onChange={(e) => setSettings({ ...settings, aboutVision: e.target.value })}
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Key Stats Editor */}
                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-sm font-black text-slate-900 mb-4">বিদ্যালয়ের মূল পরিসংখ্যান সংখ্যা (Stats Counter)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {settings.stats?.map((stat, idx) => (
                        <div key={stat.id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                          <label className="block text-[11px] font-bold text-slate-500">লেবেল</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const updated = [...settings.stats];
                              updated[idx].label = e.target.value;
                              setSettings({ ...settings, stats: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          />
                          <label className="block text-[11px] font-bold text-slate-500">সংখ্যা / মান</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...settings.stats];
                              updated[idx].value = e.target.value;
                              setSettings({ ...settings, stats: updated });
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-mono font-black"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. NOTICES TAB */}
            {activeTab === 'notices' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">নোটিশ বোর্ড নিয়ন্ত্রণ</h2>
                    <p className="text-xs text-slate-500 mt-1">নতুন নোটিশ যোগ, পিন, এডিট এবং রিমুভ করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem({
                        id: Date.now().toString(),
                        title: '',
                        date: new Date().toISOString().split('T')[0],
                        type: 'ACADEMIC',
                        pinned: false,
                        content: ''
                      });
                      setModalType('notice');
                      setIsModalOpen(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-plus"></i>
                    <span>নতুন নোটিশ লিখুন</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {notices.map((n) => (
                    <div key={n.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {n.type}
                          </span>
                          {n.pinned && (
                            <span className="text-[10px] font-bold text-amber-600">
                              <i className="fas fa-thumbtack"></i> পিন
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">{n.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(n);
                            setModalType('notice');
                            setIsModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs"
                          title="সম্পাদনা"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('আপনি কি নিশ্চিত যে এই নোটিশটি মুছতে চান?')) {
                              setNotices(notices.filter((item) => item.id !== n.id));
                            }
                          }}
                          className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-red-50 text-red-600 text-xs"
                          title="মুছে ফেলুন"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                  {notices.length === 0 && (
                    <p className="text-xs text-slate-400 py-8 text-center">কোনো নোটিশ নেই।</p>
                  )}
                </div>
              </div>
            )}

            {/* 8. COURSES TAB */}
            {activeTab === 'courses' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">একাডেমিক শাখা ও পাঠ্যক্রম</h2>
                    <p className="text-xs text-slate-500 mt-1">প্লে থেকে এসএসসি ও হিফয বিভাগের সকল কারিকুলাম পরিচালনা করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem({
                        id: Date.now().toString(),
                        title: '',
                        category: '',
                        description: '',
                        icon: '📖',
                        features: ['নতুন বৈশিষ্ট্য ১', 'নতুন বৈশিষ্ট্য ২'],
                        ageGroup: '',
                        duration: ''
                      });
                      setModalType('course');
                      setIsModalOpen(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-plus"></i>
                    <span>নতুন শাখা যোগ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl shadow-sm">
                          {course.icon || '📖'}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingItem(course);
                              setModalType('course');
                              setIsModalOpen(true);
                            }}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('এই কোর্সটি ডিলিট করতে চান?')) {
                                setCourses(courses.filter((c) => c.id !== course.id));
                              }
                            }}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50 text-xs"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>

                      <h3 className="text-base font-black text-slate-900">{course.title}</h3>
                      <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded">
                        {course.category}
                      </span>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{course.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. STAFF & TEACHERS TAB */}
            {activeTab === 'staff' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">শিক্ষক ও কর্মচারী পরিষদ</h2>
                    <p className="text-xs text-slate-500 mt-1">শিক্ষকদের ছবি, পদবি, বিষয়, যোগ্যতা ও যোগাযোগের বিবরণ ম্যানেজ করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem({
                        id: Date.now().toString(),
                        name: '',
                        designation: '',
                        subject: '',
                        mobile: '',
                        email: '',
                        qualification: '',
                        type: 'TEACHER',
                        photo: ''
                      });
                      setModalType('staff');
                      setIsModalOpen(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>নতুন শিক্ষক/কর্মী যোগ</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {staff.map((s) => (
                    <div key={s.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <img
                            src={s.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&h=200&fit=crop&crop=faces&q=80'}
                            alt={s.name}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow"
                          />
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            s.type === 'TEACHER' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {s.type === 'TEACHER' ? 'শিক্ষক' : 'কর্মচারী'}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                        <p className="text-xs font-bold text-emerald-700">{s.designation}</p>
                        {s.subject && <p className="text-[11px] text-slate-500 mt-0.5">বিষয়: {s.subject}</p>}
                        <p className="text-[11px] text-slate-400 font-mono mt-1"><i className="fas fa-phone-alt mr-1"></i> {s.mobile}</p>
                      </div>

                      <div className="pt-3 border-t border-slate-200 mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingItem(s);
                            setModalType('staff');
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs"
                          title="সম্পাদনা"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('এই শিক্ষক/স্টাফকে মুছে ফেলতে চান?')) {
                              setStaff(staff.filter((item) => item.id !== s.id));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50 text-xs"
                          title="মুছুন"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 10. ADMISSIONS TAB */}
            {activeTab === 'admissions' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">ভর্তি আবেদন রিভিউ ও পরিচালনা</h2>
                    <p className="text-xs text-slate-500 mt-1">অনলাইনে জমা হওয়া সকল আবেদনপত্র পরীক্ষা, অনুমোদন বা প্রত্যাখ্যান করুন।</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                    মোট আবেদন: {admissions.length} টি
                  </span>
                </div>

                <div className="space-y-4">
                  {admissions.map((adm) => (
                    <div key={adm.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {adm.studentPhoto ? (
                            <img src={adm.studentPhoto} alt={adm.name} className="w-16 h-20 object-cover rounded-xl border border-slate-300" />
                          ) : (
                            <div className="w-16 h-20 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                              <i className="fas fa-user text-2xl"></i>
                            </div>
                          )}
                          <div>
                            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              ট্র্যাকিং নং: {adm.trackingNo || adm.id}
                            </span>
                            <h3 className="text-base font-black text-slate-900 mt-1">{adm.name}</h3>
                            <p className="text-xs text-slate-600">
                              আবেদিত শ্রেণি: <strong className="text-slate-900">{adm.targetClass}</strong> · লিঙ্গ: {adm.gender}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">আবেদনের তারিখ: {adm.appliedDate}</p>
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              const updated = admissions.map((a) => a.id === adm.id ? { ...a, status: 'APPROVED' as const } : a);
                              setAdmissions(updated);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              adm.status === 'APPROVED'
                                ? 'bg-emerald-600 text-white shadow'
                                : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            <i className="fas fa-check mr-1"></i> অনুমোদন
                          </button>
                          <button
                            onClick={() => {
                              const updated = admissions.map((a) => a.id === adm.id ? { ...a, status: 'REJECTED' as const } : a);
                              setAdmissions(updated);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                              adm.status === 'REJECTED'
                                ? 'bg-red-600 text-white shadow'
                                : 'bg-white border border-slate-200 text-red-700 hover:bg-red-50'
                            }`}
                          >
                            <i className="fas fa-times mr-1"></i> বাতিল
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('এই আবেদনটি রেকর্ড থেকে মুছে ফেলতে চান?')) {
                                setAdmissions(admissions.filter((a) => a.id !== adm.id));
                              }
                            }}
                            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600"
                            title="মুছুন"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>

                      {/* Guardian & Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                        <div>
                          <span className="text-slate-400 block">পিতা ও মাতার নাম:</span>
                          <span className="font-bold text-slate-800">{adm.fatherName} ও {adm.motherName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">অভিভাবকের মোবাইল:</span>
                          <span className="font-mono font-bold text-slate-800">{adm.phone}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">ঠিকানা:</span>
                          <span className="text-slate-700">{adm.address}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {admissions.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                      <i className="fas fa-inbox text-4xl mb-3 text-slate-300"></i>
                      <p className="font-bold">এখনো কোনো অনলাইন ভর্তি আবেদন জমা পড়েনি</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 11. STUDENTS DATABASE TAB */}
            {activeTab === 'students' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">শিক্ষার্থী ডাটাবেজ</h2>
                    <p className="text-xs text-slate-500 mt-1">বিদ্যালয়ের সকল শিক্ষার্থীর আইডি, রোল, শ্রেণি ও তথ্য রেকর্ড করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem({
                        id: (124600 + students.length + 1).toString(),
                        name: '',
                        class: '১০ম',
                        roll: (students.length + 1).toString(),
                        section: 'ক',
                        guardianPhone: '',
                        bloodGroup: '',
                        studentPhoto: ''
                      });
                      setModalType('student');
                      setIsModalOpen(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>নতুন শিক্ষার্থী যোগ</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-black">
                        <th className="py-3 px-3">আইডি</th>
                        <th className="py-3 px-3">ছবি</th>
                        <th className="py-3 px-3">নাম</th>
                        <th className="py-3 px-3">শ্রেণি ও রোল</th>
                        <th className="py-3 px-3">অভিভাবকের মোবাইল</th>
                        <th className="py-3 px-3">ফলাফল রেকর্ড</th>
                        <th className="py-3 px-3 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-3 font-mono font-bold text-emerald-700">{s.id}</td>
                          <td className="py-3 px-3">
                            {s.studentPhoto ? (
                              <img src={s.studentPhoto} alt={s.name} className="w-8 h-8 rounded-lg object-cover" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                                {s.name.charAt(0)}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                          <td className="py-3 px-3">
                            {s.class} শ্রেণি · রোল: <span className="font-mono font-bold">{s.roll}</span>
                          </td>
                          <td className="py-3 px-3 font-mono">{s.guardianPhone}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                              {s.academicResults?.length || 0} টি টার্ম
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingItem(s);
                                setModalType('student');
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                              title="সম্পাদনা"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('এই শিক্ষার্থীর তথ্য মুছে ফেলতে চান?')) {
                                  setStudents(students.filter((st) => st.id !== s.id));
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50"
                              title="মুছুন"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 12. RESULTS MANAGER TAB */}
            {activeTab === 'results_manager' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900">ফলাফল ও মার্কশিট এন্ট্রি</h2>
                  <p className="text-xs text-slate-500 mt-1">শিক্ষার্থীর পরীক্ষাভিত্তিক নম্বর এন্ট্রি করুন। জিপিএ এবং গ্রেড স্বয়ংক্রিয়ভাবে হিসাব হবে।</p>
                </div>

                <form onSubmit={handleSaveResultForStudent} className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      শিক্ষার্থী নির্বাচন করুন <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedStudentForMarks}
                      onChange={(e) => setSelectedStudentForMarks(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:bg-white"
                    >
                      <option value="">-- শিক্ষার্থী সিলেক্ট করুন --</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (আইডি: {s.id}, শ্রেণি: {s.class}, রোল: {s.roll})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">পরীক্ষার নাম / টার্ম</label>
                    <input
                      type="text"
                      required
                      value={termTitle}
                      onChange={(e) => setTermTitle(e.target.value)}
                      placeholder="যেমন: বার্ষিক পরীক্ষা ২০২৪"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white"
                    />
                  </div>

                  {/* Subject Marks Inputs */}
                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 uppercase">বিষয়ভিত্তিক প্রাপ্ত নম্বর (১০০ এর মধ্যে)</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSubjectMarksInput([...subjectMarksInput, { subject: 'নতুন বিষয়', mark: 70 }]);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        + বিষয় যোগ করুন
                      </button>
                    </div>

                    {subjectMarksInput.map((sm, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={sm.subject}
                          onChange={(e) => {
                            const updated = [...subjectMarksInput];
                            updated[idx].subject = e.target.value;
                            setSubjectMarksInput(updated);
                          }}
                          placeholder="বিষয়ের নাম"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={sm.mark}
                          onChange={(e) => {
                            const updated = [...subjectMarksInput];
                            updated[idx].mark = Number(e.target.value);
                            setSubjectMarksInput(updated);
                          }}
                          placeholder="নম্বর"
                          className="w-24 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSubjectMarksInput(subjectMarksInput.filter((_, i) => i !== idx));
                          }}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <i className="fas fa-trash-alt text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl text-xs transition shadow"
                  >
                    ফলাফল সেভ করুন
                  </button>
                </form>
              </div>
            )}

            {/* 13. QUIZZES TAB */}
            {activeTab === 'quizzes' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">অনলাইন কুইজ ও পরীক্ষা পোর্টাল</h2>
                    <p className="text-xs text-slate-500 mt-1">শিক্ষার্থীদের জন্য বহু নির্বাচনী প্রশ্নব্যাংক ও মেধা যাচাই কুইজ তৈরি করুন।</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItem({
                        id: Date.now().toString(),
                        title: '',
                        subject: '',
                        targetClass: 'সকল শ্রেণি',
                        durationMinutes: 10,
                        createdDate: new Date().toLocaleDateString('bn-BD')
                      });
                      setTempQuizQuestions([
                        {
                          question: 'পবিত্র কুরআনের কোন সূরায় বিসমিল্লাহ নেই?',
                          options: ['সূরা তাওবা', 'সূরা বাক্বারা', 'সূরা নাস', 'সূরা ফালাক'],
                          correctIndex: 0
                        }
                      ]);
                      setModalType('quiz');
                      setIsModalOpen(true);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <i className="fas fa-plus"></i>
                    <span>নতুন কুইজ তৈরি করুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.map((q) => (
                    <div key={q.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {q.targetClass}
                          </span>
                          <span className="text-xs text-slate-400">{q.durationMinutes} মিনিট</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900">{q.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">বিষয়: {q.subject}</p>
                        <p className="text-xs text-emerald-700 font-bold mt-2">
                          <i className="fas fa-question-circle mr-1"></i> {q.questions?.length || 0} টি প্রশ্ন অন্তর্ভূক্ত
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200 mt-4 flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            if (window.confirm('এই কুইজটি মুছে ফেলতে চান?')) {
                              setQuizzes(quizzes.filter((item) => item.id !== q.id));
                            }
                          }}
                          className="p-1.5 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50 text-xs"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 14. GALLERY TAB */}
            {activeTab === 'gallery' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">ফটো গ্যালারি ম্যানেজার</h2>
                    <p className="text-xs text-slate-500 mt-1">ক্যাম্পাস, অনুষ্ঠান, ক্লাসরুম ও ক্রীড়ার নতুন ছবি আপলোড বা রিমুভ করুন।</p>
                  </div>
                  <label className="cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow">
                    <i className="fas fa-upload"></i>
                    <span>নতুন ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await toBase64(file);
                          const title = window.prompt('ছবির ক্যাপশন / শিরোনাম লিখুন:') || 'ক্যাম্পাস ফটো';
                          const newImg: GalleryImage = {
                            id: Date.now().toString(),
                            url: base64,
                            title,
                            category: 'CAMPUS',
                            date: '২০২৪'
                          };
                          setGallery([newImg, ...gallery]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((img) => (
                    <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-sm">
                      <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-white">
                        <p className="text-xs font-bold">{img.title}</p>
                        <button
                          onClick={() => {
                            if (window.confirm('এই ছবিটি মুছে ফেলতে চান?')) {
                              setGallery(gallery.filter((g) => g.id !== img.id));
                            }
                          }}
                          className="self-end bg-red-600 text-white p-1.5 rounded-lg text-xs hover:bg-red-700"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 15. CONTACT MESSAGES INBOX TAB */}
            {activeTab === 'contact_messages' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">ইনবক্স ও যোগাযোগের বার্তা</h2>
                    <p className="text-xs text-slate-500 mt-1">অভিভাবক ও দর্শনার্থীদের পাঠানো বার্তা ও অনুসন্ধানের তালিকা।</p>
                  </div>
                  <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
                    বার্তা: {messages.length} টি
                  </span>
                </div>

                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-black text-slate-900">{msg.name}</span>
                            <span className="text-xs text-slate-400 font-mono">({msg.date})</span>
                          </div>
                          <p className="text-xs text-emerald-800 font-bold">
                            <i className="fas fa-phone mr-1 font-mono"></i> {msg.phone}
                            {msg.email && <span className="ml-3 font-mono text-slate-600"><i className="fas fa-envelope mr-1"></i> {msg.email}</span>}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm('এই বার্তাটি মুছে ফেলতে চান?')) {
                              setMessages(messages.filter((m) => m.id !== msg.id));
                            }
                          }}
                          className="text-red-400 hover:text-red-600 p-1.5"
                          title="মুছুন"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                        <strong className="block text-slate-900 mb-1">{msg.subject}</strong>
                        {msg.message}
                      </div>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                      <i className="fas fa-inbox text-4xl mb-3 text-slate-300"></i>
                      <p className="font-bold">ইনবক্সে কোনো বার্তা জমা নেই</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 16. BACKUP & CLOUD SYNC TAB */}
            {activeTab === 'backup_sync' && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 animate-fade-in">
                <div className="border-b border-slate-200 pb-4">
                  <h2 className="text-xl font-black text-slate-900">ডাটা ব্যাকআপ ও ক্লাউড সিঙ্ক</h2>
                  <p className="text-xs text-slate-500 mt-1">পুরো স্কুলের যাবতীয় ডাটা ব্যাকআপ সংরক্ষণ, এক্সপোর্ট ও ইমপোর্ট করুন।</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Backup Card */}
                  <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-xl">
                      <i className="fas fa-file-download"></i>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">সম্পূর্ণ ডাটাবেজ ব্যাকআপ ডাউনলোড</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        সকল শিক্ষার্থী, ফলাফল, নোটিশ, সেটিংস ও শিক্ষক তালিকার একটি সম্পূর্ণ JSON ব্যাকআপ আপনার কম্পিউটারে সংরক্ষণ করুন।
                      </p>
                    </div>
                    <button
                      onClick={exportBackupJSON}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-2.5 px-4 rounded-xl text-xs transition shadow"
                    >
                      ব্যাকআপ ফাইল ডাউনলোড করুন
                    </button>
                  </div>

                  {/* Restore Card */}
                  <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl">
                      <i className="fas fa-file-upload"></i>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">ব্যাকআপ ফাইল থেকে রিস্টোর</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        পূর্বে সংরক্ষিত JSON ব্যাকআপ ফাইল আপলোড করে এক ক্লিকে সম্পূর্ণ ওয়েবসাইট আগের অবস্থায় পুনরুদ্ধার করুন।
                      </p>
                    </div>
                    <label className="cursor-pointer block text-center bg-blue-700 hover:bg-blue-800 text-white font-black py-2.5 px-4 rounded-xl text-xs transition shadow">
                      ফাইল নির্বাচন করুন (.json)
                      <input type="file" accept=".json" onChange={importBackupJSON} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-red-900">ফ্যাক্টরি ডিফল্ট রিসেট</h4>
                    <p className="text-xs text-red-700 mt-0.5">সকল তথ্য মুছে শিবগঞ্জ ইসলামী একাডেমীর মূল ডেমো ডাটা ফিরিয়ে আনুন।</p>
                  </div>
                  <button
                    onClick={resetToFactoryDefaults}
                    className="bg-red-600 hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-xl text-xs transition shadow"
                  >
                    ফ্যাক্টরি রিসেট
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generic Modal for Adding / Editing Items */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fade-in">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center"
              >
                <i className="fas fa-times"></i>
              </button>

              <h3 className="text-xl font-black text-slate-900 mb-6">
                {modalType === 'notice' && 'নোটিশ এন্ট্রি / সম্পাদনা'}
                {modalType === 'course' && 'শাখা / কারিকুলাম এন্ট্রি'}
                {modalType === 'staff' && 'শিক্ষক / স্টাফ তথ্য এন্ট্রি'}
                {modalType === 'student' && 'শিক্ষার্থী তথ্য এন্ট্রি'}
                {modalType === 'quiz' && 'অনলাইন কুইজ তৈরি'}
              </h3>

              {/* Notice Form */}
              {modalType === 'notice' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const existing = notices.filter((n) => n.id !== editingItem.id);
                    setNotices([editingItem, ...existing]);
                    setIsModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">নোটিশ শিরোনাম</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">তারিখ</label>
                      <input
                        type="date"
                        required
                        value={editingItem.date}
                        onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                      <select
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <option value="ACADEMIC">একাডেমিক</option>
                        <option value="EXAM">পরীক্ষা</option>
                        <option value="ADMISSION">ভর্তি</option>
                        <option value="HOLIDAY">ছুটি</option>
                        <option value="GENERAL">সাধারণ</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={editingItem.pinned}
                        onChange={(e) => setEditingItem({ ...editingItem, pinned: e.target.checked })}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>বোর্ডে পিন করে রাখুন (Pinned Notice)</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিস্তারিত বিবরণ</label>
                    <textarea
                      rows={5}
                      value={editingItem.content || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition">
                    নোটিশ সেভ করুন
                  </button>
                </form>
              )}

              {/* Course Form */}
              {modalType === 'course' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const existing = courses.filter((c) => c.id !== editingItem.id);
                    setCourses([...existing, editingItem]);
                    setIsModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">শাখার নাম</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ক্যাটাগরি</label>
                      <input
                        type="text"
                        value={editingItem.category}
                        onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">আইকন (Emoji)</label>
                      <input
                        type="text"
                        value={editingItem.icon}
                        onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">বিবরণ</label>
                    <textarea
                      rows={3}
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition">
                    শাখা সংরক্ষণ করুন
                  </button>
                </form>
              )}

              {/* Staff Form */}
              {modalType === 'staff' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const existing = staff.filter((s) => s.id !== editingItem.id);
                    setStaff([...existing, editingItem]);
                    setIsModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পূর্ণ নাম</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ধরণ</label>
                      <select
                        value={editingItem.type}
                        onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      >
                        <option value="TEACHER">শিক্ষক</option>
                        <option value="STAFF">কর্মচারী</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পদবি</label>
                      <input
                        type="text"
                        required
                        value={editingItem.designation}
                        onChange={(e) => setEditingItem({ ...editingItem, designation: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">পাঠদানের বিষয়</label>
                      <input
                        type="text"
                        value={editingItem.subject || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">মোবাইল নম্বর</label>
                      <input
                        type="text"
                        required
                        value={editingItem.mobile}
                        onChange={(e) => setEditingItem({ ...editingItem, mobile: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষাগত যোগ্যতা</label>
                      <input
                        type="text"
                        value={editingItem.qualification || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, qualification: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ছবি আপলোড</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await toBase64(file);
                          setEditingItem({ ...editingItem, photo: base64 });
                        }
                      }}
                      className="text-xs text-slate-500"
                    />
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition">
                    শিক্ষক/কর্মী সংরক্ষণ করুন
                  </button>
                </form>
              )}

              {/* Student Form */}
              {modalType === 'student' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const existing = students.filter((s) => s.id !== editingItem.id);
                    setStudents([...existing, editingItem]);
                    setIsModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ছাত্র আইডি</label>
                      <input
                        type="text"
                        required
                        value={editingItem.id}
                        onChange={(e) => setEditingItem({ ...editingItem, id: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শিক্ষার্থীর নাম</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি</label>
                      <input
                        type="text"
                        required
                        value={editingItem.class}
                        onChange={(e) => setEditingItem({ ...editingItem, class: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">রোল</label>
                      <input
                        type="text"
                        required
                        value={editingItem.roll}
                        onChange={(e) => setEditingItem({ ...editingItem, roll: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শাখা / গ্রুপ</label>
                      <input
                        type="text"
                        value={editingItem.section || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, section: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">অভিভাবকের মোবাইল</label>
                    <input
                      type="text"
                      required
                      value={editingItem.guardianPhone}
                      onChange={(e) => setEditingItem({ ...editingItem, guardianPhone: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ছবি আপলোড</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await toBase64(file);
                          setEditingItem({ ...editingItem, studentPhoto: base64 });
                        }
                      }}
                      className="text-xs text-slate-500"
                    />
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition">
                    শিক্ষার্থী তথ্য সংরক্ষণ করুন
                  </button>
                </form>
              )}

              {/* Quiz Form */}
              {modalType === 'quiz' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newQuiz = {
                      ...editingItem,
                      questions: tempQuizQuestions
                    };
                    const existing = quizzes.filter((q) => q.id !== editingItem.id);
                    setQuizzes([newQuiz, ...existing]);
                    setIsModalOpen(false);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">কুইজ শিরোনাম</label>
                    <input
                      type="text"
                      required
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                      placeholder="যেমন: সাধারণ জ্ঞান ও ইসলামিক কুইজ"
                      className="w-full px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">বিষয়</label>
                      <input
                        type="text"
                        required
                        value={editingItem.subject}
                        onChange={(e) => setEditingItem({ ...editingItem, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">শ্রেণি</label>
                      <input
                        type="text"
                        value={editingItem.targetClass}
                        onChange={(e) => setEditingItem({ ...editingItem, targetClass: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">সময় (মিনিট)</label>
                      <input
                        type="number"
                        min={1}
                        value={editingItem.durationMinutes}
                        onChange={(e) => setEditingItem({ ...editingItem, durationMinutes: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-center font-mono font-bold"
                      />
                    </div>
                  </div>

                  {/* Questions Builder */}
                  <div className="border-t border-slate-200 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">প্রশ্নসমূহ ({tempQuizQuestions.length}টি)</span>
                      <button
                        type="button"
                        onClick={() => {
                          setTempQuizQuestions([
                            ...tempQuizQuestions,
                            { question: '', options: ['', '', '', ''], correctIndex: 0 }
                          ]);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:underline"
                      >
                        + প্রশ্ন যোগ করুন
                      </button>
                    </div>

                    {tempQuizQuestions.map((q, qIdx) => (
                      <div key={qIdx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-600">প্রশ্ন #{qIdx + 1}</span>
                          <button
                            type="button"
                            onClick={() => setTempQuizQuestions(tempQuizQuestions.filter((_, i) => i !== qIdx))}
                            className="text-red-400 hover:text-red-600 text-xs"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...tempQuizQuestions];
                            updated[qIdx].question = e.target.value;
                            setTempQuizQuestions(updated);
                          }}
                          placeholder="প্রশ্ন লিখুন"
                          className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-1.5">
                              <input
                                type="radio"
                                name={`correct-${qIdx}`}
                                checked={q.correctIndex === oIdx}
                                onChange={() => {
                                  const updated = [...tempQuizQuestions];
                                  updated[qIdx].correctIndex = oIdx;
                                  setTempQuizQuestions(updated);
                                }}
                                title="সঠিক উত্তর হিসেবে চিহ্নিত করুন"
                              />
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...tempQuizQuestions];
                                  updated[qIdx].options[oIdx] = e.target.value;
                                  setTempQuizQuestions(updated);
                                }}
                                placeholder={`অপশন ${oIdx + 1}`}
                                className="w-full px-2 py-1 rounded-md bg-white border border-slate-200 text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-xs transition">
                    কুইজ সেভ করুন
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
