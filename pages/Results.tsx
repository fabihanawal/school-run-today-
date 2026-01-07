
import React, { useState } from 'react';

const Results: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (searchId === '124611') {
        setResult({
          name: 'মোঃ হাসান আলি',
          roll: '১০১',
          class: '১০ম',
          gpa: '৫.০০ (Golden)',
          subjects: [
            { name: 'বাংলা', mark: 92, grade: 'A+' },
            { name: 'ইংরেজি', mark: 88, grade: 'A+' },
            { name: 'গণিত', mark: 98, grade: 'A+' },
            { name: 'ইসলাম শিক্ষা', mark: 95, grade: 'A+' },
            { name: 'বিজ্ঞান', mark: 85, grade: 'A+' },
          ]
        });
      } else {
        alert('দুঃখিত, এই আইডি দিয়ে কোনো ফলাফল পাওয়া যায়নি।');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800">পরীক্ষার ফলাফল</h1>
          <p className="text-gray-600 mt-2">আপনার ছাত্র আইডি বা রোল নম্বর প্রদান করে ফলাফল দেখুন</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="ছাত্র আইডি প্রবেশ করুন (যেমন: 124611)"
              className="flex-grow p-4 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center min-w-[150px]"
            >
              {loading ? 'অনুসন্ধান হচ্ছে...' : 'ফলাফল খুঁজুন'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-t-8 border-emerald-600 animate-fade-in">
            <div className="flex justify-between items-start border-b pb-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{result.name}</h2>
                <p className="text-gray-500">শ্রেণি: {result.class} | রোল: {result.roll}</p>
              </div>
              <div className="text-center bg-emerald-100 px-6 py-2 rounded-2xl">
                <span className="text-xs font-bold text-emerald-700 uppercase block">GPA</span>
                <span className="text-2xl font-black text-emerald-800">{result.gpa}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                    <th className="px-6 py-3">বিষয়</th>
                    <th className="px-6 py-3">প্রাপ্ত নম্বর</th>
                    <th className="px-6 py-3">গ্রেড</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.subjects.map((sub: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-700">{sub.name}</td>
                      <td className="px-6 py-4">{sub.mark}</td>
                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">{sub.grade}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button onClick={() => window.print()} className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                প্রিন্ট করুন
              </button>
              <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                পিডিএফ ডাউনলোড
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
