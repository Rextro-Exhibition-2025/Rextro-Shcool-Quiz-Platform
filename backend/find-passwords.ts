import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SchoolTeam from './models/SchoolTeam.js';

dotenv.config();

async function findPasswords() {
    try {
        // Connect to MongoDB using your existing connection string
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('✅ Connected to MongoDB');

        const teams = await SchoolTeam.find({}, 'schoolName teamName password');

        console.log('🏫 School Teams and Passwords:');
        console.log('================================');

        teams.forEach(team => {
            console.log(`School: ${team.schoolName}`);
            console.log(`Team: ${team.teamName}`);
            console.log(`Encrypted Password: ${team.password}`);
            console.log('---');
        });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

findPasswords();