'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { Check } from 'lucide-react';

const page = () => {
  const router = useRouter();
  const { socket } = useSocket();
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<any | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [lastResult, setLastResult] = useState<{
    timeSpent: number;
    optionId: string;
    optionText: string;
    optionImage?: string;
    questionText?: string;
    questionImage?: string;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<number>(0);
  const {  submitQuestion } = useQuiz(); 

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log('Connected to Socket.io server with ID:', socket.id);
    };
    const onDisconnect = () => {
      console.log('Disconnected from Socket.io server');
    };
    const onNewQuestion = (data: any) => {
      setLastResult(null);
      console.log('New question published:', data);
      setCurrentQuestion(data);
      setSelectedOption(null); // Reset selection for new question
      timerRef.current = 120;
      setTimer(120);
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        timerRef.current -= 0.01;
        if (timerRef.current <= 0) {
          timerRef.current = 0;
          setTimer(0);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = null;
        } else {
          setTimer(Number(timerRef.current.toFixed(3)));
        }
      }, 10); // update every 10ms for better accuracy
    };

    const onUnpublishQuestion = () => {
      setLastResult(null);
      setCurrentQuestion(null);
      setSelectedOption(null);
      setTimer(0);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_question_published', onNewQuestion);
    socket.on('unpublish_current_question', onUnpublishQuestion);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_question_published', onNewQuestion);
      socket.off('unpublish_current_question', onUnpublishQuestion);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [socket]);

  const handleSelect = (option: any) => {
    // if (selectedOption && selectedOption._id === option._id) {
    //   handleSubmit();
    // } else 
      setSelectedOption(option);
    
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const timeSpent = 120 - timerRef.current;
    setLastResult({
      timeSpent,
      optionId: selectedOption.option,
      optionText: selectedOption.optionText || '',
      optionImage: selectedOption.optionImage ? selectedOption.optionImage : undefined,
      questionText: currentQuestion.question,
      questionImage: currentQuestion.questionImage,
    });
    submitQuestion({ questionId: currentQuestion._id, answer: selectedOption.option, timeSpent });
    setTimeout(() => setCurrentQuestion(null), 100); // Hide question after short delay
  };

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
        {/* Header */}


        {/* Question Card */}
        {currentQuestion ? (
          <div className="bg-white rounded-xl shadow-lg p-3 mb-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-3 whitespace-pre-line">
              {currentQuestion.question.split('///').join('\n')}
            </h2>

            {currentQuestion.questionImage && (
              <div className="mb-3 flex justify-center">
                <img
                  src={currentQuestion.questionImage}
                  alt="Question illustration"
                  className="w-full max-w-xl h-auto object-contain rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
                  style={{ maxHeight: '200px' }}
                />
              </div>
            )}

            <div className={`mb-3 text-sm font-mono ${timer <= 30 ? 'text-red-500' : ''} ${timer <= 0 ? 'animate-pulse' : ''}`} style={{ color: timer > 30 ? '#651321' : undefined }}>
              Time: {Math.floor(timer / 60).toString().padStart(2, '0')}:{Math.floor(timer % 60).toString().padStart(2, '0')}
            </div>

            {/* s */}
            <div className="grid gap-2">
              {currentQuestion.options && currentQuestion.options.map((opt: any) => (
                <button
                  key={opt._id}
                  onClick={() => handleSelect(opt)}
                  className={`p-2 rounded-lg border-2 transition-all duration-200 text-left ${selectedOption && selectedOption._id === opt._id
                    ? 'shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  style={selectedOption && selectedOption._id === opt._id ? {
                    borderColor: '#DF7500',
                    backgroundColor: '#DF7500008'
                  } : {}}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selectedOption && selectedOption._id === opt._id
                        ? 'text-white'
                        : 'border-gray-300'
                        }`}
                      style={selectedOption && selectedOption._id === opt._id ? {
                        borderColor: '#DF7500',
                        backgroundColor: '#DF7500'
                      } : {}}
                    >
                      {selectedOption && selectedOption._id === opt._id && (
                        <Check size={16} className="text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      {opt.optionImage && !opt.optionText && (
                        <img
                          src={opt.optionImage}
                          alt={`Option ${opt.option}`}
                          className="w-full max-w-md h-auto object-contain rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer mx-auto"
                          style={{ maxHeight: '150px' }}
                        />
                      )}

                      {opt.optionText && !opt.optionImage && (
                        <span className="text-gray-800 font-medium text-sm whitespace-pre-line">
                          {opt.optionText.split('///').join('\n')}
                        </span>
                      )}

                      {opt.optionText && opt.optionImage && (
                        <div className="flex flex-col md:flex-row items-center md:space-x-3 space-y-2 md:space-y-0">
                          <img
                            src={opt.optionImage}
                            alt={`Option ${opt.option}`}
                            className="w-full md:w-48 h-auto object-contain rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            style={{ maxHeight: '120px' }}
                          />
                          <span className="text-gray-800 font-medium text-sm whitespace-pre-line">
                            {opt.optionText.split('///').join('\n')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <div className="mt-3 flex justify-start">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`px-4 py-2 rounded-lg font-medium text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 ${
                  selectedOption ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: selectedOption ? '#651321' : '#ccc' }}
              >
                Submit Answer
              </button>
            </div>

            {/* Exit Button */}
            <div className="mt-6 flex justify-start">
              {/* <button
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#651321' }}
              >
                Exit
              </button> */}
            </div>
          </div>
        ) : lastResult ? (
          <div className="bg-white rounded-xl shadow-lg p-3 mb-3">
            <div className="text-center mb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#651321] mb-2">Answer Submitted ! Wait for the next question</h2>
            </div>

            <div className="flex flex-col gap-2 max-w-2xl mx-auto mb-3">
              <div className="bg-white/50 rounded-lg p-2">
                <div className="text-xs text-gray-600">Question</div>
                <div className="font-semibold text-sm text-[#651321] whitespace-pre-line">{lastResult.questionText?.split('///').join('\n')}</div>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <div className="text-xs text-gray-600">Time Spent</div>
                <div className="font-bold text-lg text-[#df7500]">{lastResult.timeSpent.toFixed(3)} s</div>
              </div>
            </div>

            {lastResult.questionImage && (
              <div className="mb-3 flex justify-center">
                <img
                  src={lastResult.questionImage}
                  alt="Question illustration"
                  className="w-full max-w-xl h-auto object-contain rounded-lg shadow-md bg-white"
                  style={{ maxHeight: '150px' }}
                />
              </div>
            )}

            <div className="text-center">
              <div className="bg-white/50 rounded-lg p-2 inline-block">
                <div className="text-xs text-gray-600">Selected Answer</div>
                <div className="font-semibold text-[#651321] text-sm whitespace-pre-line">{lastResult.optionText.split('///').join('\n')}</div>
                {lastResult.optionImage && (
                  <img
                    src={lastResult.optionImage}
                    alt="Selected Option"
                    className="w-full max-w-xs h-auto object-contain rounded-lg bg-white shadow-md mt-1"
                    style={{ maxHeight: '120px' }}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-gray-500 text-lg">Waiting for a question...</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default page