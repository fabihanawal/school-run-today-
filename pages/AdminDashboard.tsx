
import React, { useState, useEffect } from 'react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState(() => JSON.parse(localStorage.getItem('sia_students_db') || '[]'));
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [newStudent, setNewStudent] = useState({ id: '', name: '', class: '১০ম', roll: '' });
  const [marks, setMarks] = useState({
    bangla: 0, english: 0, math: 0, religion: 0, science: 0
  });

  useEffect(() => {
    localStorage.setItem('sia_students_db', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.id || !newStudent.name) return alert('আইডি এবং নাম আবশ্যক');
    if (students.find((s: any) => s.id === newStudent.id)) return alert('এই আইডি ইতিমধ্যে বিদ্যমান');
    
    setStudents([...students, { ...newStudent, academicResults: [], submissions: [], results: [] }]);
    setNewStudent({ id: '', name: '', class: '১০ম', roll: '' });
    alert('নতুন শিক্ষার্থী সফলভাবে যোগ করা হয়েছে!');
  };

  const calculateGrade = (mark: number) => {
    if (mark >= 80) return { grade: 'A+', point: 5.0 };
    if (mark >= 70) return { grade: 'A', point: 4.0 };
    if (mark >= 60) return { grade: 'A-', point: 3.5 };
    if (mark >= 50) return { grade: 'B', point: 3.0 };
    if (mark >= 40) return { grade: 'C', point: 2.0 };
    if (mark >= 33) return { grade: 'D', point: 1.0 };
    return { grade: 'F', point: 0.0 };
  };

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return alert('শিক্ষার্থী নির্বাচন করুন');

    const subMarks = [
      { name: 'বাংলা', val: marks.bangla },
      { name: 'ইংরেজি', val: marks.english },
      { name: 'গণিত', val: marks.math },
      { name: 'ধর্ম ও নৈতিক শিক্ষা', val: marks.religion },
      { name: 'বিজ্ঞান', val: marks.science }
    ];

    const processedSubjects = subMarks.map(s => ({
      subject: s.name,
      mark: s.val,
      ...calculateGrade(s.val)
    }));

    const totalGP = processedSubjects.reduce((acc, s) => acc + s.point, 0);
    const gpa = Number((totalGP / processedSubjects.length).toFixed(2));
    const isPassed = !processedSubjects.some(s => s.point === 0);
    
    let finalGrade = 'F';
    if (isPassed) {
      if (gpa === 5) finalGrade = 'A+';
      else if (gpa >= 4) finalGrade = 'A';
      else if (gpa >= 3.5) finalGrade = 'A-';
      else if (gpa >= 3) finalGrade = 'B';
      else if (gpa >= 2) finalGrade = 'C';
      else finalGrade = 'D';
    }

    const newResult = {
      id: Math.random().toString(),
      termTitle: 'বার্ষিক পরীক্ষা ২০২৪',
      subjects: processedSubjects,
      totalGPA: isPassed ? gpa : 0,
      finalGrade: isPassed ? finalGrade : 'F',
      isPassed,
      date: new Date().toLocaleDateString('bn-BD')
    };

    const updatedStudents = students.map((s: any) => {
      if (s.id === selectedStudentId) {
        const academicResults = s.academicResults || [];
        return { ...s, academicResults: [newResult, ...academicResults] };
      }
      return s;
    });

    setStudents(updatedStudents);
    alert('ফলাফল সফলভাবে ক্যালকুলেট ও সেভ করা হয়েছে!');
  };

  const menuItems = [
    { id: 'overview', label: 'ওভারভিউ', icon: '📊' },
    { id: 'students', label: 'ছাত্র ডাটাবেজ', icon: '👨‍🎓' },
    { id: 'results', label: 'ফলাফল এন্ট্রি', icon: '📝' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'results':
        return (
          <div className="bg-white p-10 rounded-[40px] shadow-sm animate-fade-in">
            <h2 className="text-2xl font-black text-gray-800 mb-8">ফলাফল ক্যালকুলেশন মডিউল</h2>
            <form onSubmit={handleSaveResult} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">শিক্ষার্থী নির্বাচন</label>
                  <select 
                    className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">ছাত্র নির্বাচন করুন</option>
                    {students.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} (ID: {s.id})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 mb-2 uppercase">পরীক্ষার নাম</label>
                  <input type="text" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100" value="বার্ষিক পরীক্ষা ২০২৪" readOnly />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t">
                {['bangla', 'english', 'math', 'religion', 'science'].map(sub => (
                  <div key={sub}>
                    <label className="block text-xs font-black text-gray-400 mb-2 uppercase">{sub === 'bangla' ? 'বাংলা' : sub === 'english' ? 'ইংরেজি' : sub === 'math' ? 'গণিত' : sub === 'religion' ? 'ধর্ম' : 'বিজ্ঞান'}</label>
                    <input 
                      type="number" 
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-emerald-500" 
                      placeholder="নম্বর"
                      onChange={(e) => setMarks({...marks, [sub]: parseInt(e.target.value) || 0})}
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl hover:bg-black transition-all">
                ফলাফল জেনারেট করুন ➔
              </button>
            </form>
          </div>
        );
      
      case 'students':
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm animate-fade-in">
               <h3 className="text-xl font-black mb-6">নতুন শিক্ষার্থী যোগ করুন</h3>
               <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <input type="text" placeholder="আইডি" className="p-4 rounded-2xl bg-gray-50 border border-gray-100" value={newStudent.id} onChange={e => setNewStudent({...newStudent, id: e.target.value})} />
                 <input type="text" placeholder="নাম" className="p-4 rounded-2xl bg-gray-50 border border-gray-100" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
                 <input type="text" placeholder="রোল" className="p-4 rounded-2xl bg-gray-50 border border-gray-100" value={newStudent.roll} onChange={e => setNewStudent({...newStudent, roll: e.target.value})} />
                 <button type="submit" className="bg-emerald-600 text-white rounded-2xl font-bold">যোগ করুন</button>
               </form>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm animate-fade-in overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50 border-b">
                   <tr className="text-xs font-black text-gray-400 uppercase">
                     <th className="px-6 py-4">আইডি</th>
                     <th className="px-6 py-4">নাম</th>
                     <th className="px-6 py-4">ফলাফল</th>
                     <th className="px-6 py-4">অ্যাকশন</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y">
                   {students.map((s: any) => (
                     <tr key={s.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 font-bold">{s.id}</td>
                       <td className="px-6 py-4 font-bold">{s.name}</td>
                       <td className="px-6 py-4">
                         {s.academicResults?.length > 0 ? (
                           <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">প্রকাশিত ({s.academicResults[0].finalGrade})</span>
                         ) : <span className="text-xs text-gray-300 italic">এখনো প্রকাশিত হয়নি</span>}
                       </td>
                       <td className="px-6 py-4">
                          <button onClick={() => setStudents(students.filter((x:any)=>x.id !== s.id))} className="text-red-300 hover:text-red-600"><i className="fas fa-trash"></i></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>
        );

      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-4 border-emerald-500">
              <p className="text-sm font-bold text-gray-400 uppercase">মোট শিক্ষার্থী</p>
              <p className="text-5xl font-black text-gray-800">{students.length}</p>
            </div>
            <div className="bg-white p-8 rounded-[40px] shadow-sm border-b-4 border-amber-500">
              <p className="text-sm font-bold text-gray-400 uppercase">ফলাফল প্রকাশিত</p>
              <p className="text-5xl font-black text-gray-800">
                {students.reduce((acc: number, s: any) => acc + (s.academicResults?.length || 0), 0)}
              </p>
            </div>
          </div>
        );

      default:
        return <div className="p-10 text-center text-gray-300">লোডিং...</div>;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-[32px] shadow-sm sticky top-24">
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-5 py-4 rounded-2xl flex items-center gap-4 transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white font-bold shadow-xl' : 'text-gray-500 hover:bg-emerald-50'}`}
                >
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
