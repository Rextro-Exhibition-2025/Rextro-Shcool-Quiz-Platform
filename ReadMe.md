# 🎓 Rextro School Quiz Platform

<div align="center">

![Faculty of Engineering Logo](public/logo_rextro.png)

**A Comprehensive Quiz Competition Management System for Educational Institutions**

**Developed at University of Ruhuna | Faculty of Engineering**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green)](https://www.mongodb.com/)

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Target Audience](#-target-audience)
- [Solution](#-solution)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [User Stories](#-user-stories)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Acknowledgments](#-acknowledgments)
- [License](#-license)

---

## 🌟 Overview

The **Rextro School Quiz Platform** is an advanced, real-time quiz competition management system designed to facilitate inter-school academic competitions. Built with modern web technologies at the **University of Ruhuna Faculty of Engineering**, it provides a seamless experience for administrators, teachers, and students while maintaining the highest standards of academic integrity through comprehensive anti-cheating mechanisms.

### 🎯 Mission

To create an engaging, fair, and technologically advanced platform that enables educational institutions to conduct large-scale quiz competitions efficiently while ensuring complete transparency and security.

---

## 🔍 Problem Statement

Traditional quiz competitions face several challenges:

- **🔐 Security Concerns**: Preventing cheating and unauthorized access during online assessments
- **📊 Manual Tracking**: Time-consuming manual score calculation and violation monitoring
- **⏱️ Time Management**: Difficulty in synchronizing quiz timing across multiple participants
- **📈 Real-time Monitoring**: Lack of live tracking and instant result compilation
- **🎓 Team Coordination**: Managing multiple team members and their individual performances
- **📱 Accessibility**: Need for a platform that works seamlessly across devices
- **🔍 Violation Detection**: Manual monitoring of student behavior during assessments

---

## 👥 Target Audience

### Primary Users

1. **🏫 School Administrators**
   - Register school teams
   - Monitor team performance
   - Track violations
   - Access comprehensive analytics

2. **👨‍🏫 Teachers/Coordinators**
   - Manage student teams
   - Monitor quiz progress
   - View real-time results
   - Generate reports

3. **🎓 Students**
   - Participate in timed quizzes
   - View personal scores
   - Access leaderboards
   - Compete fairly

### Secondary Users

4. **🛠️ System Administrators**
   - Create and manage quizzes
   - Configure platform settings
   - Monitor system health
   - Manage user access

5. **📊 Event Organizers**
   - Track competition progress
   - Generate reports
   - Analyze participation data
   - Monitor platform performance

---

## 💡 Solution

### Comprehensive Quiz Management Platform

A full-stack web application that addresses all challenges through:

#### For Administrators
- **Question Bank Management**: Create, edit, and organize quiz questions with support for text and images
- **Team Management**: Register and manage school teams with multiple members
- **Real-time Monitoring**: Live dashboard showing active quizzes and participant status
- **Violation Tracking**: Automated detection and logging of suspicious activities
- **Analytics Dashboard**: Comprehensive insights into performance and participation

#### For Teachers/Coordinators
- **Team Registration**: Simple interface to register school teams with student details
- **Progress Tracking**: Monitor team members' quiz progress in real-time
- **Result Access**: Instant access to scores and rankings
- **Violation Reports**: View detailed violation logs for each team member

#### For Students
- **Secure Authentication**: Token-based login system for each team member
- **Timed Quizzes**: 45-minute quiz sessions with countdown timer
- **Fullscreen Mode**: Immersive quiz experience with anti-cheat measures
- **Instant Results**: Immediate score calculation and ranking display
- **Leaderboard**: Real-time ranking system showing top performers

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Admin     │  │   Teacher   │  │   Student   │         │
│  │  Dashboard  │  │   Portal    │  │    Quiz     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS/REST API
┌───────────────────────┴─────────────────────────────────────┐
│                    Application Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend (SSR/CSR)              │   │
│  │  • React Components  • Context API  • Interceptors   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          Express.js Backend (REST API)               │   │
│  │  • Controllers  • Routes  • Middleware  • Services   │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ Mongoose ODM
┌───────────────────────┴─────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  MongoDB Database                     │   │
│  │  • SchoolTeams  • Questions  • Quizzes  • Violations │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Student Login → Authentication → Token Generation → Quiz Access
     ↓              ↓                   ↓                ↓
Quiz Start → Fullscreen Mode → Answer Selection → Violation Check
     ↓              ↓                   ↓                ↓
 Timer Tick → Progress Save → Score Calculation → Result Display
```

---

## 🚀 Key Features

### 🔐 Security & Anti-Cheating

- **Fullscreen Enforcement**: Automatic detection when students exit fullscreen mode
- **Copy/Paste Prevention**: Disabled clipboard operations during quiz
- **Tab Switching Detection**: Alerts and logs when students switch tabs
- **Activity Monitoring**: Tracks user activity and flags extended inactivity
- **Device Fingerprinting**: Unique identification of quiz-taking devices
- **Token-based Authentication**: Secure JWT tokens for session management
- **Violation Logging**: Comprehensive database of all suspicious activities

### 📊 Quiz Management

- **Dynamic Question Bank**: Support for text and image-based questions
- **Multiple Answer Formats**: Text-only, image-only, or combined answers
- **Timed Sessions**: Configurable quiz duration (default: 45 minutes)
- **Auto-submission**: Automatic submission when time expires
- **Progress Tracking**: Real-time progress indicators
- **Answer Review**: Students can navigate between questions before submission

### 👥 Team Management

- **Multi-member Teams**: Support for 4 students per school team
- **Individual Tracking**: Separate authentication and scoring for each member
- **Team Aggregation**: Automatic calculation of team total scores
- **School Information**: Store educational zone and teacher contact details
- **Member Status**: Track login status and quiz completion for each member

### 📈 Real-time Leaderboard

- **Live Rankings**: Automatic ranking based on scores
- **School-wise Display**: Show performance by school and team
- **Individual Scores**: Display each team member's contribution
- **Violation Indicators**: Flag teams/members with violations
- **Responsive Design**: Works seamlessly on all screen sizes

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with beautiful UI
- **Intuitive Navigation**: Easy-to-use interface for all user types
- **Visual Feedback**: Clear indicators for selections and progress
- **Loading States**: Smooth transitions and loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support

### ⚡ Performance & Caching

- **Support Backend Layer**: Dedicated caching server to reduce main backend load
- **Response Caching**: Intelligent caching of quiz data, questions, and leaderboards
- **Optimized API Calls**: Reduces redundant database queries
- **Scalable Architecture**: Easy horizontal scaling with caching layer

### 📱 Admin Dashboard

- **Question Management**: CRUD operations for quiz questions
- **Team Overview**: View all registered school teams
- **Violation Monitoring**: Dashboard for tracking all violations
- **Analytics**: Comprehensive statistics and insights
- **Bulk Operations**: Import/export questions and teams
- **System Logs**: Detailed activity logs for auditing

---

## 📖 User Stories

### As a School Administrator

```
✓ I want to register my school team with student details
✓ I want to view my team's performance in real-time
✓ I want to see which students have completed the quiz
✓ I want to check if any violations were detected
✓ I want to compare my team's ranking with other schools
```

### As a Student

```
✓ I want to login securely with my school credentials
✓ I want to take the quiz in a distraction-free fullscreen mode
✓ I want to see my remaining time clearly
✓ I want to navigate between questions freely
✓ I want to see my score immediately after submission
✓ I want to view my ranking on the leaderboard
```

### As a System Administrator

```
✓ I want to create and manage quiz questions easily
✓ I want to upload images for questions and answers
✓ I want to monitor all active quiz sessions
✓ I want to view comprehensive violation reports
✓ I want to export results and analytics
✓ I want to ensure system security and performance
```

### As a Teacher/Coordinator

```
✓ I want to help my students login to the quiz
✓ I want to monitor their progress during the quiz
✓ I want to ensure they follow the rules
✓ I want to view detailed results after completion
✓ I want to identify areas for improvement
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework with SSR/CSR | 15.x |
| **React** | UI Library | 19.x |
| **TypeScript** | Type Safety | 5.x |
| **Tailwind CSS** | Utility-first CSS Framework | 3.x |
| **Lucide React** | Icon Library | Latest |
| **Axios** | HTTP Client | Latest |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 20+ |
| **Express.js** | Web Framework | 5.x |
| **TypeScript** | Type Safety | 5.x |
| **MongoDB** | NoSQL Database | 7.x |
| **Mongoose** | ODM for MongoDB | 8.x |
| **JWT** | Authentication | Latest |
| **Bcrypt** | Password Hashing | Latest |

### Support Backend (Caching Layer)

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 20+ |
| **Express.js** | Web Framework | 5.x |
| **TypeScript** | Type Safety | 5.x |
| **node-cache** | In-Memory Caching | 5.x |

### DevOps & Tools

| Tool | Purpose |
|------|---------|
| **Git** | Version Control |
| **Docker** | Containerization |
| **Artillery** | Load Testing |
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **Swagger** | API Documentation |

---

## 📁 Project Structure

```
Rextro-School-Quiz-Platform/
│
├── 📂 frontend/                 # Next.js Frontend Application
│   ├── 📂 app/                  # Next.js App Router
│   │   ├── 📂 admin/            # Admin dashboard pages
│   │   ├── 📂 quiz/             # Quiz interface
│   │   ├── 📂 leaderboard/      # Rankings display
│   │   ├── 📂 login/            # Authentication pages
│   │   └── 📂 api/              # API routes
│   ├── 📂 components/           # Reusable React components
│   ├── 📂 contexts/             # React Context providers
│   ├── 📂 interceptors/         # Axios interceptors
│   ├── 📂 lib/                  # Utility functions
│   ├── 📂 types/                # TypeScript type definitions
│   ├── 📂 public/               # Static assets
│   └── 📄 package.json          # Frontend dependencies
│
├── 📂 backend/                  # Express.js Backend API
│   ├── 📂 config/               # Configuration files
│   │   └── 📄 db.ts             # Database connection
│   ├── 📂 controllers/          # Request handlers
│   │   ├── 📄 authController.ts
│   │   ├── 📄 questionController.ts
│   │   ├── 📄 quizController.ts
│   │   ├── 📄 schoolTeamController.ts
│   │   ├── 📄 uploadController.ts
│   │   ├── 📄 userController.ts
│   │   └── 📄 violationController.ts
│   ├── 📂 models/               # Mongoose schemas
│   │   ├── 📄 SchoolTeam.ts
│   │   ├── 📄 Question.ts
│   │   ├── 📄 Quiz.ts
│   │   ├── 📄 User.ts
│   │   └── 📄 Violation.ts
│   ├── 📂 routes/               # API routes
│   ├── 📂 middleware/           # Custom middleware
│   ├── 📂 utils/                # Utility functions
│   └── 📄 index.ts              # Application entry point
│
├── 📄 README.md                 # Project documentation
├── 📄 .gitignore                # Git ignore rules
└── 📄 LICENSE                   # License file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **MongoDB** (v7.0 or higher) or MongoDB Atlas account
- **Git**

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/Rextro-School-Quiz-Platform.git
cd Rextro-School-Quiz-Platform
```

#### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
nano .env
```

**Backend Environment Variables** (`.env`):

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DEV_MONGO_URI=mongodb://localhost:27017/rextro_quiz_dev
PROD_MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/rextro_quiz

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=1h

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
# Run in development mode
npm run dev

# Run in production mode
npm run prod

# Build for production
npm run build
npm start
```

#### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables
nano .env.local
```

**Frontend Environment Variables** (`.env.local`):

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=Rextro Quiz Platform
NEXT_PUBLIC_QUIZ_DURATION=2700
```

```bash
# Run development server
npm run dev

# Build for production
npm run build
npm start
```

#### 4️⃣ Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

---

## 📚 API Documentation

### Authentication Endpoints

#### Login Member
```http
POST /api/auth/login
Content-Type: application/json

{
  "schoolName": "Sunrise High School",
  "memberName": "Alice",
  "password": "secure123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "teamId": "68bf02d2004d8f942bdf2c45",
    "teamName": "Alpha Innovators",
    "memberName": "Alice",
    "schoolName": "Sunrise High School",
    "hasEndedQuiz": false,
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Logout Member
```http
GET /api/auth/logout
Content-Type: application/json
Authorization: Bearer <token>
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Member State
```http
PUT /api/auth/update-state
Content-Type: application/json
Authorization: Bearer <token>

{
  "schoolName": "Sunrise High School",
  "memberName": "Alice",
  "hasEndedQuiz": true
}
```

### School Team Endpoints

#### Create School Team
```http
POST /api/school-teams
Content-Type: application/json

{
  "teamName": "Alpha Innovators",
  "schoolName": "Sunrise High School",
  "password": "secure123",
  "educationalZone": "Central District",
  "teacherInCharge": "Ms. Sarah Johnson",
  "teacherContact": "+1-555-0123",
  "members": [
    { "name": "Alice", "marks": 0 },
    { "name": "Bob", "marks": 0 },
    { "name": "Charlie", "marks": 0 },
    { "name": "Diana", "marks": 0 }
  ]
}
```

#### Get All School Teams
```http
GET /api/school-teams
```

**Response:**
```json
{
  "success": true,
  "count": 6,
  "data": [
    {
      "_id": "68bf02d2004d8f942bdf2c45",
      "teamName": "Alpha Innovators",
      "schoolName": "Sunrise High School",
      "totalMarks": 85,
      "members": [
        {
          "name": "Alice",
          "marks": 26.67,
          "isLoggedIn": true,
          "hasEndedQuiz": true
        }
      ]
    }
  ]
}
```

### Question Endpoints

#### Get All Questions
```http
GET /api/questions
Authorization: Bearer <token>
```

#### Create Question
```http
POST /api/questions
Content-Type: application/json
Authorization: Bearer <token>

{
  "question": "What is the capital of France?",
  "image": null,
  "answers": [
    { "id": "a", "text": "Paris", "image": null },
    { "id": "b", "text": "London", "image": null },
    { "id": "c", "text": "Berlin", "image": null }
  ],
  "correctAnswer": "a"
}
```

### Quiz Endpoints

#### Get Quiz by ID
```http
GET /api/quizzes/{id}
Authorization: Bearer <token>
```

#### Submit Quiz
```http
POST /api/quizzes/submit-quiz
Content-Type: application/json
Authorization: Bearer <token>

{
  "quizId": 1,
  "answers": {
    "0": "a",
    "1": "b",
    "2": "c"
  }
}
```

#### Get Leaderboard
```http
GET /api/quizzes/get-leaderboard
```

#### Check Quiz Published Status
```http
GET /api/quizzes/check-quiz-published-status
```

### Violation Endpoints

#### Report Violation
```http
POST /api/violations
Content-Type: application/json

{
  "teamId": "68bf02d2004d8f942bdf2c45",
  "memberName": "Alice",
  "violationType": "copy & paste"
}
```

#### Get Violations for Team
```http
GET /api/violations
Content-Type: application/json

{
  "teamId": "68bf02d2004d8f942bdf2c45"
}
```

#### Get Violation Count for Team Member
```http
GET /api/violations/count
Content-Type: application/json

{
  "teamId": "68bf02d2004d8f942bdf2c45",
  "memberName": "Alice"
}
```

#### Get All Violations with School Details
```http
GET /api/violations/get-all
```

For complete API documentation, visit the Swagger UI at `http://localhost:5000/api-docs`

---

## 🔒 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds for password security
- **Token Expiration**: Automatic session timeout after 1 hour
- **Role-based Access**: Different permissions for students, teachers, and admins

### Quiz Security

- **Fullscreen Lock**: Forces fullscreen mode during quiz
- **Copy/Paste Prevention**: Disables clipboard operations
- **Tab Switching Detection**: Alerts when users switch tabs
- **Right-click Disable**: Prevents context menu access
- **Text Selection Block**: Prevents text highlighting
- **Device Fingerprinting**: Unique device identification

### Violation Tracking

- **Automated Logging**: All violations logged to database
- **Real-time Alerts**: Instant notifications for violations
- **Comprehensive Reports**: Detailed violation history per student/team
- **Timestamped Records**: Precise tracking of when violations occurred

### Data Protection

- **Environment Variables**: Sensitive data stored in `.env` files
- **Input Validation**: Server-side validation for all inputs
- **NoSQL Injection Prevention**: Mongoose ODM protects against NoSQL injection
- **XSS Protection**: React's built-in XSS protection
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Rate Limiting**: Support backend caching reduces attack surface

---

## 👨‍💻 Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Load testing with Artillery
artillery run artillery-config.yml
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run typecheck
```

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### Manual Deployment

#### Backend Deployment

```bash
cd backend

# Build TypeScript
npm run build

# Start production server
NODE_ENV=production npm start

# Build TypeScript
npm run build

# Start production server
NODE_ENV=production npm start
```

#### Frontend Deployment

```bash
cd frontend

# Build Next.js app
npm run build

# Start production server
npm start
```

### Environment-specific Configurations

- **Development**: `npm run dev`
- **Production**: `npm run prod`

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'feat: add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 🙏 Acknowledgments

- **University of Ruhuna** - Faculty of Engineering
- **25 Years of Innovation & Excellence** 
- All contributors and testers
- Open-source community for amazing tools and libraries

---

## 📞 Support

For support, questions, or feedback:

- **Email**: rextro2025@eng.ruh.ac.lk
- **Institution**: University of Ruhuna, Faculty of Engineering
- **Issues**: [GitHub Issues](https://github.com/yourusername/Rextro-School-Quiz-Platform/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/Rextro-School-Quiz-Platform/wiki)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🗺️ Roadmap

### Phase 1 - MVP (Completed)
- ✅ User authentication system
- ✅ Quiz management
- ✅ Team registration
- ✅ Basic violation detection
- ✅ Leaderboard
- ✅ Support Backend with caching

### Phase 2 - Enhanced Features (In Progress)
- 🔄 Advanced analytics dashboard
- 🔄 Email notifications
- 🔄 Bulk import/export
- 🔄 Mobile app

### Phase 3 - Future Enhancements
- 📝 AI-powered question generation
- 📝 Video proctoring
- 📝 Multi-language support
- 📝 Customizable themes
- 📝 Redis-based distributed caching

---

<div align="center">

## 🎓 Rextro 2025 - Empowering Engineering Excellence

**University of Ruhuna | Faculty of Engineering**

**25 Years of Innovation & Excellence (2000-2025)**

🏗️ **Built with ❤️ by the Rextro Development Team**

---

**[⬆ Back to Top](#-rextro-school-quiz-platform)**

</div>