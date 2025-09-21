// Type definitions for input and output
export type InputAnswer = {
	id: string;
	text: string;
	image?: string;
};

export type InputQuestion = {
	question: string;
	image?: string;
	answers: InputAnswer[];
	correctAnswer: string;
    quizId?: number | null;
};

export type OutputOption = {
	option: string;
	optionText: string;
	optionImage?: string;
};

export type OutputQuestion = {
	quizId: number;
	question: string;
	questionImage?: string;
	options: OutputOption[];
	correctOption: string;
};

// Function to transform input question to output format
export function transformQuestion(input: InputQuestion): OutputQuestion {
	const idToOption = ['A', 'B', 'C', 'D'];
	const options: OutputOption[] = input.answers.map((ans, idx) => ({
		option: idToOption[idx],
		optionText: ans.text,
		...(ans.image ? { optionImage: ans.image } : {})
	}));

	const correctIdx = input.answers.findIndex(ans => ans.id === input.correctAnswer);
	const correctOption = idToOption[correctIdx];

	return {
		quizId: input.quizId || 1,
		question: input.question,
		...(input.image ? { questionImage: input.image } : {}),
		options,
		correctOption
	};
}
