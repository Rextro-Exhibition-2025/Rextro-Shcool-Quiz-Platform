'use client'
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';
import { useQuiz } from '@/contexts/QuizContext';

const page = () => {
  const router = useRouter();
  const { socket } = useSocket();
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
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
    setSelectedOption(option.option);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (currentQuestion && startTimeRef.current) {
      const timeSpent = Number(((performance.now() - startTimeRef.current) / 1000).toFixed(3));
      // Fix: use option.optionText and option.optionImage directly from the selected option
      setLastResult({
        timeSpent,
        optionId: option.option,
        optionText: option.optionText || '',
        optionImage: option.optionImage ? option.optionImage : undefined,
        questionText: currentQuestion.question,
        questionImage: currentQuestion.questionImage,
      });
      submitQuestion({ questionId: currentQuestion._id, answer: option.option, timeSpent });
    }
    setTimeout(() => setCurrentQuestion(null), 100); // Hide question after short delay
  };

  return (
    <div className='min-h-screen bg-white text-black p-8'>
      <h1 className='text-2xl font-bold mb-6'>Answer Realtime Questions</h1>
      <button
        onClick={() => router.push('/leaderboard')}
        className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200"
        style={{ backgroundColor: '#651321' }}
      >
        Go to Leaderboard
      </button>
      {currentQuestion ? (
        <div className='border rounded-lg p-6 bg-gray-50 shadow-md mb-4'>
          <h2 className='text-xl font-semibold mb-4'>{currentQuestion.question}</h2>
          {currentQuestion.questionImage && (
            <div className='mb-4'>
              <img
                src={currentQuestion.questionImage}
                alt='Question'
                className='max-w-xs max-h-60 rounded border shadow mb-2'
              />
            </div>
          )}
          <div className='mb-4 text-lg font-mono text-blue-700'>Time: {timer.toFixed(3)} s</div>
          <ul className='mb-2'>
            {currentQuestion.options && currentQuestion.options.map((opt: any) => (
              <li key={opt._id} className={`mb-4 flex items-center cursor-pointer ${selectedOption === opt._id ? 'bg-blue-100 border-blue-500' : ''} border rounded p-2`} onClick={() => handleSelect(opt)}>
                <input
                  type='radio'
                  name='answer'
                  checked={selectedOption === opt._id}
                  onChange={() => handleSelect(opt)}
                  className='mr-2 accent-blue-600'
                />
                <span className='font-semibold mr-2'>{opt.option}:</span>
                <span className='mr-2'>{opt.optionText}</span>
                {opt.optionImage && (
                  <img
                    src={opt.optionImage}
                    alt={`Option ${opt.option}`}
                    className='max-w-[100px] max-h-[60px] rounded border shadow ml-2'
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : lastResult ? (
        <div className='border rounded-lg p-6 bg-green-50 shadow-md mb-4'>
          <h2 className='text-xl font-semibold mb-4 text-green-700'>Answer Submitted!</h2>
          <div className='mb-2 text-lg'>Question: <span className='font-semibold'>{lastResult.questionText}</span></div>
          {lastResult.questionImage && (
            <div className='mb-2'>
              <img
                src={lastResult.questionImage}
                alt='Question'
                className='max-w-xs max-h-60 rounded border shadow mb-2'
              />
            </div>
          )}
          <div className='mb-2 text-lg'>Time Spent: <span className='font-mono text-blue-700'>{lastResult.timeSpent.toFixed(3)} s</span></div>
          <div className='mb-2 text-lg'>Selected Answer: <span className='font-semibold'>{lastResult.optionText}</span></div>
          {lastResult.optionImage && (
            <div className='mb-2'>
              <img
                src={lastResult.optionImage}
                alt='Selected Option'
                className='max-w-[100px] max-h-[60px] rounded border shadow mb-2'
              />
            </div>
          )}
        </div>
      ) : (
        <div className='text-gray-500'>Waiting for a question...</div>
      )}
    </div>
  );
}

export default page