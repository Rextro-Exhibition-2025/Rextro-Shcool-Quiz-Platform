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
      {/* Table Card */}
      <div className="max-w-4xl mx-auto bg-white/90 rounded-2xl shadow-2xl overflow-hidden" style={{ position: 'relative', zIndex: 2 }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#651321] text-white">
                <th className="py-3 px-4 text-left font-semibold">User</th>
                <th className="py-3 px-4 text-left font-semibold">Event</th>
                <th className="py-3 px-4 text-left font-semibold">Time</th>
                <th className="py-3 px-4 text-left font-semibold">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr
                  key={log.id}
                  className="group hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <td className="py-2 px-4 border-b border-gray-100 text-gray-800 group-hover:text-orange-600 font-semibold transition-colors">
                    {log.user}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-100 text-gray-800">{log.event}</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-gray-800">{log.time}</td>
                  <td className="py-2 px-4 border-b border-gray-100 text-gray-800">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
