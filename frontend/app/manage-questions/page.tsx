"use client";
import { createAdminApi } from "@/interceptors/admins";
import { QuestionApiResponse, QuestionItem, QuizApiResponse } from "@/types/quiz";
import { Tab } from "@headlessui/react";
import { Edit, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { transformQuizApiQuestions } from "./questionTransformer";


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
	const [questions, setQuestions] = useState<QuestionItem[]>();
	const [selectedQuizSet, setSelectedQuizSet] = useState("set1");
	useEffect(() => {

		const fetchQuestions = async () => {
			const api = await createAdminApi();
			try {
				const response = await api.get('/questions');
				setQuestions(transformQuizApiQuestions((response?.data as { data: QuestionApiResponse[], success: boolean }).data));

			} catch (error) {
				console.error('Error fetching questions:', error);
			}
		}

		fetchQuestions();
	}, []);


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
			setQuestions((prev) => prev?.filter((q) => q.id !== id));
		}
	};

	const handleEdit = (id: string) => {
		router.push(`/edit-question?id=${id}`);
	};

	const filteredQuestions = questions?.filter(
		(q) => q.quizSet === selectedQuizSet
	);

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
				<Tab.Group onChange={(index: number) => setSelectedQuizSet(`set${index + 1}`)}>
					<Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1 mb-4">
						{['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4'].map((quiz, index) => (
							<Tab
								key={index}
								className={({ selected }: { selected: boolean }) =>
									`w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded-lg
									${selected ? 'bg-white shadow' : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'}`
								}
							>
								{quiz}
							</Tab>
						))}
					</Tab.List>
					<Tab.Panels>
						{["set1", "set2", "set3", "set4"].map((set, index) => (
							<Tab.Panel key={index} className="bg-white rounded-2xl shadow-lg p-6">
								{filteredQuestions?.length === 0 ? (
									<div className="text-center text-gray-500">No questions found.</div>
								) : (
									<table className="min-w-full divide-y divide-gray-200">
										<thead>
											<tr>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Correct Answer</th>
												<th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
											</tr>
										</thead>
										<tbody>
											{filteredQuestions?.map((q) => {
												const correct = q.answers.find(a => a.id === q.correctAnswer);
												return (
													<tr key={q.id} className="hover:bg-gray-50">
														<td className="px-4 py-2 text-gray-800 max-w-xs truncate">{q.question}</td>
														<td className="px-4 py-2 text-gray-800 ">{correct ? correct.text : '-'}</td>
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
												);
											})}
										</tbody>
									</table>
								)}
							</Tab.Panel>
						))}
					</Tab.Panels>
				</Tab.Group>
			</div>
		</div>
	);
}
