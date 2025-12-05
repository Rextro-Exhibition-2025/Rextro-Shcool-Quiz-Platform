import { createStudentApi } from "@/interceptors/student";
import { createContext, useContext, useState } from "react";
import { useUser } from "./UserContext";

interface QuizContextType {
    selectedAnswers: { questionId: number; answer: string }[];
    updateSelectedAnswers: (questionId: number, answer: string) => Promise<void>;
    quizId: number | null;
    setQuizId: (id: number) => void;
    submitQuiz: () => Promise<void>;
    score?: number;
    submitQuestion: ( questionAnswer: { questionId: number; answer: string , timeSpent: number } | null) => Promise<void>;

}



const quizContext = createContext<QuizContextType>({
    selectedAnswers: [],
    updateSelectedAnswers: () => Promise.resolve(),
    quizId: null,
    setQuizId: () => null,
    submitQuiz: async () => { },
    score: 0,
    submitQuestion: async () => { }
})


export const useQuiz = () => {

    const context = useContext(quizContext);
    if (!context) {
        throw new Error('useQuiz must be used within a QuizProvider');
    }
    return context;
}


export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedAnswers, setSelectedAnswers] = useState<{ questionId: number; answer: string }[]>([]);
    const [quizId, setQuizId] = useState<number | null>(null);
    const [score, setScore] = useState<number>(0);
    const user = useUser();
    const updateSelectedAnswers = (questionId: number, answer: string): Promise<void> => {
        return new Promise((resolve) => {
            setSelectedAnswers(prev => {
                const existing = prev.find(ans => ans.questionId === questionId);
                let updated;
                if (existing) {
                    updated = prev.map(ans => ans.questionId === questionId ? { questionId, answer } : ans);
                } else {
                    updated = [...prev, { questionId, answer }];
                }
                resolve();
                return updated;
            });
        });
    }

    const submitQuiz = async () => {

        try {
         
            const api = await createStudentApi({ token: user.user?.authToken || '' });
            const response: any = await api.post('/quizzes/submit-quiz', {
                quizId,
                submittedAnswers: selectedAnswers
            });
            setSelectedAnswers([]); // Reset after successful submit
            setScore(response.data.data.score);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    }



    const submitQuestion = async ( questionAnswer: { questionId: number; answer: string , timeSpent: number } | null) => {

        try {
         
            const api = await createStudentApi({ token: user.user?.authToken || '' });
            const response: any = await api.post('/questions/submit', {
                questionId: questionAnswer?.questionId,
                answer: questionAnswer?.answer,
                timeSpent: questionAnswer?.timeSpent
            });

            console.log("Question submitted successfully:", response.data);
           
           
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    }

    return (
        <quizContext.Provider value={{ selectedAnswers, updateSelectedAnswers, quizId, setQuizId, submitQuiz, score , submitQuestion }}>
            {children}
        </quizContext.Provider>
    )




}