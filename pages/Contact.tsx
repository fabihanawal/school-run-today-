
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-emerald-800">যোগাযোগ করুন</h1>
          <p className="text-gray-600 mt-2">যেকোনো প্রশ্ন বা তথ্যের জন্য আমাদের সাথে যোগাযোগ করুন</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-emerald-50 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-emerald-900 mb-6">ঠিকানা ও তথ্য</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold">আমাদের অবস্থান</h4>
                    <p className="text-gray-600">শিবগঞ্জ ইসলামী একাডেমী, শিবগঞ্জ বাজার, চাঁপাইনবাবগঞ্জ - ৬৩৩০</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold">ফোন নম্বর</h4>
                    <p className="text-gray-600">০১৭১৬১৩৭৭০৮</p>
                    <p className="text-gray-600">০১৮৭৭৫৫০৫৫৮</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm text-emerald-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                  </div>
                  <div>
                    <h4 className="font-bold">ইমেইল</h4>
                    <p className="text-gray-600">s124611@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden h-80 border-4 border-gray-100 shadow-xl">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14523.568448550756!2d88.2583!3d24.685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39fbc41c73a8e9d7%3A0x6b696f8a42f7783a!2sShibganj%2C%20Chapai%20Nawabganj!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
            </div>
          </div>

          <div className="bg-white border p-8 rounded-3xl shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">বার্তা পাঠান</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">আপনার নাম</label>
                <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="পূর্ণ নাম লিখুন" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ইমেইল / ফোন</label>
                <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="যোগাযোগের মাধ্যম" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">বিষয়</label>
                <input type="text" className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="বার্তার মূল বিষয়" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">বার্তা</label>
                <textarea className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500 h-32" placeholder="আপনার বার্তাটি এখানে লিখুন..."></textarea>
              </div>
              <button className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-lg">বার্তা পাঠান</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
