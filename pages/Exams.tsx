
import React, { useState, useEffect } from 'react';

interface ExamsProps {
  currentUser: any;
  role: string;
}

const Exams: React.FC<ExamsProps> = ({ currentUser, role }) => {
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const [availableQuizzes, setAvailableQuizzes] = useState(() => {
    const saved = localStorage.getItem('sia_quizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const handleNext = () => {
    if (selectedAnswer === activeQuiz?.questions[currentStep].correctIndex) {
      setScore(score + 1);
    }

    if (activeQuiz && currentStep < activeQuiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    
    // Save to student profile if logged in
    if (role === 'STUDENT' && currentUser) {
      const studentDb = JSON.parse(localStorage.getItem('sia_students_db') || '[]');
      const studentIndex = studentDb.findIndex((s: any) => s.id === currentUser.id);
      
      const newResult = {
        quizId: activeQuiz.id,
        quizTitle: activeQuiz.title,
        score: score + (selectedAnswer === activeQuiz?.questions[currentStep].correctIndex ? 1 : 0),
        totalQuestions: activeQuiz.questions.length,
        date: new Date().toLocaleDateString('bn-BD')
      };

      if (studentIndex > -1) {
        if (!studentDb[studentIndex].results) studentDb[studentIndex].results = [];
        studentDb[studentIndex].results.unshift(newResult);
        localStorage.setItem('sia_students_db', JSON.stringify(studentDb));
      } else {
        // demo/fallback logic
        const currentResults = JSON.parse(localStorage.getItem(`sia_results_${currentUser.id}`) || '[]');
        currentResults.unshift(newResult);
        localStorage.setItem(`sia_results_${currentUser.id}`, JSON.stringify(currentResults));
      }
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
          <div className="space-y-12 animate-fade-in">
             <div className="text-center">
              <h1 className="text-5xl font-black text-emerald-800 mb-4 tracking-tight">লার্নিং পোর্টাল</h1>
              <p className="text-gray-500 font-medium">আপনার মেধা যাচাই করুন এবং নতুন কিছু শিখুন</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {availableQuizzes.map((quiz: any) => (
                  <div key={quiz.id} className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i className="fas fa-brain text-6xl"></i>
                    </div>
                    <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{quiz.class} শ্রেণি</span>
                    <h3 className="text-2xl font-black text-gray-800 mt-4 mb-2">{quiz.title}</h3>
                    <p className="text-gray-400 text-sm mb-8 font-bold">{quiz.subject} | {quiz.questions.length} টি প্রশ্ন</p>
                    <button 
                      onClick={() => setActiveQuiz(quiz)}
                      className="w-full bg-emerald-600 text-white py-4 rounded-3xl font-black shadow-lg hover:bg-emerald-700 transition"
                    >
                      কুইজ শুরু করো
                    </button>
                  </div>
               ))}
               {availableQuizzes.length === 0 && (
                 <div className="col-span-full text-center py-20 bg-white rounded-[48px] border-2 border-dashed border-gray-100">
                    <p className="text-gray-300 font-bold italic">বর্তমানে কোনো কুইজ পাওয়া যায়নি</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {!isFinished ? (
              <div className="bg-white p-12 rounded-[56px] shadow-2xl animate-fade-in relative overflow-hidden">
                 <div className="absolute top-0 left-0 h-2 bg-emerald-500 transition-all duration-500" style={{ width: `${((currentStep+1)/activeQuiz.questions.length)*100}%` }}></div>
                 <div className="flex justify-between items-center mb-10">
                   <button onClick={resetQuiz} className="text-gray-300 hover:text-red-500 font-bold text-sm">✕ বাতিল</button>
                   <span className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full font-black text-xs uppercase tracking-widest">প্রশ্ন {currentStep + 1} / {activeQuiz.questions.length}</span>
                 </div>
                 <h2 className="text-3xl font-black mb-10 leading-snug text-gray-800">{activeQuiz.questions[currentStep].question}</h2>
                 <div className="space-y-4">
                   {activeQuiz.questions[currentStep].options.map((opt: string, i: number) => (
                     <button 
                        key={i} 
                        onClick={() => setSelectedAnswer(i)}
                        className={`w-full text-left p-6 rounded-[32px] border-2 font-bold transition-all text-lg ${selectedAnswer === i ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl translate-x-2' : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'}`}
                      >
                       <span className={`inline-block w-8 h-8 rounded-full text-center leading-7 mr-4 text-xs font-black ${selectedAnswer === i ? 'bg-white text-emerald-600' : 'bg-gray-200 text-gray-500'}`}>{String.fromCharCode(65 + i)}</span>
                       {opt}
                     </button>
                   ))}
                 </div>
                 <button 
                  disabled={selectedAnswer === null}
                  onClick={handleNext}
                  className="w-full mt-10 bg-gray-900 text-white py-6 rounded-3xl font-black text-xl shadow-2xl disabled:opacity-20 active:scale-95 transition-all"
                 >
                   {currentStep === activeQuiz.questions.length - 1 ? 'সাবমিট করুন' : 'পরবর্তী প্রশ্ন ➔'}
                 </button>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-[56px] shadow-2xl text-center animate-fade-in">
                <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-4xl transform rotate-12">🎉</div>
                <h2 className="text-4xl font-black mb-4 text-gray-800">অসাধারন!</h2>
                <p className="text-gray-400 font-bold mb-10 uppercase tracking-widest">কুইজ সম্পন্ন হয়েছে</p>
                <div className="bg-emerald-50 p-12 rounded-[48px] mb-10 border-4 border-white shadow-inner">
                  <p className="text-xs font-black text-emerald-600 mb-2 uppercase tracking-widest">আপনার প্রাপ্ত স্কোর</p>
                  <p className="text-8xl font-black text-emerald-900 leading-none">{score} <span className="text-2xl opacity-30">/ {activeQuiz.questions.length}</span></p>
                </div>
                {role === 'STUDENT' ? (
                  <p className="text-emerald-600 font-bold mb-8">✓ আপনার স্কোর প্রোফাইলে সেভ করা হয়েছে</p>
                ) : (
                  <p className="text-amber-600 font-bold mb-8">⚠ লগইন না থাকায় স্কোর সেভ হয়নি</p>
                )}
                <div className="flex gap-4">
                  <button onClick={resetQuiz} className="flex-grow bg-gray-100 text-gray-800 py-5 rounded-3xl font-black">আবার দিন</button>
                  <a href="#/student-profile" className="flex-grow bg-emerald-600 text-white py-5 rounded-3xl font-black shadow-lg">প্রোফাইলে যান</a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
