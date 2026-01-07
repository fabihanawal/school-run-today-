
import React, { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

interface Quiz {
  id: number;
  title: string;
  class: string;
  subject: string;
  questions: Question[];
}

const Exams: React.FC = () => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const availableQuizzes: Quiz[] = [
    {
      id: 1,
      title: 'সাধারণ জ্ঞান কুইজ - ০১',
      class: '১০ম শ্রেণি',
      subject: 'সাধারণ জ্ঞান',
      questions: [
        { question: 'বাংলাদেশের জাতীয় কবি কে?', options: ['রবীন্দ্রনাথ ঠাকুর', 'কাজী নজরুল ইসলাম', 'জীবনানন্দ দাশ', 'জসীমউদ্দীন'], correctIndex: 1 },
        { question: 'চাঁপাইনবাবগঞ্জ জেলা কোন বিভাগে অবস্থিত?', options: ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'রংপুর'], correctIndex: 2 },
        { question: 'শিক্ষা জাতির কি?', options: ['বোঝা', 'মেরুদণ্ড', 'অহংকার', 'সম্পদ'], correctIndex: 1 },
      ]
    },
    {
      id: 2,
      title: 'ইসলামিক কুইজ - সীরাত উন নবী',
      class: '৮ম শ্রেণি',
      subject: 'ইসলাম শিক্ষা',
      questions: [
        { question: 'রাসূল (সা.)-এর পিতার নাম কি?', options: ['আব্দুল্লাহ', 'আবু তালিব', 'হামজা', 'আব্দুল মুত্তালিব'], correctIndex: 0 },
        { question: 'প্রথম হিজরত কোথায় হয়েছিল?', options: ['মদিনা', 'আবিসিনিয়া', 'তায়েফ', 'ইয়েমেন'], correctIndex: 1 },
      ]
    }
  ];

  const formalExams = [
    { title: 'অর্ধ-বার্ষিক পরীক্ষা ২০২৪', date: '২০ মে, ২০২৪', time: '১০:০০ AM', class: 'সকল শ্রেণি' },
    { title: 'প্রাক-নির্বাচনী পরীক্ষা', date: '১৫ জুন, ২০২৪', time: '০৯:০০ AM', class: '১০ম শ্রেণি' },
  ];

  const handleAnswerSelection = (idx: number) => {
    setSelectedAnswer(idx);
  };

  const handleNext = () => {
    if (selectedAnswer === activeQuiz?.questions[currentStep].correctIndex) {
      setScore(score + 1);
    }

    if (activeQuiz && currentStep < activeQuiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setActiveQuiz(null);
    setCurrentStep(0);
    setScore(0);
    setIsFinished(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {!activeQuiz ? (
          <div className="space-y-12">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-4xl font-black text-emerald-800 mb-4 uppercase tracking-tight">লার্নিং পোর্টাল</h1>
              <p className="text-gray-600">নিজেকে যাচাই করুন এবং আগামী পরীক্ষার প্রস্তুতি নিন</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quizzes Column */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">🧠</span> চলমান কুইজসমূহ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {availableQuizzes.map((quiz) => (
                    <div key={quiz.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{quiz.class}</span>
                        <span className="text-xs text-gray-400">{quiz.questions.length} টি প্রশ্ন</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition">{quiz.title}</h3>
                      <p className="text-sm text-gray-500 mb-6">বিষয়: {quiz.subject}</p>
                      <button 
                        onClick={() => setActiveQuiz(quiz)}
                        className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-lg"
                      >
                        কুইজ শুরু করুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exams Column */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                  <span className="text-3xl">📅</span> পরীক্ষার সময়সূচী
                </h2>
                <div className="space-y-4">
                  {formalExams.map((exam, i) => (
                    <div key={i} className="bg-emerald-800 text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150"></div>
                      <h4 className="font-bold text-lg mb-2 relative z-10">{exam.title}</h4>
                      <div className="space-y-1 relative z-10 text-emerald-100 text-sm">
                        <p className="flex items-center gap-2"><span>🗓️</span> {exam.date}</p>
                        <p className="flex items-center gap-2"><span>⏰</span> {exam.time}</p>
                        <p className="flex items-center gap-2"><span>🎓</span> {exam.class}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 mt-8">
                  <h4 className="font-bold text-amber-800 mb-2">পরীক্ষার্থীদের জন্য নির্দেশিকা:</h4>
                  <ul className="text-xs text-amber-700 space-y-2 list-disc pl-4">
                    <li>পরীক্ষার অন্তত ৩০ মিনিট আগে সেন্টারে উপস্থিত হতে হবে।</li>
                    <li>প্রবেশপত্র সাথে রাখা বাধ্যতামূলক।</li>
                    <li>কোনো ইলেকট্রনিক ডিভাইস গ্রহণযোগ্য নয়।</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Live Quiz Experience */
          <div className="max-w-2xl mx-auto">
            {!isFinished ? (
              <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-10">
                  <button onClick={resetQuiz} className="text-gray-400 hover:text-red-500 font-bold">✕ ক্যানসেল</button>
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-bold text-sm">
                    প্রশ্ন {currentStep + 1} / {activeQuiz.questions.length}
                  </div>
                </div>

                <div className="mb-10">
                  <h2 className="text-2xl font-black text-gray-800 leading-snug">
                    {activeQuiz.questions[currentStep].question}
                  </h2>
                </div>

                <div className="space-y-4">
                  {activeQuiz.questions[currentStep].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelection(idx)}
                      className={`w-full text-left p-5 rounded-2xl border-2 transition-all font-bold ${
                        selectedAnswer === idx 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                          : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-emerald-200'
                      }`}
                    >
                      <span className="inline-block w-8 h-8 rounded-lg bg-white border mr-4 text-center leading-8 text-xs font-black shadow-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                <button
                  disabled={selectedAnswer === null}
                  onClick={handleNext}
                  className={`w-full mt-10 py-5 rounded-3xl font-black text-lg transition shadow-xl ${
                    selectedAnswer === null 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {currentStep === activeQuiz.questions.length - 1 ? 'কুইজ শেষ করুন' : 'পরবর্তী প্রশ্ন ➔'}
                </button>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center animate-fade-in">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">🏆</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">চমৎকার! কুইজ সম্পন্ন হয়েছে।</h2>
                <p className="text-gray-500 mb-8">আপনার ফলাফল নিচে দেওয়া হলো:</p>
                
                <div className="bg-emerald-50 p-8 rounded-3xl mb-10">
                  <p className="text-gray-600 font-bold mb-2">প্রাপ্ত স্কোর</p>
                  <p className="text-6xl font-black text-emerald-700">{score} / {activeQuiz.questions.length}</p>
                </div>

                <button 
                  onClick={resetQuiz}
                  className="bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black transition"
                >
                  ড্যাশবোর্ডে ফিরে যান
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
