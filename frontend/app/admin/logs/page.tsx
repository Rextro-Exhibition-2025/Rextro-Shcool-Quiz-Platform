"use client";
import React, { useState } from 'react';

interface Violation {
  teamId: string;
  memberName: string;
  violationType: 'copy & paste' | 'escaping full screen';
  createdAt: string;
  updatedAt: string;
}

interface TeamSummary {
  teamId: string;
  members: string[];
  violationCount: number;
}

export default function AdminLogsPage() {
  const [violations] = useState<Violation[]>([
    {
      teamId: 'team1',
      memberName: 'John Doe',
      violationType: 'copy & paste',
      createdAt: '2025-10-10T14:32:00Z',
      updatedAt: '2025-10-10T14:32:00Z'
    },
    {
      teamId: 'team2',
      memberName: 'Jane Smith',
      violationType: 'escaping full screen',
      createdAt: '2025-10-11T10:15:00Z',
      updatedAt: '2025-10-11T10:15:00Z'
    },
    {
      teamId: 'team3',
      memberName: 'Alice Johnson',
      violationType: 'copy & paste',
      createdAt: '2025-10-12T09:45:00Z',
      updatedAt: '2025-10-12T09:45:00Z'
    },
    {
      teamId: 'team2',
      memberName: 'Alice Doe',
      violationType: 'copy & paste',
      createdAt: '2025-10-12T09:45:00Z',
      updatedAt: '2025-10-12T09:45:00Z'
    },
    {
      teamId: 'team2',
      memberName: 'Alice Doe',
      violationType: 'copy & paste',
      createdAt: '2025-10-12T09:45:00Z',
      updatedAt: '2025-10-12T09:45:00Z'
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<Violation[] | null>(null);

  const teamSummaries: TeamSummary[] = Object.values(
    violations.reduce((acc, violation) => {
      if (!acc[violation.teamId]) {
        acc[violation.teamId] = {
          teamId: violation.teamId,
          members: new Set(),
          violationCount: 0
        };
      }
      acc[violation.teamId].members.add(violation.memberName);
      acc[violation.teamId].violationCount++;
      return acc;
    }, {} as Record<string, { teamId: string; members: Set<string>; violationCount: number }>))
    .map(({ teamId, members, violationCount }) => ({
      teamId,
      members: Array.from(members),
      violationCount
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4 relative" style={{ backgroundImage: 'url("/Container.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', zIndex: 1 }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Violation Logs</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {teamSummaries.length === 0 ? (
            <div className="text-center text-gray-500">No violations found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Team ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Violation Count</th>
                </tr>
              </thead>
              <tbody>
                {teamSummaries.map((team) => (
                  <tr
                    key={team.teamId}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedTeam(violations.filter((v) => v.teamId === team.teamId))}
                  >
                    <td className="px-4 py-2 text-gray-800 max-w-xs truncate">{team.teamId}</td>
                    <td className="px-4 py-2 text-gray-800">{team.members.join(', ')}</td>
                    <td className="px-4 py-2 text-gray-800">{team.violationCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
            <div className="mb-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#df7500] to-[#651321] shadow-lg">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent mb-1">Team Details</h2>
            </div>
            {Object.entries(
              selectedTeam.reduce((acc, violation) => {
                if (!acc[violation.memberName]) {
                  acc[violation.memberName] = [];
                }
                acc[violation.memberName].push(violation);
                return acc;
              }, {} as Record<string, Violation[]>)
            ).map(([memberName, memberViolations]) => (
              <div key={memberName} className="mb-4">
                <h3 className="font-semibold text-gray-800">{memberName}</h3>
                <ul className="list-disc pl-5 text-gray-600">
                  {memberViolations.map((violation, index) => (
                    <li key={index}>
                      <strong>Violation:</strong> {violation.violationType} <br />
                      <strong>Created At:</strong> {new Date(violation.createdAt).toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setSelectedTeam(null)}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                style={{ minWidth: 120 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
