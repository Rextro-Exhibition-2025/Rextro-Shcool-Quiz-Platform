"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

// Sample quiz data with different question and answer types
const quizData = [
  {
    id: 1,
    question: "What is the capital of France?",
    image: null,
    answers: [
      { id: 'a', text: 'London', image: null },
      { id: 'b', text: 'Berlin', image: null },
      { id: 'c', text: 'Paris', image: null },
      { id: 'd', text: 'Madrid', image: null }
    ]
  },
  {
    id: 2,
    question: "Which of these is a programming language?",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop",
    answers: [
      { id: 'a', text: 'JavaScript', image: null },
      { id: 'b', text: 'HTML', image: null },
      { id: 'c', text: 'CSS', image: null },
      { id: 'd', text: 'All of the above', image: null }
    ]
  },
  {
    id: 3,
    question: "Select the correct React logo:",
    image: null,
    answers: [
      { id: 'a', text: null, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=100&fit=crop' },
      { id: 'b', text: null, image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=150&h=100&fit=crop' },
      { id: 'c', text: null, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=100&fit=crop' },
      { id: 'd', text: null, image: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=150&h=100&fit=crop' }
    ]
  },
  {
    id: 4,
    question: "What does this code snippet do?",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop",
    answers: [
      { id: 'a', text: 'Creates a function', image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=100&h=60&fit=crop' },
      { id: 'b', text: 'Declares a variable', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100&h=60&fit=crop' },
      { id: 'c', text: 'Loops through data', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=100&h=60&fit=crop' },
      { id: 'd', text: 'Handles events', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=60&fit=crop' }
    ]
  },
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 5,
    question: `This is a sample question with different formats.`,
    image: i % 3 === 0 ? "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop" : null,
    answers: [
      { id: 'a', text: `Option A for question ${i + 5}`, image: null },
      { id: 'b', text: `Option B for question ${i + 5}`, image: null },
      { id: 'c', text: `Option C for question ${i + 5}`, image: null },
      { id: 'd', text: `Option D for question ${i + 5}`, image: null }
    ]
  }))
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    // 3. Disable Copy/Paste
    const handleCopyPaste = (e) => {
      e.preventDefault();
      alert("Copy/Paste is disabled during the quiz.");
    };
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);

    // 4. Monitor Tab Switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        alert("Tab switching detected! Please stay on the quiz page.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 7. Full-Screen Mode Detection
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement && currentQuestion !== quizData.length - 1) {
        setShowFullscreenPrompt(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);      
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
    };
  }, [currentQuestion]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalQuestions = quizData.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const handleAnswerSelect = (answerId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (questionIndex) => {
    setCurrentQuestion(questionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReEnterFullscreen = () => {
    setShowFullscreenPrompt(false);
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  };

  const currentQuestionData = quizData[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  const { useRouter } = require('next/navigation');
  const router = useRouter();
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

        {/* Header with Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Quiz Challenge</h1>
            <div className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {totalQuestions}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full rounded-full h-3 mb-4" style={{ background: 'rgba(223,117,0,0.1)' }}>
            <div 
              className="h-3 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                backgroundColor: '#651321'
              }}
            ></div>
          </div>
          
          <div className="text-center text-sm font-semibold text-gray-700">
            {answeredCount} of {totalQuestions} answered ({Math.round(progress)}%)
          </div>
        
        {/* Question Card */}
          <div className="my-8">
                      
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
                {currentQuestion + 1}. {currentQuestionData.question}
            </h2>
            
            {currentQuestionData.image && (
              <div className="mb-6">
                <img
                  src={currentQuestionData.image}
                  alt="Question illustration"
                  className="w-full max-w-md mx-auto rounded-xl shadow-md"
                />
              </div>
            )}
          </div>
          
          {/* Answers */}
          <div className="grid gap-4">
            {currentQuestionData.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedAnswer === answer.id
                    ? 'shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                style={selectedAnswer === answer.id ? {
                  borderColor: '#DF7500',
                  backgroundColor: '#DF750008'
                } : {}}
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === answer.id
                        ? 'text-white'
                        : 'border-gray-300'
                    }`}
                    style={selectedAnswer === answer.id ? {
                      borderColor: '#DF7500',
                      backgroundColor: '#DF7500'
                    } : {}}
                  >
                    {selectedAnswer === answer.id && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    {answer.image && !answer.text && (
                      <img
                        src={answer.image}
                        alt={`Option ${answer.id}`}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                    )}
                    
                    {answer.text && !answer.image && (
                      <span className="text-gray-800 font-medium">
                        {answer.text}
                      </span>
                    )}
                    
                    {answer.text && answer.image && (
                      <div className="flex items-center space-x-3">
                        <img
                          src={answer.image}
                          alt={`Option ${answer.id}`}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <span className="text-gray-800 font-medium">
                          {answer.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center gap-5">
          <div>
            {currentQuestion !== 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-50 shadow-lg hover:shadow-xl"
              >
                <ChevronLeft size={20} />
                <span>Previous</span>
              </button>
            )}
          </div>
          <div className="ml-auto">
            {currentQuestion !== totalQuestions - 1 && (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-white hover:opacity-90 shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#651321' }}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
  </div>
        
        {/* Question Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 my-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {Array.from({ length: totalQuestions }, (_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionNavigation(index)}
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200 ${
                  index === currentQuestion
                    ? 'text-white shadow-lg scale-105'
                    : selectedAnswers[index]
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={
                  index === currentQuestion
                    ? { backgroundColor: '#DF7500' }
                    : selectedAnswers[index]
                    ? { backgroundColor: '#651321' }
                    : {}
                }
              >
              {selectedAnswers[index] ? (
                  <span style={{position: 'relative', display: 'block', width: '100%', height: '100%'}}>
                    <span style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                      {index + 1}
                    </span>
                    <span style={{position: 'absolute', right: 2, bottom: 2}}>
                      <Check size={14} />
                    </span>
                  </span>
                ) : (
                  index + 1
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button (appears on last question) */}
        {currentQuestion === totalQuestions - 1 && (
          <div className="mt-6 text-center">
            <button 
              className="text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#651321' }}
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                }
                router.push('/leaderboard');
              }}
            >
              Submit Quiz
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Prompt */}
      {showFullscreenPrompt && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center text-black">
            <h2 className="text-lg font-bold mb-4">Full Screen Required</h2>
            <p className="mb-6">Please click the button below to return to full-screen mode and continue your quiz.</p>
            <button
              className="px-6 py-3 bg-[#651321] text-white rounded-lg font-semibold"
              onClick={handleReEnterFullscreen}
            >
              Re-enter Full Screen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

