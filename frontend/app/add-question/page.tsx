"use client";

import React, { useState, useEffect } from 'react';
import { createAdminApi } from '@/interceptors/admins';
import { Plus, Trash2, Save, ArrowLeft, LogOut, Shield, RotateCcw } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { transformQuestion } from './questionTransformer';
import ImageUpload from '@/components/ImageUpload/ImageUpload';

// Error modal state for alerts
type ErrorModalState = { open: boolean; message: string };

interface Answer {
  id: string;
  text: string;
  image: string;
}

export interface Question {
  question: string;
  image: string;
  answers: Answer[];
  correctAnswer: string;
  quizSet: number | null;
}

export default function AddQuestion(): React.ReactElement | null {
  const [errorModal, setErrorModal] = useState<ErrorModalState>({ open: false, message: '' });
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  const [question, setQuestion] = useState<Question>({
    question: '',
    image: '',
    answers: [
      { id: 'a', text: '', image: '' },
      { id: 'b', text: '', image: '' },
      { id: 'c', text: '', image: '' },
      { id: 'd', text: '', image: '' }
    ],
    correctAnswer: '',
    quizSet: null,
  });

  const handleQuizSetChange = (value: string): void => {
    const parsed = value ? parseInt(value) : null;
    setQuestion(prev => ({ ...prev, quizSet: parsed }));
  };

  const handleQuestionChange = (value: string): void => {
    setQuestion(prev => ({ ...prev, question: value }));
  };

  const handleQuestionImageChange = (value: string): void => {
    setQuestion(prev => ({ ...prev, image: value }));
  };

  const handleAnswerChange = (answerId: string, field: keyof Omit<Answer, 'id'>, value: string): void => {
    setQuestion(prev => ({
      ...prev,
      answers: prev.answers.map(answer =>
        answer.id === answerId ? { ...answer, [field]: value } : answer
      )
    }));
  };

  const handleCorrectAnswerChange = (answerId: string): void => {
    setQuestion(prev => ({ ...prev, correctAnswer: answerId }));
  };

  const handleSave = async (): Promise<void> => {
    if (!question.question.trim()) {
      setErrorModal({ open: true, message: 'Please enter a question.' });
      return;
    }

    const hasValidAnswers = question.answers.some(answer => 
      answer.text.trim() || answer.image.trim()
    );

    if (!hasValidAnswers) {
      setErrorModal({ open: true, message: 'Please provide at least one answer option.' });
      return;
    }

    if (!question.correctAnswer) {
      setErrorModal({ open: true, message: 'Please select the correct answer.' });
      return;
    }

    // Validate that the selected correct answer is not empty
    const correct = question.answers.find(a => a.id === question.correctAnswer);
    if (!correct || (!correct.text.trim() && !correct.image.trim())) {
      setErrorModal({ open: true, message: 'The selected correct answer must have text or image.' });
      return;
    }

    if (!question.quizSet) {
      setErrorModal({ open: true, message: 'Please select a quiz set.' });
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Saving question:', question);

    try {
      const api = await createAdminApi();
      const response = await api.post('/questions', transformQuestion(question));
      console.log('Response:', response);
      
      // Reset form
      setQuestion({
        question: '',
        image: '',
        answers: [
          { id: 'a', text: '', image: '' },
          { id: 'b', text: '', image: '' },
          { id: 'c', text: '', image: '' },
          { id: 'd', text: '', image: '' }
        ],
        correctAnswer: '',
        quizSet: null,
      });
      
      setShowSaveConfirm(true);
    } catch (error) {
      setErrorModal({ open: true, message: 'Failed to save question. Please try again.' });
    }
  };


  const clearForm = (): void => {
    setQuestion({
      question: '',
      image: '',
      answers: [
        { id: 'a', text: '', image: '' },
        { id: 'b', text: '', image: '' },
        { id: 'c', text: '', image: '' },
        { id: 'd', text: '', image: '' }
      ],
      correctAnswer: '',
      quizSet: null,
    });
    setShowClearConfirm(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df7500]"></div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen)
  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br p-4 relative"
      style={{
        backgroundImage: 'url("/Container.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      {/* Error Modal for Save Button Alerts */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
            <div className="mb-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#df7500] to-[#651321] shadow-lg">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent mb-1">Alert</h2>
              <p className="text-[#651321]">{errorModal.message}</p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setErrorModal({ open: false, message: '' })}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                style={{ minWidth: 120 }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(255,255,255,0.6)',
        zIndex: 1
      }} />
      
      <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Question</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
              >
                <RotateCcw size={16} />
                <span>Clear</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
              >
                <Save size={16} />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Save confirmation popup */}
        {showSaveConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
              <div className="mb-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#df7500] to-[#651321] shadow-lg">
                  <Save size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent mb-1">Question Saved!</h2>
                <p className="text-[#651321]">Your question has been saved successfully.</p>
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setShowSaveConfirm(false)}
                  className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                  style={{ minWidth: 120 }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Clear confirmation popup */}
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
              <div className="mb-4 text-center">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#df7500] to-[#651321] shadow-lg">
                  <RotateCcw size={28} className="text-white" />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent mb-1">Clear All Fields?</h2>
                <p className="text-[#651321]">This will remove all question and answer data. Are you sure?</p>
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-400 text-[#651321] shadow hover:scale-105 hover:shadow transition-all duration-200 border border-gray-300"
                  style={{ minWidth: 100 }}
                >
                  Cancel
                </button>
                <button
                  onClick={clearForm}
                  className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                  style={{ minWidth: 100 }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Details</h2>
          {/* Quiz Set Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Set *
            </label>
            <select
              value={question.quizSet ?? ""}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleQuizSetChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
            >
              <option value="">Select a quiz set</option>
              <option value="1">Set 1</option>
              <option value="2">Set 2</option>
              <option value="3">Set 3</option>
              <option value="4">Set 4</option>
            </select>
          </div>
          {/* Question Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Text *
            </label>
            <textarea
              value={question.question}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleQuestionChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 resize-none placeholder-gray-400 text-gray-800 font-medium text-left shadow-sm focus:shadow-md"
              rows={3}
              placeholder="Enter your question here..."
            />
          </div>

          {/* Question Image */}
          <ImageUpload
            label="Question Image (Optional)"
            currentImage={question.image}
            onImageChange={handleQuestionImageChange}
            folder="quiz-questions"
            maxSizeMB={2}
            recommendedSize="800×600px"
          />
        </div>

        {/* Answers Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Answer Options</h2>
          
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Option {answer.id.toUpperCase()}
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={answer.id}
                      checked={question.correctAnswer === answer.id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCorrectAnswerChange(e.target.value)}
                      className="text-[#df7500] focus:ring-[#df7500]"
                    />
                    <span className="text-sm text-gray-600">Correct Answer</span>
                  </label>
                </div>
                
                {/* Answer Text */}
                <div className="mb-3">
                  <input
                    type="text"
                    value={answer.text}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(answer.id, 'text', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
                    placeholder={`Enter text for option ${answer.id.toUpperCase()}`}
                  />
                </div>

                {/* Answer Image Upload */}
                <ImageUpload
                  label={`Image for Option ${answer.id.toUpperCase()} (Optional)`}
                  currentImage={answer.image}
                  onImageChange={(url) => handleAnswerChange(answer.id, 'image', url)}
                  folder="quiz-answers"
                  maxSizeMB={1}
                  recommendedSize="200×200px"
                />
              </div>
            ))}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fill in the question text (required)</li>
              <li>• Add answer options - you can use text, images, or both</li>
              <li>• Select which option is the correct answer</li>
              <li>• Upload images directly - they will be stored securely in Cloudinary</li>
              <li>• <b>Recommended image sizes:</b></li>
              <li className="ml-4">- <b>Question image:</b> 800×600 pixels (max 2MB, JPG/PNG/GIF)</li>
              <li className="ml-4">- <b>Option image:</b> 200×200 pixels (max 1MB, JPG/PNG/GIF)</li>
              <li>• At least one answer option must be provided</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
