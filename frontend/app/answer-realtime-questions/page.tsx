'use client'
import React, { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';

const page = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log('Connected to Socket.io server with ID:', socket.id);
    };
    const onDisconnect = () => {
      console.log('Disconnected from Socket.io server');
    };
    const onNewQuestion = (data: any) => {
      console.log('New question published:', data);
      alert(`New question published: ${data.question}`);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_question_published', onNewQuestion);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_question_published', onNewQuestion);
    };
  }, [socket]);

  return (
    <div className='min-h-screen bg-white text-black'>Answer Realtime Questions</div>
  )
}

export default page