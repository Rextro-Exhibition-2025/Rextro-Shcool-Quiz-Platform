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
  const startTimeRef = useRef<number | null>(null);
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
      setTimer(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      startTimeRef.current = performance.now();
      intervalRef.current = setInterval(() => {
        setTimer(Number(((performance.now() - (startTimeRef.current || performance.now())) / 1000).toFixed(3)));
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
    if (selectedOption && selectedOption._id === option._id) {
      handleSubmit();
    } else {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion || !startTimeRef.current) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const timeSpent = Number(((performance.now() - startTimeRef.current) / 1000).toFixed(3));
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
        <div className="sticky top-0 z-10 bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Answer Realtime Questions</h1>
            <button
              onClick={() => router.push('/leaderboard')}
              className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#651321' }}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {/* Question Card */}
        {currentQuestion ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            {currentQuestion.questionImage && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQuestion.questionImage}
                  alt="Question illustration"
                  className="w-full max-w-2xl h-auto object-contain rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white"
                  style={{ maxHeight: '400px' }}
                />
              </div>
            )}

            <div className="mb-6 text-lg font-mono" style={{ color: '#651321' }}>
              Time: {timer.toFixed(3)} s
            </div>

            {/* Answers */}
            <div className="grid gap-4">
              {currentQuestion.options && currentQuestion.options.map((opt: any) => (
                <button
                  key={opt._id}
                  onClick={() => handleSelect(opt)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedOption && selectedOption._id === opt._id
                    ? 'shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  style={selectedOption && selectedOption._id === opt._id ? {
                    borderColor: '#DF7500',
                    backgroundColor: '#DF7500008'
                  } : {}}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedOption && selectedOption._id === opt._id
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
                          className="w-full max-w-2xl h-auto object-contain rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer mx-auto"
                          style={{ maxHeight: '400px' }}
                        />
                      )}

                      {opt.optionText && !opt.optionImage && (
                        <span className="text-gray-800 font-medium text-lg">
                          {opt.optionText}
                        </span>
                      )}

                      {opt.optionText && opt.optionImage && (
                        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-3 md:space-y-0">
                          <img
                            src={opt.optionImage}
                            alt={`Option ${opt.option}`}
                            className="w-full md:w-96 h-auto object-contain rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                            style={{ maxHeight: '300px' }}
                          />
                          <span className="text-gray-800 font-medium text-lg">
                            {opt.optionText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            {/* <div className="mt-6 flex justify-start">
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200 ${
                  selectedOption ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
                }`}
                style={{ backgroundColor: selectedOption ? '#651321' : '#ccc' }}
              >
                Submit Answer
              </button>
            </div> */}

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
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#df7500] to-[#651321] rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#651321] mb-4">Answer Submitted ! Wait for the next question</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
              <div className="bg-white/50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Question</div>
                <div className="font-semibold text-[#651321]">{lastResult.questionText}</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Time Spent</div>
                <div className="font-bold text-2xl text-[#df7500]">{lastResult.timeSpent.toFixed(3)} s</div>
              </div>
            </div>

            {lastResult.questionImage && (
              <div className="mb-6 flex justify-center">
                <img
                  src={lastResult.questionImage}
                  alt="Question illustration"
                  className="w-full max-w-2xl h-auto object-contain rounded-xl shadow-md bg-white"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            )}

            <div className="text-center">
              <div className="bg-white/50 rounded-lg p-4 inline-block">
                <div className="text-sm text-gray-600">Selected Answer</div>
                <div className="font-semibold text-[#651321] text-lg">{lastResult.optionText}</div>
                {lastResult.optionImage && (
                  <img
                    src={lastResult.optionImage}
                    alt="Selected Option"
                    className="w-full max-w-xs h-auto object-contain rounded-lg bg-white shadow-md mt-2"
                    style={{ maxHeight: '200px' }}
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