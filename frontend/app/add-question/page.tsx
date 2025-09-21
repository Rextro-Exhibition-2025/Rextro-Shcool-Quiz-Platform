"use client";
import { createServerApi } from '@/interceptors/admins';
import { LogOut, Save, Shield, Trash2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { transformQuestion } from './questionTransformer';

interface Answer {
  id: string;
  text: string;
  image: string;
}

interface Question {
  question: string;
  image: string;
  answers: Answer[];
  correctAnswer: string;
  quizId: number | null;
}

export default function AddQuestion(): React.ReactElement | null {

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
    quizId:1
  });

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
      alert('Please enter a question');
      return;
    }

    const hasValidAnswers = question.answers.some(answer => 
      answer.text.trim() || answer.image.trim()
    );

    if (!hasValidAnswers) {
      alert('Please provide at least one answer option');
      return;
    }

    if (!question.correctAnswer) {
      alert('Please select the correct answer');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Saving question:', question);

  question.quizId=1;

    const api = await createServerApi();
    const response = await api.post('/questions', transformQuestion(question));

console.log('Response:', response);


    alert('Question saved successfully!');
    
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
      quizId:null
    });
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
      quizId:null
    });
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
        {/* Admin Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-semibold text-gray-800">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Question</h1>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={clearForm}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#651321' }}
              >
                <Save size={16} />
                <span>Save Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Question Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Details</h2>
          
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Image URL (Optional)
            </label>
            <input
              type="url"
              value={question.image}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleQuestionImageChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
              placeholder="https://example.com/image.jpg"
            />
            {question.image && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img
                  src={question.image}
                  alt="Question preview"
                  className="max-w-md w-full h-auto rounded-lg shadow-md border border-gray-200"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    const nextSibling = target.nextSibling as HTMLElement;
                    target.style.display = 'none';
                    if (nextSibling) {
                      nextSibling.style.display = 'block';
                    }
                  }}
                />
                <p className="text-sm text-red-500 mt-2 hidden">Failed to load image. Please check the URL.</p>
              </div>
            )}
          </div>
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

                {/* Answer Image */}
                <div>
                  <input
                    type="url"
                    value={answer.image}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleAnswerChange(answer.id, 'image', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
                    placeholder={`Image URL for option ${answer.id.toUpperCase()} (optional)`}
                  />
                  {answer.image && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Preview:</p>
                      <img
                        src={answer.image}
                        alt={`Option ${answer.id} preview`}
                        className="w-24 h-20 object-cover rounded-lg shadow-sm border border-gray-200"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                          const target = e.target as HTMLImageElement;
                          const nextSibling = target.nextSibling as HTMLElement;
                          target.style.display = 'none';
                          if (nextSibling) {
                            nextSibling.style.display = 'block';
                          }
                        }}
                      />
                      <p className="text-xs text-red-500 mt-1 hidden">Failed to load image</p>
                    </div>
                  )}
                </div>
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
              <li>• Question and answer images should be valid URLs</li>
              <li>• At least one answer option must be provided</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
