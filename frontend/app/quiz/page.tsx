"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Clock } from 'lucide-react';

// Contexts and services
import { useUser } from '@/contexts/UserContext';
import { useQuiz } from '@/contexts/QuizContext';
import { createStudentApi } from '@/interceptors/student';
import { reportViolation } from '@/lib/violationService';

// Utils and types
import { transformQuizApiResponse } from './questionTransformer';
import { QuizApiResponse } from '@/types/quiz';

// Type definitions
interface Answer {
  id: string;
  text: string | null;
  image: string | null;
}

export interface QuizQuestion {
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

// Constants
const QUIZ_DURATION = 45 * 60; // 45 minutes in seconds

// Simple device fingerprint generation
const getDeviceFingerprint = (): string => {
  if (typeof window === 'undefined') return 'unknown';

  const { navigator, screen } = window;
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    navigator.hardwareConcurrency,
    screen.width,
    screen.height,
    screen.colorDepth
  ].join('::');

  // Simple hash generation
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return 'fp_' + Math.abs(hash);
};

// Helper to format time as mm:ss
const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function Quiz(): React.JSX.Element | null {
  // Constants
  const router = useRouter();
  const user = useUser();
  const { setQuizId, updateSelectedAnswers, submitQuiz, score } = useQuiz();

  // Timer management
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(QUIZ_DURATION);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([]);

  // State initialization with localStorage
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('quizSelectedAnswers');
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // UI state
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCompletionCard, setShowCompletionCard] = useState<boolean>(false);
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);

  // Inactivity tracking
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Helper functions
  const logSuspicious = (event: string, details: string) => {
    const logData = {
      user: (typeof window !== 'undefined' && localStorage.getItem('studentId')) || 'unknown',
      event,
      time: new Date().toISOString(),
      details,
      fingerprint: typeof window !== 'undefined' ? getDeviceFingerprint() : 'unknown',
    };

    fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData)
    }).catch(error => {
      console.error('Failed to log suspicious activity:', error);
    });
  };

  // Update last activity time
  const updateActivity = () => {
    setLastActivityTime(Date.now());
  };

  // Check for inactivity and log if detected
  const checkInactivity = () => {
    const now = Date.now();
    const inactiveTime = Math.floor((now - lastActivityTime) / 1000); // Convert to seconds

    // Log if user has been inactive for more than 30 seconds
    if (inactiveTime >= 30) {
      logSuspicious('Extended inactivity', `User inactive for ${inactiveTime}s on question ${currentQuestion + 1}`);
    }
  };

  // Calculate quiz score
  const calculateScore = (): number => {
    const totalQuestions = quizData.length;
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

  // Update user quiz state in backend
  const updateQuizState = async (studentData: StudentData): Promise<void> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/update-state`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken') || user.user?.authToken || ''}`
      },
      body: JSON.stringify({
        schoolName: studentData.schoolName,
        memberName: studentData.memberName,
        hasEndedQuiz: true
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update quiz state');
    }

    const responseData = await response.json();
    if (!responseData.success) {
      throw new Error(responseData.message || 'Failed to update quiz state');
    }

    // Update user context and localStorage
    if (user.user) {
      user.setUser({
        ...user.user,
        hasEndedQuiz: true
      });
    }

    const updatedStudentData = {
      ...studentData,
      hasEndedQuiz: true
    };
    localStorage.setItem('studentData', JSON.stringify(updatedStudentData));
  };

  // Handle quiz submission
  const handleSubmitQuiz = useCallback(async (): Promise<void> => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);

    try {
      // Check authentication
      const studentData = localStorage.getItem('studentData');
      if (!studentData) {
        alert('Session expired. Please login again.');
        router.push('/login');
        return;
      }

      const parsedStudentData: StudentData = JSON.parse(studentData);
      const score = calculateScore();
      const answeredCount = Object.keys(selectedAnswers).length;

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

      // Update user state in backend
      await updateQuizState(parsedStudentData);

      // Store results locally
      localStorage.setItem('quizResult', JSON.stringify(submissionData));

      // Exit fullscreen
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      // Show completion
      setCompletionData(submissionData);
      setShowCompletionCard(true);

      // Clear authentication
      localStorage.removeItem('studentData');

      // Submit to quiz context
      await submitQuiz();

    } catch (error) {
      alert('Error submitting quiz. Please try again.');
      console.error('Submit quiz error:', error);
      setIsSubmitting(false);
    }
  }, [selectedAnswers, quizData.length, router, user, submitQuiz]);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async (id: number) => {
      try {
        const api = await createStudentApi({ token: user.user?.authToken || '' });
        const response: any = await api.get(`/quizzes/${id}`);
        setQuizData(transformQuizApiResponse(response.data.quiz));
      } catch (error) {
        console.error('Fetch quiz error:', error);
      }
    };

    setQuizId(1);
    fetchQuiz(1);
  }, [setQuizId, user.user?.authToken]);

  // Debug user context
  useEffect(() => {
    console.log('User context data:', user);
  }, [user]);

  // Inactivity tracking setup
  useEffect(() => {
    if (!isAuthenticated || showCompletionCard) return;

    // Start inactivity monitoring
    if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);

    inactivityTimerRef.current = setInterval(() => {
      checkInactivity();
    }, 3000); // Check every 3 seconds

    // Activity tracking event listeners
    const handleActivity = () => {
      updateActivity();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      if (inactivityTimerRef.current) clearInterval(inactivityTimerRef.current);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, showCompletionCard, currentQuestion, lastActivityTime]);

  // Authentication check
  useEffect(() => {
    const checkAuthentication = () => {
      const authToken = localStorage.getItem('authToken');
      const studentData = localStorage.getItem('studentData');

      if (!authToken || !studentData) {
        router.push('/login');
        return;
      }

      try {
        const parsedData: StudentData = JSON.parse(studentData);
        if (parsedData.memberName && parsedData.schoolName) {
          setIsAuthenticated(true);
        } else {
          router.push('/login');
          return;
        }
      } catch (error) {
        router.push('/login');
        return;
      }

      setLoading(false);
    };

    checkAuthentication();
  }, [router]);

  // Timer countdown effect
  useEffect(() => {
    if (!isAuthenticated || showCompletionCard) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAuthenticated, showCompletionCard, handleSubmitQuiz]);

  // Security measures and fullscreen management
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

    // Copy/Paste detection and violation reporting
    const handleCopyPaste = async (e: Event): Promise<void> => {
      e.preventDefault();

      // Report copy/paste violation
      if (user.user?.teamId && user.user?.memberName) {
        await reportViolation({
          teamId: user.user.teamId,
          memberName: user.user.memberName,
          violationType: 'copy & paste'
        });
      }

      alert("Copy/Paste is disabled during the quiz.");
      logSuspicious(e.type === 'copy' ? 'Copy attempt' : 'Paste attempt',
        `User tried to ${e.type} content on question ${currentQuestion + 1}`);
    };

    // Tab switching detection
    const handleVisibilityChange = async (): Promise<void> => {
      if (document.visibilityState === "hidden") {
        if (user.user?.teamId && user.user?.memberName) {
          await reportViolation({
            teamId: user.user.teamId,
            memberName: user.user.memberName,
            violationType: 'escaping full screen'
          });
        }
        alert("Tab switching detected! Please stay on the quiz page.");
      }
    };

    // Fullscreen detection
    const handleFullScreenChange = (): void => {
      const isFullscreen = !!document.fullscreenElement;
      if (!isFullscreen && !isSubmitting) {
        setShowFullscreenPrompt(true);
        logSuspicious('Fullscreen exit', `User exited fullscreen on question ${currentQuestion + 1}`);
      }
    };

    // Window blur detection
    const handleBlur = (): void => {
      if (!isSubmitting) {
        logSuspicious('Tab switch or window blur', `User left quiz tab on question ${currentQuestion + 1}`);
      }
    };

    // Clipboard operations detection
    const handleClipboardOp = (e: ClipboardEvent) => {
      logSuspicious(`${e.type} attempt`, `User tried to ${e.type} content on question ${currentQuestion + 1}`);
    };

    // Page reload/navigation detection
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      logSuspicious('Page reload or navigation', `User tried to reload or leave the quiz page on question ${currentQuestion + 1}`);
    };

    // Add event listeners
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('copy', handleClipboardOp);
    window.addEventListener('cut', handleClipboardOp);
    window.addEventListener('paste', handleClipboardOp);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('copy', handleClipboardOp);
      window.removeEventListener('cut', handleClipboardOp);
      window.removeEventListener('paste', handleClipboardOp);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAuthenticated, currentQuestion, isSubmitting, user]);

  // Disable right-click and text selection
  useEffect(() => {
    const disableContextMenu = (e: MouseEvent) => e.preventDefault();
    const disableTextSelection = (e: Event) => e.preventDefault();

    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('selectstart', disableTextSelection);

    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('selectstart', disableTextSelection);
    };
  }, []);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Computed values
  const totalQuestions = quizData.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  // Event handlers
  const handleGoToLeaderboard = (): void => {
    setShowCompletionCard(false);
    router.push('/leaderboard');
  };

  const handleAnswerSelect = (answerId: string): void => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerId
    }));
    updateSelectedAnswers(currentQuestion, answerId);
  };

  const handleNext = (): void => {
    setCurrentQuestion((prev) => Math.min(prev + 1, totalQuestions - 1));
  };

  const handleReEnterFullscreen = async (): Promise<void> => {
    setShowFullscreenPrompt(false);

    try {
      const elem = document.documentElement;

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      } else {
        throw new Error('Fullscreen not supported');
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      // Show the prompt again if fullscreen fails
      setTimeout(() => {
        setShowFullscreenPrompt(true);
      }, 1000);
    }
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
            <div className="flex items-center space-x-4">
              <div className="text-m font-medium text-gray-800">
                Question {currentQuestion + 1} of {totalQuestions}
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={20} style={{ color: timerColor }} />
                <span className="text-lg font-bold" style={{ color: timerColor }}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full rounded-full h-3 mb-4 relative" style={{ background: 'rgba(223,117,0,0.1)' }}>
            <div
              className="h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{
                width: `${progress}%`,
                backgroundColor: '#651321'
              }}
            >
              <span
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xs text-white"
                style={{ transform: 'translateX(50%)' }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="my-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              {currentQuestion + 1}. {currentQuestionData?.question ?? 'No question available'}
            </h2>

            {currentQuestionData?.image && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQuestionData.image}
                  alt="Question illustration"
                  className="w-full max-w-[480px] h-64 object-contain rounded-xl shadow-md bg-white"
                  style={{ aspectRatio: '3/2' }}
                />
              </div>
            )}
          </div>

          {/* Answers */}
          <div className="grid gap-4">
            {Array.isArray(currentQuestionData?.answers) && currentQuestionData.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswerSelect(answer.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedAnswer === answer.id
                  ? 'shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                style={selectedAnswer === answer.id ? {
                  borderColor: '#DF7500',
                  backgroundColor: '#DF7500008'
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
                        className="w-40 h-28 object-contain rounded-lg bg-white"
                        style={{ aspectRatio: '10/7' }}
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
                          className="w-24 h-16 object-contain rounded-lg bg-white"
                          style={{ aspectRatio: '3/2' }}
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
          <div className="ml-auto">
            {currentQuestion !== totalQuestions - 1 && (
              <button
                onClick={handleNext}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 text-white hover:opacity-90 shadow-lg hover:shadow-xl ${selectedAnswers[currentQuestion] ? '' : 'bg-gray-400 cursor-not-allowed'}`}
                style={{ backgroundColor: selectedAnswers[currentQuestion] ? '#651321' : '#785158' }}
                disabled={!selectedAnswers[currentQuestion]}
              >
                <span>Next</span>
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Submit Button (appears on last question) */}
        {currentQuestion === totalQuestions - 1 && (
          <div className="mt-6 text-center">
            <button
              className="text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: selectedAnswers[currentQuestion] ? '#651321' : '#785158', cursor: selectedAnswers[currentQuestion] ? 'pointer' : 'not-allowed' }}
              onClick={handleSubmitQuiz}
              disabled={!selectedAnswers[currentQuestion]}
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
                    <div className="font-bold text-2xl text-[#df7500]">{score ? score.toFixed(2) : 'N/A'}%</div>
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
}