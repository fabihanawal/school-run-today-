
import React, { useState } from 'react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // State for Notices
  const [notices, setNotices] = useState([
    { id: 1, title: 'এসএসসি পরীক্ষার রুটিন', type: 'একাডেমিক', date: '২০২৪-০৩-১৫' },
    { id: 2, title: 'বার্ষিক ক্রীড়া প্রতিযোগিতা', type: 'ক্রীড়া', date: '২০২৪-০৪-১০' },
  ]);

  // State for Quizzes
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'সাধারণ জ্ঞান কুইজ - ০১', class: '১০ম', subject: 'সা: জ্ঞান', questionsCount: 3 },
    { id: 2, title: 'ইসলামিক কুইজ - সীরাত', class: '৮ম', subject: 'ইসলাম শিক্ষা', questionsCount: 2 },
  ]);

  // State for Exams
  const [exams, setExams] = useState([
    { id: 1, title: 'অর্ধ-বার্ষিক পরীক্ষা ২০২৪', date: '২০২৪-০৫-২০', time: '১০:০০ AM', class: 'সকল শ্রেণি' },
    { id: 2, title: 'নির্বাচনী পরীক্ষা', date: '২০২৪-০৬-১৫', time: '০৯:০০ AM', class: '১০ম শ্রেণি' },
  ]);

  const stats = [
    { label: 'মোট ছাত্র', value: '১,২০০+', color: 'emerald' },
    { label: 'শিক্ষক', value: '৪৫+', color: 'blue' },
    { label: 'সক্রিয় কুইজ', value: quizzes.length, color: 'purple' },
    { label: 'আসন্ন পরীক্ষা', value: exams.length, color: 'amber' },
  ];

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'students', label: 'ছাত্র ব্যবস্থাপনা', icon: '👨‍🎓' },
    { id: 'results', label: 'ফলাফল প্রকাশ', icon: '📄' },
    { id: 'notices', label: 'নোটিশ বোর্ড', icon: '📢' },
    { id: 'blog', label: 'ব্লগ ও খবর', icon: '✍️' },
    { id: 'quiz', label: 'কুইজ মেকার', icon: '🧠' },
    { id: 'exams', label: 'অনলাইন পরীক্ষা', icon: '💻' },
    { id: 'gallery', label: 'গ্যালারি', icon: '🖼️' },
    { id: 'settings', label: 'সেটিংস', icon: '⚙️' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border-b-4 border-emerald-500">
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">সাম্প্রতিক নোটিশ</h3>
                  <button onClick={() => setActiveTab('notices')} className="text-emerald-600 text-sm font-bold">সব দেখুন</button>
                </div>
                <div className="space-y-4">
                  {notices.map(notice => (
                    <div key={notice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800">{notice.title}</p>
                        <p className="text-xs text-gray-500">{notice.type} | {notice.date}</p>
                      </div>
                      <span className="text-emerald-600">➔</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-6">দ্রুত অ্যাকশন</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setActiveTab('quiz'); setShowAddForm(true); }} className="p-4 bg-purple-50 text-purple-700 rounded-2xl border border-purple-100 hover:bg-purple-100 transition text-center">
                    <span className="block text-2xl mb-1">🧠</span>
                    <span className="text-sm font-bold">কুইজ তৈরি</span>
                  </button>
                  <button onClick={() => { setActiveTab('exams'); setShowAddForm(true); }} className="p-4 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 hover:bg-blue-100 transition text-center">
                    <span className="block text-2xl mb-1">💻</span>
                    <span className="text-sm font-bold">পরীক্ষা শিডিউল</span>
                  </button>
                  <button onClick={() => setActiveTab('blog')} className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 hover:bg-amber-100 transition text-center">
                    <span className="block text-2xl mb-1">✍️</span>
                    <span className="text-sm font-bold">ব্লগ পোস্ট</span>
                  </button>
                  <button onClick={() => setActiveTab('results')} className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 hover:bg-emerald-100 transition text-center">
                    <span className="block text-2xl mb-1">📄</span>
                    <span className="text-sm font-bold">ফলাফল আপলোড</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">কুইজ মেকার</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-6 py-2 rounded-xl font-bold transition ${showAddForm ? 'bg-gray-200 text-gray-600' : 'bg-purple-600 text-white shadow-lg'}`}
              >
                {showAddForm ? 'বাতিল করুন' : '+ নতুন কুইজ'}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-purple-100 animate-slide-up">
                <h3 className="text-lg font-bold mb-6 text-purple-800">কুইজ ডিটেইলস</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input type="text" placeholder="কুইজের শিরোনাম" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500" />
                  <select className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-purple-500">
                    <option>শ্রেণি নির্বাচন করুন</option>
                    <option>১০ম</option><option>৯ম</option><option>৮ম</option>
                  </select>
                </div>
                <div className="border-t pt-6 mb-6">
                  <h4 className="font-bold mb-4">প্রশ্ন ১:</h4>
                  <input type="text" placeholder="প্রশ্নটি এখানে লিখুন" className="w-full p-4 bg-gray-50 border rounded-2xl mb-4 outline-none focus:ring-2 focus:ring-purple-500" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="অপশন ১" className="p-3 border rounded-xl" />
                    <input type="text" placeholder="অপশন ২" className="p-3 border rounded-xl" />
                    <input type="text" placeholder="অপশন ৩" className="p-3 border rounded-xl" />
                    <input type="text" placeholder="অপশন ৪" className="p-3 border rounded-xl" />
                  </div>
                </div>
                <button className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold">কুইজ সেভ করুন</button>
              </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-purple-50">
                  <tr className="text-purple-800 text-sm font-bold">
                    <th className="px-6 py-4">শিরোনাম</th>
                    <th className="px-6 py-4">শ্রেণি</th>
                    <th className="px-6 py-4">প্রশ্ন সংখ্যা</th>
                    <th className="px-6 py-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {quizzes.map(q => (
                    <tr key={q.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold">{q.title}</td>
                      <td className="px-6 py-4">{q.class}</td>
                      <td className="px-6 py-4">{q.questionsCount} টি</td>
                      <td className="px-6 py-4">
                        <button className="text-purple-600 hover:underline mr-4">এডিট</button>
                        <button className="text-red-500 hover:underline">ডিলিট</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'exams':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">অনলাইন পরীক্ষা ব্যবস্থাপনা</h2>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className={`px-6 py-2 rounded-xl font-bold transition ${showAddForm ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white shadow-lg'}`}
              >
                {showAddForm ? 'বাতিল করুন' : '+ নতুন পরীক্ষা শিডিউল'}
              </button>
            </div>

            {showAddForm && (
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 animate-slide-up">
                <h3 className="text-lg font-bold mb-6 text-blue-800">পরীক্ষার তথ্য</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input type="text" placeholder="পরীক্ষার নাম (উদা: বার্ষিক পরীক্ষা)" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="date" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="time" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="শ্রেণি" className="w-full p-4 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">শিডিউল নিশ্চিত করুন</button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4">
              {exams.map(e => (
                <div key={e.id} className="bg-white p-6 rounded-3xl shadow-sm border-l-8 border-blue-600 flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800">{e.title}</h4>
                    <p className="text-sm text-gray-500">{e.class} | {e.date} | {e.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-blue-100 text-blue-600"><i className="fas fa-edit"></i></button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-red-100 text-red-600"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white p-12 rounded-3xl text-center">
            <h2 className="text-xl font-bold text-gray-400">মডিউল তৈরির কাজ চলছে...</h2>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl shadow-sm sticky top-24">
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">S</div>
              <p className="font-bold text-gray-800">অ্যাডমিন প্যানেল</p>
            </div>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setShowAddForm(false); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl flex items-center gap-3 transition ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-lg' : 'text-gray-600 hover:bg-emerald-50'}`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
