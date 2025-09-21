"use client";
import React from "react";
import { Zap } from "lucide-react";

// Admin session management: fetch sessions, show capacity, add session
import { useState } from "react";



// Custom time input state
const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1);
const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ..., 55

interface AdminSession {
  id: string;
  time: string;
  capacity: number;
  participants: number;
}

export default function AdminSessionMonitor() {
  const [sessions, setSessions] = useState<AdminSession[]>([
    { id: "1", time: "8:30 AM - 9:15 AM", capacity: 300, participants: 120 },
    { id: "2", time: "9:30 AM - 10:15 AM", capacity: 300, participants: 200 },
    { id: "3", time: "11:30 AM - 12:15 PM", capacity: 300, participants: 0 },
    { id: "4", time: "12:30 PM - 1:15 PM", capacity: 300, participants: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [newSession, setNewSession] = useState({ time: "", capacity: 300 });
  const [startHour, setStartHour] = useState(8);
  const [startMinute, setStartMinute] = useState(30);
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endHour, setEndHour] = useState(9);
  const [endMinute, setEndMinute] = useState(15);
  const [endPeriod, setEndPeriod] = useState("AM");

  // Simulate add session (local only)
  function formatTime(hour: number, minute: number, period: string) {
    const h = hour.toString().padStart(2, "0");
    const m = minute.toString().padStart(2, "0");
    return `${h}:${m} ${period}`;
  }

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert to 24h for comparison
    function to24h(hour: number, minute: number, period: string) {
      let h = hour % 12;
      if (period === "PM") h += 12;
      return h * 60 + minute;
    }
    const startTotal = to24h(startHour, startMinute, startPeriod);
    const endTotal = to24h(endHour, endMinute, endPeriod);
    if (startTotal >= endTotal) {
      setError("Start time must be before end time.");
      return;
    }
    const sessionTime = `${formatTime(startHour, startMinute, startPeriod)} - ${formatTime(endHour, endMinute, endPeriod)}`;
    const overlap = sessions.some(s => s.time === sessionTime);
    if (overlap) {
      setError("This time slot already exists.");
      return;
    }
    setError("");
    setAdding(true);
    setTimeout(() => {
      setSessions(prev => [
        ...prev,
        {
          id: (prev.length + 1).toString(),
          time: sessionTime,
          capacity: newSession.capacity,
          participants: 0,
        },
      ]);
  setNewSession({ time: "", capacity: 300 });
  setStartHour(8); setStartMinute(30); setStartPeriod("AM");
  setEndHour(9); setEndMinute(15); setEndPeriod("AM");
      setAdding(false);
    }, 700);
  };

  return (
  <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center px-2 py-8">
      <div className="absolute w-96 h-96 bg-[#df7500]/10 rounded-full blur-3xl animate-pulse left-[-10%] top-[-10%]" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-[#651321]/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-[#df7500]/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '3s' }} />
  <div className="relative z-10 w-full max-w-3xl min-w-[340px] mx-auto bg-white/90 rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#651321] mb-6 text-center">Session Management (Admin)</h1>
        <p className="text-lg text-[#651321] mb-8 text-center">View, add, and monitor session capacities and assignments.</p>
        {error && <div className="bg-red-100 text-red-700 rounded-lg px-4 py-2 mb-4 text-center">{error}</div>}
        <form onSubmit={handleAddSession} className="flex flex-col gap-3 md:flex-row md:gap-2 mb-8 items-center justify-center w-full">
          <div className="flex flex-col md:flex-row gap-2 w-full md:items-center">
            {/* Start Time */}
            <div className="flex gap-1 items-center">
              <select value={startHour} onChange={e => setStartHour(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#df7500] text-[#651321]">
                {hourOptions.map(h => <option key={h} value={h}>{h.toString().padStart(2, "0")}</option>)}
              </select>
              <span className="text-[#651321] font-bold">:</span>
              <select value={startMinute} onChange={e => setStartMinute(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#df7500] text-[#651321]">
                {minuteOptions.map(m => <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>)}
              </select>
              <select value={startPeriod} onChange={e => setStartPeriod(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#df7500] text-[#651321]">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <span className="hidden md:inline text-[#651321] font-bold mx-1">to</span>
            {/* End Time */}
            <div className="flex gap-1 items-center">
              <select value={endHour} onChange={e => setEndHour(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#df7500] text-[#651321]">
                {hourOptions.map(h => <option key={h} value={h}>{h.toString().padStart(2, "0")}</option>)}
              </select>
              <span className="text-[#651321] font-bold">:</span>
              <select value={endMinute} onChange={e => setEndMinute(Number(e.target.value))} className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#df7500] text-[#651321]">
                {minuteOptions.map(m => <option key={m} value={m}>{m.toString().padStart(2, "0")}</option>)}
              </select>
              <select value={endPeriod} onChange={e => setEndPeriod(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-[#df7500] text-[#651321]">
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
            {/* Spots input */}
            <input
              type="number"
              placeholder="Spots"
              value={newSession.capacity}
              min={1}
              max={1000}
              onChange={e => setNewSession(s => ({ ...s, capacity: Number(e.target.value) }))}
              className="w-24 pl-4 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df7500] focus:border-transparent text-[#651321] placeholder-gray-500"
              required
            />
          </div>
          {/* Add button aligned right */}
          <div className="flex w-full justify-end mt-2">
            <button
              type="submit"
              disabled={adding}
              className="bg-gradient-to-r from-[#df7500] to-[#651321] text-white px-4 py-2 min-w-[140px] rounded-lg font-semibold shadow hover:scale-105 transition-all duration-200 disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add Session"}
            </button>
          </div>
        </form>
        {loading ? (
          <div className="text-center text-[#651321]">Loading sessions...</div>
        ) : (
          <div className="flex flex-col gap-6">
            {sessions.length === 0 ? (
              <div className="text-center text-gray-500">No sessions found.</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="group flex items-center justify-between px-6 py-4 rounded-xl border-2 font-semibold text-lg border-[#651321]/10 bg-white"
                >
                  <span className="flex items-center gap-3 text-[#651321]">
                    <Zap className="w-5 h-5 text-[#df7500] group-hover:animate-pulse" />
                    {session.time}
                  </span>
                  <span className="text-sm text-[#df7500] font-bold">
                    {session.participants >= session.capacity ? "Full" : `${session.capacity - session.participants} Spots Left`}
                  </span>
                  <span className="text-xs text-gray-500 ml-4">({session.participants} / {session.capacity} joined)</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
