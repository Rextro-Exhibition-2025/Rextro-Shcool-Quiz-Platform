"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Trash2 } from "lucide-react";
import { createAdminApi } from "@/interceptors/admins";
import transformQuizApiQuestion from "../manage-questions/questionTransformer";
import { Question, QuestionApiResponse } from "@/types/quiz";
import { transformQuestionToApi } from "./questionTransformer";
// Error modal state for alerts
type ErrorModalState = { open: boolean; message: string };



// Dummy fetch function for demonstration
const fetchQuestionById = async (id: string): Promise<Question | null> => {
  // Replace with real API call
  if (id === "1") {
    return {
      id: "1",
      question: "What is the capital of France?",
      image: "",
      answers: [
        { id: "a", text: "Paris", image: "" },
        { id: "b", text: "London", image: "" },
        { id: "c", text: "Berlin", image: "" },
        { id: "d", text: "Madrid", image: "" }
      ],
      correctAnswer: "a",
      quizSet: "set1"
    };
  }
  return null;
};

export default function EditQuestionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState<ErrorModalState>({ open: false, message: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const questionId = searchParams.get("id");
  console.log(questionId);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {

    console.log("use effect running");



    const getQuestionById = async (id: string) => {

      const api = await createAdminApi();
      try {



        const response = await api.get(`/questions/${id}`);
        console.log(response.data);

        setQuestion(transformQuizApiQuestion((response?.data as { data: QuestionApiResponse; success: boolean }).data));
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      getQuestionById(questionId);
    } else {
      setLoading(false);
    }

  }, [questionId]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#df7500]"></div>
      </div>
    );
  }

  if (!question) {
    return <div className="text-center mt-10 text-gray-500">Question not found.</div>;
  }

  // Validation and save logic (copied from Add Question)
  const handleSave = async (): Promise<void> => {
    if (!question) return;
    if (!question.question.trim()) {
      setErrorModal({ open: true, message: 'Please enter a question.' });
      return;
    }
    const hasValidAnswers = question.answers.some(answer => answer?.text?.trim() || answer?.image?.trim());
    if (!hasValidAnswers) {
      setErrorModal({ open: true, message: 'Please provide at least one answer option.' });
      return;
    }
    if (!question.correctAnswer) {
      setErrorModal({ open: true, message: 'Please select the correct answer.' });
      return;
    }
    // Validate that the selected correct answer is not empty
    const correct = question.answers.find(a => a.id === question.correctAnswer);
    if (!correct || (!correct?.text?.trim() && !correct?.image?.trim())) {
      setErrorModal({ open: true, message: 'The selected correct answer must have text or image.' });
      return;
    }
    if (!question.quizSet) {
      setErrorModal({ open: true, message: 'Please select a quiz set.' });
      return;
    }
    // Here you would typically send the data to your backend
    setShowSaveConfirm(true);


    try {
      const api = await createAdminApi();
      console.log(question);
      const transformedQuestion = transformQuestionToApi(question);
      console.log(transformedQuestion);
      console.log(question.id);


      await api.put(`/questions/${question.id}`, transformedQuestion);
      router.push("/manage-questions");

    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  // Delete logic
  const handleDelete = () => {
    // TODO: Replace with real delete logic
    setShowDeleteConfirm(false);
    setTimeout(() => {
      router.push("/manage-questions");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 relative" style={{ backgroundImage: 'url("/Container.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      {/* Error Modal for Alerts */}
      {errorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
            <div className="mb-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#df7500] to-[#651321] shadow-lg">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent mb-1">Alert</h2>
              <p className="text-[#651321]">{errorModal.message}</p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setErrorModal({ open: false, message: '' })}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                style={{ minWidth: 120 }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Popup */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
            <div className="mb-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-800 shadow-lg">
                <Trash2 size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent mb-1">Delete Question?</h2>
              <p className="text-[#651321]">Are you sure you want to delete this question? This action cannot be undone.</p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-gray-200 to-gray-400 text-[#651321] shadow hover:scale-105 hover:shadow transition-all duration-200 border border-gray-300"
                style={{ minWidth: 100 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-red-800 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                style={{ minWidth: 100 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Save Confirmation Popup */}
      {showSaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full border-2 border-[#df7500]">
            <div className="mb-4 text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center bg-gradient-to-r from-[#df7500] to-[#651321] shadow-lg">
                <Save size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#df7500] to-[#651321] bg-clip-text text-transparent mb-1">Question Saved!</h2>
              <p className="text-[#651321]">Your changes have been saved successfully.</p>
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowSaveConfirm(false)}
                className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
                style={{ minWidth: 120 }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', zIndex: 1 }} />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Edit Question</h1>
            <div className="flex items-center ml-auto space-x-2">
              <button
                onClick={() => router.push("/manage-questions")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#df7500] to-[#651321] text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-red-800 text-white shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
        {/* ...existing code... */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Question Details</h2>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Set *</label>
            <select
              value={question.quizSet}
              disabled
              aria-disabled="true"
              className="w-full p-4 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
            >
              <option value="">Select a quiz set</option>
              <option value="set1">Set 1</option>
              <option value="set2">Set 2</option>
              <option value="set3">Set 3</option>
              <option value="set4">Set 4</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
            <textarea
              value={question.question}
              onChange={e => setQuestion(q => q ? { ...q, question: e.target.value } : q)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 resize-none placeholder-gray-400 text-gray-800 font-medium text-left shadow-sm focus:shadow-md"
              rows={3}
              placeholder="Enter your question here..."
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Question Image URL (Optional)</label>
            <input
              type="url"
              value={question.image}
              onChange={e => setQuestion(q => q ? { ...q, image: e.target.value } : q)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
              placeholder="https://example.com/image.jpg"
            />
            {question.image && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <img src={question.image} alt="Question preview" className="max-w-md w-full h-auto rounded-lg shadow-md border border-gray-200" />
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Answer Options</h2>
          <div className="space-y-4">
            {question.answers.map((answer, index) => (
              <div key={answer.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Option {answer.id.toUpperCase()}</label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={answer.id}
                      checked={question.correctAnswer === answer.id}
                      onChange={() => setQuestion(q => q ? { ...q, correctAnswer: answer.id } : q)}
                      className="text-[#df7500] focus:ring-[#df7500]"
                    />
                    <span className="text-sm text-gray-600">Correct Answer</span>
                  </label>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={answer?.text || ""}
                    onChange={e => setQuestion(q => q ? { ...q, answers: q.answers.map((a, i) => i === index ? { ...a, text: e.target.value } : a) } : q)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
                    placeholder={`Enter text for option ${answer.id.toUpperCase()}`}
                  />
                </div>
                <div>
                  <input
                    type="url"
                    value={answer?.image || ""}
                    onChange={e => setQuestion(q => q ? { ...q, answers: q.answers.map((a, i) => i === index ? { ...a, image: e.target.value } : a) } : q)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-[#df7500] focus:ring-2 focus:ring-[#df7500]/20 focus:outline-none hover:border-gray-300 hover:bg-gray-50 focus:bg-[#df7500]/5 transition-all duration-200 placeholder-gray-400 text-gray-800 font-medium shadow-sm focus:shadow-md"
                    placeholder={`Image URL for option ${answer.id.toUpperCase()} (optional)`}
                  />
                  {answer.image && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Preview:</p>
                      <img src={answer.image} alt={`Option ${answer.id} preview`} className="w-24 h-20 object-cover rounded-lg shadow-sm border border-gray-200" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Save button moved to top bar */}
        </div>
      </div>
    </div>
  );
}
