'use client';
import { createAdminApi } from '@/interceptors/admins';
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';

const page = () => {
    const [questions, setQuestions] = useState<any>();
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

    const handlePublish = async (questionId: string) => {
        console.log("publishing");
        
        if (socket) {
            console.log('Publishing question with ID:', questionId);
            socket.emit('publish_question', { questionId });
        }
        // alert(`Publish question with ID: ${questionId}`);
    };

    return (
        <div className='min-h-screen bg-white text-black p-8'>
            <h1 className='text-2xl font-bold mb-6'>Realtime Questions</h1>
            {questions && questions.quiz && questions.quiz.questions && questions.quiz.questions.length > 0 ? (
                <table className='min-w-full border border-gray-300 rounded-lg overflow-hidden'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='px-4 py-2 border'>#</th>
                            <th className='px-4 py-2 border'>Question</th>
                            <th className='px-4 py-2 border'>Options</th>
                            <th className='px-4 py-2 border'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.quiz.questions.map((q: any, idx: number) => (
                            <tr key={q._id} className='border-t'>
                                <td className='px-4 py-2 border text-center'>{idx + 1}</td>
                                <td className='px-4 py-2 border'>{q.question}</td>
                                <td className='px-4 py-2 border'>
                                    <ul>
                                        {q.options.map((opt: any) => (
                                            <li key={opt._id}>
                                                <span className='font-semibold mr-2'>{opt.option}:</span>
                                                {opt.optionText}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className='px-4 py-2 border text-center'>
                                    <button
                                        className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow'
                                        onClick={() => handlePublish(q._id)}
                                    >
                                        Publish
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className='text-gray-500'>No questions found.</div>
            )}
        </div>
    );
}

export default page