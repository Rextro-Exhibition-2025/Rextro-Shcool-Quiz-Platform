import mongoose, { Schema, Document } from 'mongoose';


type OptionType = 'A' | 'B' | 'C' | 'D';

interface Option {
	option: OptionType;
	optionText: string;
	optionImage?: string;
}


export interface IQuestion extends Document {
    quizid: number;
	question: string;
	questionImage?: string;
	options: Option[];
	correctOption: OptionType;
}

const OptionSchema: Schema = new Schema({
    option: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
    optionText: { type: String, required: true },
    optionImage: { type: String, required: false },
});


const QuestionSchema: Schema = new Schema({
        quizId: { type: Number, required: true , enum: [1,2,3,4]},
    question: { type: String, required: true },
    questionImage: { type: String, required: false },
    options: { type: [OptionSchema], required: true, validate: [(val: Option[]) => val.length === 4, 'Exactly 4 options required'] },
    correctOption: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
});

export default mongoose.model<IQuestion>("Question", QuestionSchema);






