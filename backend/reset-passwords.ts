import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import SchoolTeam from './models/SchoolTeam.js';

dotenv.config();

async function resetPasswords() {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('✅ Connected to MongoDB');

        const testPassword = 'loadtest123'; // Same password for all schools
        const hashedPassword = await bcrypt.hash(testPassword, 10);

        const schools = [
            'Sunrise High School',
            'Horizon Secondary School',
            'Valleyview High',
            'Lakeside Academy',
            'Ridgewood School'
        ];

        for (const schoolName of schools) {
            const result = await SchoolTeam.updateOne(
                { schoolName: schoolName },
                { password: hashedPassword }
            );
            console.log(`✅ Updated password for ${schoolName}`);
        }

        console.log(`\n🔑 All school passwords are now: ${testPassword}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

resetPasswords();