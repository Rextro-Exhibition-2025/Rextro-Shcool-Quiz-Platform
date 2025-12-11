'use client';
import { createAdminApi } from '@/interceptors/admins';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@/contexts/SocketContext';
import { Question } from '../add-question/page';

const page = () => {
    const [questions, setQuestions] = useState<any>();
    const [scrollY, setScrollY] = useState(0);
    const [timer, setTimer] = useState<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const { socket } = useSocket();

    useEffect(() => {
        const fetchQuestions = async () => {
            const api = await createAdminApi();
            try {
                const response = await api.get('/quizzes/9');
                setQuestions(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };
        fetchQuestions();
    }, []);

    const handlePublish = async (question: Question) => {


        if (socket) {

            socket.emit('publish_question', { question });
        }
        // Start timer when publishing (countdown from 120 seconds)
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimer(120);
        intervalRef.current = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };


    const handleUnpublish = async () => {


        if (socket) {

            socket.emit('unpublish_question');
        }
        // Stop timer when unpublishing
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTimer(0);

    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br p-4 relative"
            style={{
                backgroundImage: 'url("/Container.png")',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: `center ${50 + scrollY * 0.1}%`,
                backgroundAttachment: 'fixed'
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
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Realtime Questions</h1>
                        <div className="flex items-center space-x-4">
                            <div className={`text-lg font-mono ${timer <= 30 ? 'text-red-500' : ''} ${timer <= 0 ? 'animate-pulse' : ''}`} style={{ color: timer > 30 ? '#651321' : undefined }}>
                                Time: {Math.floor(timer / 60).toString().padStart(2, '0')}:{Math.floor(timer % 60).toString().padStart(2, '0')}
                            </div>
                            <button
                                className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl active:scale-95 active:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-red-600"
                                style={{ backgroundColor: '#dc2626' }}
                                onClick={() => handleUnpublish()}
                            >
                                Unpublish
                            </button>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                {questions && questions.quiz && questions.quiz.questions && questions.quiz.questions.length > 0 ? (
                    <div className="space-y-6">
                        {questions.quiz.questions.map((q: any, idx: number) => (
                            <div key={q._id} className="bg-white rounded-2xl shadow-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="bg-[#651321] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </span>
                                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                                                {q.question}
                                            </h3>
                                        </div>

                                        {q.questionImage && (
                                            <div className="mb-4 flex justify-center">
                                                <img
                                                    src={q.questionImage}
                                                    alt="Question illustration"
                                                    className="w-full max-w-2xl h-auto object-contain rounded-xl shadow-md bg-white"
                                                    style={{ maxHeight: '300px' }}
                                                />
                                            </div>
                                        )}

                                        <div className="grid gap-3">
                                            {q.options.map((opt: any) => (
                                                <div key={opt._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-semibold text-[#651321] min-w-[24px]">
                                                        {opt.option}:
                                                    </span>
                                                    <span className="text-gray-700">{opt.optionText}</span>
                                                    {opt.optionImage && (
                                                        <img
                                                            src={opt.optionImage}
                                                            alt={`Option ${opt.option}`}
                                                            className="w-16 h-16 object-contain rounded border shadow-sm"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="ml-6">
                                        <button
                                            className="px-6 py-3 rounded-xl font-medium text-white shadow-lg hover:shadow-xl active:scale-95 active:shadow-md transition-all duration-200 cursor-pointer hover:scale-105 hover:bg-red-800"
                                            style={{ backgroundColor: '#651321' }}
                                            onClick={() => handlePublish(q)}
                                        >
                                            Publish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <div className="text-gray-500 text-lg">No questions found.</div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default page