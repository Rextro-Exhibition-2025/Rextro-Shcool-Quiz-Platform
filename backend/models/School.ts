import mongoose, { Document, Schema } from "mongoose";

export interface ISchool extends Document {
    name: string;
    password: string;
    totalMarks: number;
    members: string[]; // Array of user IDs
}

const schoolSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalMarks: { type: Number, default: 0 },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
})

export default mongoose.model<ISchool>("School", schoolSchema);