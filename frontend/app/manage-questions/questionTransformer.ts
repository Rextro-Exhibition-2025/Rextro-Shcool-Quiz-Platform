import type {
  QuizApiQuestion,
  QuizApiOption,
  QuestionItem,
  QuestionOption,
  QuestionApiResponse,
  Question,
} from '../../types/quiz';


export function transformQuizApiQuestion(apiQuestion: QuestionApiResponse): Question {
  const quizSet = `set${apiQuestion.quizId}`;

  const answers: QuestionOption[] = (apiQuestion.options || []).map((opt: QuizApiOption) => ({
    id: String(opt.option).toLowerCase(),
    text: opt.optionText ?? '',
    image: opt.optionImage ?? undefined,
  }));

  const correctAnswer = apiQuestion.correctOption
    ? String(apiQuestion.correctOption).toLowerCase()
    : answers[0]?.id ?? '';

  return {
    id: String(apiQuestion._id),
    question: apiQuestion.question,
    image: apiQuestion.questionImage ?? undefined,
    quizSet,
    answers,
    correctAnswer,
  };
}


export function transformQuizApiQuestions(
  apiQuestions:QuestionApiResponse[],

): Question[] {
  return (apiQuestions || []).map((q) => transformQuizApiQuestion(q as any));
}

export default transformQuizApiQuestion;
