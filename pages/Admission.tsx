
import React, { useState } from 'react';

const Admission: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    birthDate: '',
    targetClass: '১ম',
    gender: 'ছেলে',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('ভর্তি আবেদন সফলভাবে জমা হয়েছে! শীঘ্রই আপনার সাথে যোগাযোগ করা হবে।');
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-emerald-800 text-center mb-8">অনলাইন ভর্তি ফরম</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 bg-emerald-50 p-8 rounded-2xl shadow-inner">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">শিক্ষার্থীর পূর্ণ নাম</label>
                  <input 
                    type="text" 
                    required
                    className="w-full p-3 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="যেমন: মোঃ আব্দুল্লাহ"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">জন্ম তারিখ</label>
                  <input 
                    type="date" 
                    required
                    className="w-full p-3 rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">পিতার নাম</label>
                  <input type="text" className="w-full p-3 rounded-lg border border-emerald-200 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">মাতার নাম</label>
                  <input type="text" className="w-full p-3 rounded-lg border border-emerald-200 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">ভর্তির শ্রেণি</label>
                  <select className="w-full p-3 rounded-lg border border-emerald-200 outline-none">
                    <option>প্লে / নার্সারি</option>
                    <option>১ম - ৫ম শ্রেণি</option>
                    <option>৬ষ্ঠ - ১০ম শ্রেণি</option>
                    <option>একাদশ (HSC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">লিঙ্গ</label>
                  <select className="w-full p-3 rounded-lg border border-emerald-200 outline-none">
                    <option>ছেলে</option>
                    <option>মেয়ে</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">মোবাইল নম্বর</label>
                  <input type="tel" className="w-full p-3 rounded-lg border border-emerald-200 outline-none" placeholder="017xxxxxxxx" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">স্থায়ী ঠিকানা</label>
                <textarea className="w-full p-3 rounded-lg border border-emerald-200 outline-none h-24"></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">শিক্ষার্থীর ছবি (পাসপোর্ট সাইজ)</label>
                <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200" />
              </div>

              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200">
                আবেদন জমা দিন
              </button>
            </form>
          </div>

          {/* Fee Table & Instructions */}
          <div className="space-y-8">
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <h3 className="text-xl font-bold text-amber-900 mb-4">ফি স্ট্রাকচার (২০২৪)</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-amber-200">
                    <th className="text-left py-2">শ্রেণি</th>
                    <th className="text-right py-2">মাসিক ফি</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-amber-100">
                    <td className="py-2">প্লে - নার্সারি</td>
                    <td className="text-right py-2">৫০০/-</td>
                  </tr>
                  <tr className="border-b border-amber-100">
                    <td className="py-2">১ম - ৫ম শ্রেণি</td>
                    <td className="text-right py-2">৮০০/-</td>
                  </tr>
                  <tr className="border-b border-amber-100">
                    <td className="py-2">৬ষ্ঠ - ১০ম শ্রেণি</td>
                    <td className="text-right py-2">১,২০০/-</td>
                  </tr>
                  <tr>
                    <td className="py-2">একাদশ - দ্বাদশ</td>
                    <td className="text-right py-2">১,৮০০/-</td>
                  </tr>
                </tbody>
              </table>
              <p className="mt-4 text-xs text-amber-800 font-bold">* বি:দ্র: ভর্তি ফি এবং অন্যান্য আনুষঙ্গিক খরচ এর জন্য অফিসে যোগাযোগ করুন।</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-bold mb-3">নির্দেশাবলী</h3>
              <ul className="text-sm space-y-2 text-gray-600 list-disc pl-4">
                <li>আবেদন করার পূর্বে শিক্ষার্থীর জন্ম নিবন্ধন কার্ডের কপি সাথে রাখুন।</li>
                <li>HSC এর ক্ষেত্রে SSC এর নম্বরপত্র আপলোড করতে হবে।</li>
                <li>বিকাশ/নগদ এর মাধ্যমে ভর্তি ফি প্রদান করা যাবে।</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admission;
