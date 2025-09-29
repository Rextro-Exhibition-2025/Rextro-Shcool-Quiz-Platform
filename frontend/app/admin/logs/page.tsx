"use client";
import React, { useEffect, useState } from 'react';

export default function AdminLogsPage() {
  // Dummy suspicious activity log data
  const [logs, setLogs] = useState([
    {
      id: 1,
      user: 'student1',
      event: 'Tab switch detected',
      time: '2025-09-21 14:32:10',
      details: 'User switched tabs during quiz.'
    },
    {
      id: 2,
      user: 'student2',
      event: 'Multiple sessions',
      time: '2025-09-21 14:35:22',
      details: 'User logged in from two devices.'
    },
    {
      id: 3,
      user: 'student3',
      event: 'Copy/Paste attempt',
      time: '2025-09-21 14:40:05',
      details: 'User tried to copy quiz content.'
    }
  ]);

  return (
    <div
      className="min-h-screen bg-gradient-to-br p-8 relative"
      style={{
        backgroundImage: 'url("/Container.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
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
      {/* Topic Heading */}
      <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <h1 className="text-3xl font-extrabold text-[#651321] text-center mb-10 drop-shadow-lg tracking-wide">Suspicious Activity Logs</h1>
      </div>
      {/* Tiles/Card Layout */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8" style={{ position: 'relative', zIndex: 2 }}>
        {logs.map(log => (
          <div
            key={log.id}
            className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-2 border-2 border-[#651321] hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-[#651321] text-lg">{log.user}</span>
              <span className="ml-auto text-xs text-gray-500">{log.time}</span>
            </div>
            <div className="font-semibold text-orange-700 mb-1">{log.event}</div>
            <div className="text-gray-700 text-sm">{log.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
