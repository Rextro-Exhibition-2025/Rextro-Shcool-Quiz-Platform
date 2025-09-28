import mongoose, { Schema } from "mongoose";

export interface IViolation extends Document {
    teamId: mongoose.Types.ObjectId;
    memberName: string;
    violationType: 'copy & paste' | 'escaping full screen';
    createdAt: Date;
    updatedAt: Date;
}

const violationSchema: Schema = new Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'SchoolTeam', required: true },
    memberName: { type: String, required: true },
    violationType: { type: String, enum: ['copy & paste', 'escaping full screen'], required: true },
}, { timestamps: true });

export default mongoose.model<IViolation>('Violation', violationSchema);