"use client";
import React, { useState, useEffect } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Dummy data for demonstration. Replace with API call in production.
const DUMMY_QUESTIONS = [
  {
    id: "1",
    question: "What is the capital of France?",
    quizSet: "set1",
    answers: [
      { id: "a", text: "Paris" },
      { id: "b", text: "London" },
      { id: "c", text: "Berlin" },
      { id: "d", text: "Madrid" }
    ],
    correctAnswer: "a"
  },
  {
    id: "2",
    question: "Which planet is known as the Red Planet?",
    quizSet: "set2",
    answers: [
      { id: "a", text: "Earth" },
      { id: "b", text: "Mars" },
      { id: "c", text: "Jupiter" },
      { id: "d", text: "Venus" }
    ],
    correctAnswer: "b"
  }
];

export default function ManageQuestions() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [questions, setQuestions] = useState(DUMMY_QUESTIONS);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df7500]"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-question?id=${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 relative" style={{ backgroundImage: 'url("/Container.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', zIndex: 1 }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Manage Questions</h1>
          <button
            onClick={() => router.push("/add-question")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
          >
            <Plus size={18} /> Add New Question
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {questions.length === 0 ? (
            <div className="text-center text-gray-500">No questions found.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quiz Set</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-800 max-w-xs truncate">{q.question}</td>
                    <td className="px-4 py-2 text-gray-600">{q.quizSet}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(q.id)}
                        className="bg-gradient-to-r from-[#df7500] to-[#651321] text-white px-3 py-1 rounded-lg font-semibold flex items-center gap-1 shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
                        title="Edit"
                      >
                        <Edit size={16} /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
