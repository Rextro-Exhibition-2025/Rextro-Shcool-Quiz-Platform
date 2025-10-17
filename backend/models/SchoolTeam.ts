import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs"; // Fixed typo: bycrypt -> bcrypt
import jwt from "jsonwebtoken"; // Fixed import: use default import

export interface IStudent extends Document {
    name: string;
    marks: number;
    isLoggedIn?: boolean;
    authToken?: string;
    hasEndedQuiz?: boolean;
}

export interface ISchoolTeam extends Document {
    teamName: string;
    schoolName: string;
    password: string;
    totalMarks: number;
    members: IStudent[];
    educationalZone?: string;
    teacherInCharge?: string;
    teacherContact?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthTokenForMember(memberName: string): string;
}

const schoolTeamSchema: Schema = new Schema({
    teamName: { type: String, required: [true, "Team name is required"], unique: true },
    schoolName: { type: String, required: [true, "School name is required"] },
    password: { type: String, required: [true, "Password is required"], minlength: 6 },
    totalMarks: { type: Number, default: 0 },
    educationalZone: { type: String },
    teacherInCharge: { type: String },
    teacherContact: { type: String },
    members: [
        {
            name: { type: String, required: [true, "Member must have a name"] },
            marks: { type: Number, default: 0 },
            isLoggedIn: { type: Boolean, default: false },
            authToken: { type: String },
            hasEndedQuiz: { type: Boolean, default: false },
        },
    ],
}, { timestamps: true });

// hashing the password
schoolTeamSchema.pre<ISchoolTeam>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10); // Fixed typo: bycrypt -> bcrypt
        this.password = await bcrypt.hash(this.password, salt); // Fixed typo: bycrypt -> bcrypt
        next();
    } catch (error) {
        next(error as Error);
    }
});

// method to compare passwords
schoolTeamSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password); // Fixed typo: bycrypt -> bcrypt
};

// method to generate auth token for a member
schoolTeamSchema.methods.generateAuthTokenForMember = function (memberName: string): string {
    const member = this.members.find((m: IStudent) => m.name === memberName);
    if (!member) {
        throw new Error("Member not found");
    }

    const payload = {
        id: this._id,
        teamName: this.teamName,
        memberName: member.name,
    };
    const secretKey = 'your_secret_key';

    // Fixed: Proper type assertion and parameter order
    const token = jwt.sign(
        payload, secretKey, {
        expiresIn: '1h', // Token expires in 1 hour
    });
    return token;
};

export default mongoose.model<ISchoolTeam>("SchoolTeam", schoolTeamSchema);