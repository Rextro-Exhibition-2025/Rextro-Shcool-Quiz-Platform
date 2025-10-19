import mongoose, { Schema, Document } from 'mongoose';


type OptionType = 'A' | 'B' | 'C' | 'D';

interface Option {
	option: OptionType;
	optionText?: string;
	optionImage?: string;
	optionImagePublicId?: string;
}


export interface IQuestion extends Document {
    quizid: number;
	question: string;
	questionImage?: string;
	questionImagePublicId?: string;
	options: Option[];
	correctOption: OptionType;
}

const OptionSchema: Schema = new Schema({
    option: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
    optionText: { type: String, required: false },
    optionImage: { type: String, required: false },
    optionImagePublicId: { type: String, required: false },
});

// Custom validator to ensure at least one of optionText or optionImage is provided
OptionSchema.pre('validate', function(next) {
    if (!this.optionText && !this.optionImage) {
        this.invalidate('optionText', 'Either optionText or optionImage must be provided');
        this.invalidate('optionImage', 'Either optionText or optionImage must be provided');
    }
    next();
});


const QuestionSchema: Schema = new Schema({
        quizId: { type: Number, required: true , enum: [1,2,3,4]},
    question: { type: String, required: true },
    questionImage: { type: String, required: false },
    questionImagePublicId: { type: String, required: false },
    options: { type: [OptionSchema], required: true, validate: [(val: Option[]) => val.length === 4, 'Exactly 4 options required'] },
    correctOption: { type: String, required: true, enum: ['A', 'B', 'C', 'D'] },
});

export default mongoose.model<IQuestion>("Question", QuestionSchema);






