"use client";
import React, { useEffect, useState } from 'react';

interface Log {
  id: number;
  user: string;
  school: string;
  event: string;
  time: string;
  details: string;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([
    {
      id: 1,
      user: 'student1',
      school: 'School A',
      event: 'Tab switch detected',
      time: '2025-09-21 14:32:10',
      details: 'User switched tabs during quiz.'
    },
    {
      id: 2,
      user: 'student2',
      school: 'School B',
      event: 'Multiple sessions',
      time: '2025-09-21 14:35:22',
      details: 'User logged in from two devices.'
    },
    {
      id: 3,
      user: 'student3',
      school: 'School C',
      event: 'Copy/Paste attempt',
      time: '2025-09-21 14:40:05',
      details: 'User tried to copy quiz content.'
    },
    {
      id: 4,
      user: 'student2',
      school: 'School B',
      event: 'Copy/Paste attempt',
      time: '2025-09-21 14:40:05',
      details: 'User tried to copy quiz content.'
    }
  ]);

  const [selectedUser, setSelectedUser] = useState<Log[] | null>(null);

  const handleRowClick = (user: string) => {
    const userLogs = logs.filter(log => log.user === user);
    setSelectedUser(userLogs);
  };

  const closePopup = () => {
    setSelectedUser(null);
  };

  const uniqueUsers = Array.from(new Set(logs.map(log => log.user))).map(user => {
    const userLogs = logs.filter(log => log.user === user);
    return {
      user,
      school: userLogs[0].school,
      activityCount: userLogs.length
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 relative" style={{ backgroundImage: 'url("/Container.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', zIndex: 1 }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Suspicious Activity Logs</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {uniqueUsers.length === 0 ? (
            <div className="text-center text-gray-500">No logs found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">School</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Activity Count</th>
                </tr>
              </thead>
              <tbody>
                {uniqueUsers.map(({ user, school, activityCount }) => (
                  <tr
                    key={user}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(user)}
                  >
                    <td className="px-4 py-2 text-gray-800 max-w-xs truncate">{user}</td>
                    <td className="px-4 py-2 text-gray-800">{school}</td>
                    <td className="px-4 py-2 text-gray-800">{activityCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold text-[#651321] mb-4">Activities for {selectedUser[0]?.user}</h2>
            <ul className="list-disc pl-5">
              {selectedUser.map((log: Log, index: number) => (
                <li key={index} className="text-[#651321]">
                  <strong>Event:</strong> {log.event} | <strong>Time:</strong> {log.time} | <strong>Details:</strong> {log.details}
                </li>
              ))}
            </ul>
            <button
              onClick={closePopup}
              className="mt-4 px-4 py-2 bg-[#651321] text-white rounded hover:bg-[#851a28] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
