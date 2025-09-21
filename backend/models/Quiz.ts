import mongoose, { Schema, Document } from "mongoose";

type QuizType = 1 | 2 | 3 | 4;

export interface IQuiz extends Document {
  quizId: QuizType;
  questions?: mongoose.Types.ObjectId[];
}

const quizSchema: Schema = new Schema({
  quizId: { type: Number, required: true, unique: true, enum: [1, 2, 3, 4] },
  questions: [{ type: mongoose.Types.ObjectId, ref: "Question" }],
});


export default mongoose.model<IQuiz>("Quiz", quizSchema);