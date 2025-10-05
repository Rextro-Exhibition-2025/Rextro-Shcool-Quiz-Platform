// Backend API response types
export interface QuizApiOption {
	option: string;
	optionText: string;
	optionImage?: string;
	_id: string;
}

export interface QuizApiQuestion {
	_id: string;
	quizId: number;
	question: string;
	questionImage?: string;
	options: QuizApiOption[];
	__v: number;
}

export interface QuizApiResponse {
	_id: string;
	quizId: number;
	questions: QuizApiQuestion[];
	__v: number;
}
export interface Answer {
	id: string;
	text: string | null;
	image: string | null;
}

export interface QuizQuestion {
	id: number;
	question: string;
	image: string | null;
	answers: Answer[];
}
