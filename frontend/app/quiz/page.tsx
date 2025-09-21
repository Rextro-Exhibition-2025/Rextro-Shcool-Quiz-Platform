"use client";
import React, { useState, useEffect, useRef } from 'react';
// Helper to format time as mm:ss
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
import { useRouter } from 'next/navigation';

import { useUser } from '@/contexts/UserContext';
import { ChevronLeft, ChevronRight, Check, Clock } from 'lucide-react';

interface Answer {
  id: string;
  text: string | null;
  image: string | null;
}

interface QuizQuestion {
  id: number;
  question: string;
  image: string | null;
  answers: Answer[];
}

interface StudentData {
  memberName: string;
  schoolName: string;
  sessionId?: string;
  sessionTime?: string;
}

interface SelectedAnswers {
  [questionIndex: number]: string;
}

interface CompletionData {
  memberName: string;
  schoolName: string;
  answers: SelectedAnswers;
  score: number;
  completedAt: string;
  totalQuestions: number;
  answeredQuestions: number;
}

// Sample quiz data with different question and answer types
const quizData: QuizQuestion[] = [
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
  ...Array.from({ length: 11 }, (_, i): QuizQuestion => ({
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

export default function Quiz(): React.JSX.Element | null {
  // 45 minutes in seconds
  const QUIZ_DURATION = 45 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_DURATION);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quizSelectedAnswers');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {};
  });
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCompletionCard, setShowCompletionCard] = useState<boolean>(false);
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [sessionInfo, setSessionInfo] = useState<{ sessionId: string; sessionTime: string } | null>(null);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    console.log('User context data:', user);
  }, [user]);

  // 1. Authentication Check
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
    setLoading(false);
  }, [router]);

  // Timer countdown effect
  useEffect(() => {
    if (!isAuthenticated || showCompletionCard) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto-submit when timer hits zero
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, showCompletionCard]);

  // Check authentication status
  useEffect(() => {
    const studentData = localStorage.getItem('studentData');
    if (!studentData) {
      router.push('/login');
      return;
    }
    try {
      const parsedData: StudentData = JSON.parse(studentData);
      if (parsedData.memberName && parsedData.schoolName) {
        setIsAuthenticated(true);
        // Determine session info based on login time or backend assignment
        // Match login page session logic
        const now = new Date();
        const hour = now.getHours();
        const minute = now.getMinutes();
        let sessionId = "";
        let sessionTime = "";
        if ((hour === 8 && minute >= 30) || (hour === 9 && minute < 15)) {
          sessionId = "1";
          sessionTime = "8:30 AM - 9:15 AM";
        } else if ((hour === 9 && minute >= 30) || (hour === 10 && minute < 15)) {
          sessionId = "2";
          sessionTime = "9:30 AM - 10:15 AM";
        } else if ((hour === 11 && minute >= 30) || (hour === 12 && minute < 15)) {
          sessionId = "3";
          sessionTime = "11:30 AM - 12:15 PM";
        } else if ((hour === 16 && minute >= 30) || (hour > 16 && hour < 23) || (hour === 23 && minute <= 15)) {
          sessionId = "4";
          sessionTime = "4:30 PM - 11:15 PM";
        } else {
          sessionId = "-";
          sessionTime = "Not in a valid session window";
        }
        setSessionInfo({ sessionId, sessionTime });
      } else {
        router.push('/login');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    // Request fullscreen - handle async operation inside useEffect
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    };

    requestFullscreen();

    // 3. Disable Copy/Paste
    const handleCopyPaste = (e: Event): void => {
      e.preventDefault();
      alert("Copy/Paste is disabled during the quiz.");
    };
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);

    // 4. Monitor Tab Switching
    const handleVisibilityChange = (): void => {
      if (document.visibilityState === "hidden") {
        alert("Tab switching detected! Please stay on the quiz page.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
    };
  }, [isAuthenticated]);

  // Separate useEffect for fullscreen detection that depends on currentQuestion
  useEffect(() => {
    if (!isAuthenticated) return;

    // 7. Full-Screen Mode Detection
    const handleFullScreenChange = (): void => {
      console.log('Fullscreen change detected:', {
        isFullscreen: !!document.fullscreenElement,
        currentQuestion: currentQuestion,
        totalQuestions: quizData.length - 1,
        isSubmitting: isSubmitting,
        shouldShowPrompt: !document.fullscreenElement && !isSubmitting
      });

      // Show fullscreen prompt on ALL questions (including the last one)
      // BUT NOT during quiz submission
      if (!document.fullscreenElement && !isSubmitting) {
        setShowFullscreenPrompt(true);
      }
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);

    // Cleanup
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, [isAuthenticated, currentQuestion, isSubmitting]);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalQuestions = quizData.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // Calculate quiz score
  const calculateScore = (): number => {
    let correctAnswers = 0;
    const correctAnswerKey: { [key: number]: string } = {
      0: 'c', // Paris
      1: 'd', // All of the above
      2: 'a', // React logo (assuming first option is correct)
      3: 'a', // Creates a function (assuming first option is correct)
    };

    Object.keys(selectedAnswers).forEach(questionIndex => {
      const questionNum = parseInt(questionIndex);
      const selectedAnswer = selectedAnswers[questionNum];
      if (correctAnswerKey[questionNum] && selectedAnswer === correctAnswerKey[questionNum]) {
        correctAnswers++;
      } else if (questionNum >= 4) {
        // For sample questions (5+), assume 'a' is correct
        if (selectedAnswer === 'a') {
          correctAnswers++;
        }
      }
    });

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  // Handle quiz submission
  const handleSubmitQuiz = async (): Promise<void> => {
    if (timerRef.current) clearInterval(timerRef.current);
    try {
      // Set submitting flag to prevent fullscreen prompt during submission
      setIsSubmitting(true);

      // Check if user is still authenticated
      const studentData = localStorage.getItem('studentData');
      if (!studentData) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const parsedStudentData: StudentData = JSON.parse(studentData);

      // Calculate score
      const score = calculateScore();

      // Prepare submission data
      const submissionData: CompletionData = {
        memberName: parsedStudentData.memberName,
        schoolName: parsedStudentData.schoolName,
        answers: selectedAnswers,
        score: score,
        completedAt: new Date().toISOString(),
        totalQuestions: quizData.length,
        answeredQuestions: answeredCount
      };

      // Store results (you can also send to backend here)
      localStorage.setItem('quizResult', JSON.stringify(submissionData));

      // Exit fullscreen first
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      // Set completion data and show completion card
      setCompletionData(submissionData);
      setShowCompletionCard(true);

      // Clear authentication after successful submission
      localStorage.removeItem('studentData');

    } catch (error) {
      alert('Error submitting quiz. Please try again.');
      console.error('Submit quiz error:', error);
      // Reset submitting flag on error
      setIsSubmitting(false);
    }
  };

  // Handle navigation to leaderboard from completion card
  const handleGoToLeaderboard = (): void => {
    setShowCompletionCard(false);
    router.push('/leaderboard');
  };

  const handleAnswerSelect = (answerId: string): void => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
  };

  const handleNext = (): void => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleQuestionNavigation = (questionIndex: number): void => {
    setCurrentQuestion(questionIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReEnterFullscreen = (): void => {
    setShowFullscreenPrompt(false);
    const elem = document.documentElement;

    const requestFullscreen = (): Promise<void> => {
      if (elem.requestFullscreen) {
        return elem.requestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) { /* Firefox */
        return (elem as any).mozRequestFullScreen();
      } else if ((elem as any).webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        return (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) { /* IE/Edge */
        return (elem as any).msRequestFullscreen();
      }
      return Promise.reject(new Error('Fullscreen not supported'));
    };

    requestFullscreen().catch((error: Error) => {
      console.error('Error entering fullscreen:', error);
      // Show the prompt again if fullscreen fails
      setTimeout(() => {
        setShowFullscreenPrompt(true);
      }, 1000);
    });
  };

  const currentQuestionData = quizData[currentQuestion];
  const selectedAnswer = selectedAnswers[currentQuestion];

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#df7500]"></div>
      </div>
    );
  }

  // Don't render the quiz if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Timer warning color
  const timerColor = timeLeft <= 60 ? '#df7500' : '#651321';

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
                backgroundColor: '#651321',
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%'
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
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedAnswer === answer.id
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
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === answer.id
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
                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-200 ${index === currentQuestion
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
                  <span style={{ position: 'relative', display: 'block', width: '100%', height: '100%' }}>
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      {index + 1}
                    </span>
                    <span style={{ position: 'absolute', right: 2, bottom: 2 }}>
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
              onClick={handleSubmitQuiz}
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

      {/* Quiz Completion Card */}
      {showCompletionCard && completionData && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full mx-4">
            <div className="p-6 bg-gradient-to-r from-[#df7500]/10 to-[#651321]/10 rounded-2xl border-2 border-[#df7500]/20 shadow-lg bg-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#651321] mb-2">Quiz Completed!</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Student ID</div>
                    <div className="font-semibold text-[#651321]">{completionData.memberName}</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">School</div>
                    <div className="font-semibold text-[#651321]">{completionData.schoolName}</div>
                  </div>
                  <div className="bg-white/50 rounded-lg p-4">
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="font-bold text-2xl text-[#df7500]">{completionData.score}%</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  Answered {completionData.answeredQuestions} of {completionData.totalQuestions} questions
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <button
                    onClick={handleGoToLeaderboard}
                    className="bg-gradient-to-r from-[#df7500] to-[#651321] text-white py-3 px-8 rounded-full font-semibold text-lg hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
