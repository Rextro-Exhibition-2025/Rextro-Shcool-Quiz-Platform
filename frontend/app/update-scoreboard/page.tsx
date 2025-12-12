"use client";
import { createAdminApi } from "@/interceptors/admins";
import { SchoolsApiResponse, SchoolTeam } from "@/types/schools";
import { allowedSchools } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, Trophy, AlertCircle, CheckCircle } from "lucide-react";

export default function UpdateScoreboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [schools, setSchools] = useState<SchoolTeam[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [newScore, setNewScore] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const api = await createAdminApi();
        const response = await api.get<SchoolsApiResponse>("/school-teams");
        const filteredSchools = response.data.data.filter((school: SchoolTeam) => 
          allowedSchools.includes(school.schoolName)
        );
        setSchools(filteredSchools);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setError("Failed to load schools");
      }
    };

    if (status === "authenticated") {
      fetchSchools();
    }
  }, [status]);

  const handleUpdateScore = async () => {
    if (!selectedSchool || !newScore) {
      setError("Please select a school and enter a score");
      return;
    }

    const scoreNum = parseInt(newScore);
    if (isNaN(scoreNum)) {
      setError("Please enter a valid number for score");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const api = await createAdminApi();
      await api.post("/quizzes/update-leaderboard-manually", {
        schoolName: selectedSchool,
        newScore: scoreNum,
      });

      setSuccess("Score updated successfully!");
      setNewScore("");
      setSelectedSchool("");
    } catch (error) {
      console.error("Error updating score:", error);
      setError("Failed to update score. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 relative" style={{ backgroundImage: 'url("/Container.png")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.6)', zIndex: 1 }} />
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Update Scoreboard</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#df7500] to-[#651321] flex items-center justify-center mb-3 shadow-lg">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#651321] mb-1">Update Team Scores</h2>
            <p className="text-sm text-[#651321] opacity-80 text-center">Select a school and set their new total score</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <div className="space-y-6">
            {/* School Selection */}
            <div>
              <label htmlFor="schoolSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select School
              </label>
              <select
                id="schoolSelect"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df7500] focus:border-transparent text-[#651321]"
                required
              >
                <option value="" disabled>Select a school</option>
                {schools.map((school) => (
                  <option key={school._id} value={school.schoolName}>
                    {school.schoolName} - {school.teamName} (Current: {school.totalMarks})
                  </option>
                ))}
              </select>
            </div>

            {/* Score Input */}
            <div>
              <label htmlFor="scoreInput" className="block text-sm font-medium text-gray-700 mb-2">
                New Total Score
              </label>
              <input
                type="number"
                id="scoreInput"
                value={newScore}
                onChange={(e) => setNewScore(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#df7500] focus:border-transparent text-[#651321] placeholder-gray-500"
                placeholder="Enter new total score (can be negative)"
                required
              />
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdateScore}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#df7500] to-[#651321] text-white py-3 px-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:shadow-lg hover:scale-[1.02] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5" />
                  Update Score
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/manage-questions")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-white text-[#651321] border border-[#dfd7d0] shadow-sm hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              <ChevronLeft size={18} />
              Back to Manage Questions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
