# AI Interview Preparation Platform

An AI-powered full-stack interview preparation platform that helps users practice personalized mock interviews, receive AI-based answer evaluations, track their performance, and compare resumes with job descriptions.

---

## Overview

The AI Interview Preparation Platform simulates an interview experience using AI.

Users can create an interview by selecting:

- Company
- Job role
- Interview type
- Difficulty
- Number of questions

During the interview, users answer AI-generated questions and receive AI-based evaluation and feedback.

The platform also supports adaptive interviews, where the difficulty of subsequent questions can change based on the quality of the user's previous answer.

In addition to interview practice, the platform provides performance analytics and a Resume Matcher for comparing a resume with a job description.

---

## Unique Features

### 1. Adaptive AI Interview Engine

The platform uses an adaptive interview system that dynamically adjusts question difficulty based on the candidate's performance.

The process works as follows:

```text
Interview Question
        |
        v
Candidate Answer
        |
        v
AI Evaluation
        |
        v
Score + Feedback
        |
        v
Difficulty Adjustment
        |
        v
Next AI-Generated Question
```

Based on the quality of the previous answer, the next question can become easier, remain at the same level, or become harder.

This creates a more personalized interview experience instead of using a fixed sequence of questions.

### 2. AI Resume-Job Description Matcher

The platform includes an AI-powered Resume Matcher that analyzes how well a candidate's resume aligns with a specific job description.

The system supports:

- Resume text input
- PDF resume uploads
- DOCX resume uploads
- Automatic resume text extraction
- AI-powered resume and job-description analysis
- Identification of matching skills
- Identification of missing or relevant skills
- Recommendations for improving the resume

The process works as follows:

```text
Resume
  +
Job Description
        |
        v
Resume Text Extraction
        |
        v
AI Analysis
        |
        v
Match Evaluation
        |
        v
Skills + Gaps + Recommendations
```

These two features combine adaptive interview practice with practical job-application preparation in a single platform.

---

## Features

### AI-Powered Mock Interviews

Users can create personalized interviews based on:

- Company
- Job role
- Interview type
- Difficulty
- Number of questions

Supported interview types:

- Technical
- HR
- Behavioral
- Coding
- Panel
- Group Discussion
- Mixed

### Adaptive Interview System

The platform supports adaptive interview difficulty.

After a user submits an answer:

1. The answer is evaluated by the AI.
2. A score and feedback are generated.
3. The system determines the appropriate difficulty for the next question.
4. A new question is generated based on the updated difficulty.

The available difficulty levels are:

```text
Easy
Medium
Hard
```

This allows the interview experience to adapt to the candidate's performance.

### Question Navigation

During an interview, users can:

- View question numbers
- Navigate between questions
- Return to previous questions
- Review answered questions
- Mark questions for review
- Track interview progress

Question status is visually indicated as:

- Gray - Unattempted
- Blue - Attempted
- Orange - Marked for Review

### AI Answer Evaluation

Submitted answers are evaluated using AI.

The evaluation can include:

- Score
- Feedback
- Strengths
- Improvements

The evaluation also contributes to the adaptive interview process.

### Interview Results

After completing an interview, users can view their interview results and overall assessment.

The result information can include:

- Overall score
- Average score
- Overall percentage
- Questions answered
- Overall AI assessment
- Overall strengths
- Areas for improvement
- Recommendation

### Performance Analytics

The platform provides interview performance analytics.

Users can view information such as:

- Total interviews
- Completed interviews
- Interviews in progress
- Average score
- Best score
- Average interview duration
- Performance by interview type
- Performance by difficulty
- Recent interview performance

### Interview History

The My Interviews section allows users to manage their interview sessions.

Users can:

- View interviews
- Continue interviews that are still in progress
- View interview results
- Delete interviews
- Search interviews
- Filter interviews by status

### Resume Matcher

The platform includes a Resume Matcher for comparing a resume with a job description.

Users can provide resume content as text or upload a resume file.

Supported resume formats:

- PDF
- DOCX

The application extracts text from uploaded resumes and sends the resume content together with the job description to the AI analysis service.

### Authentication

The application includes user authentication and protected routes.

Users can:

- Register
- Log in
- Access their interviews
- View their profile
- Update account information
- Change their password

### Profile

The Profile page provides account information such as:

- Full name
- Email
- Account type
- Account creation date

### Settings

The Settings page allows users to:

- Update their full name
- View their email
- View their account type
- Change their password

---

## System Architecture

The application follows a full-stack client-server architecture.

```text
                    +----------------------+
                    |    React Frontend    |
                    |                      |
                    |  Dashboard           |
                    |  Create Interview    |
                    |  Interview           |
                    |  Results             |
                    |  My Interviews       |
                    |  Performance         |
                    |  Resume Matcher      |
                    |  Profile / Settings  |
                    +----------+-----------+
                               |
                               | REST API
                               v
                    +----------------------+
                    |   Node.js + Express  |
                    |                      |
                    |  Routes              |
                    |  Controllers         |
                    |  Middleware          |
                    |  Services            |
                    +----------+-----------+
                               |
                    +----------+----------+
                    |                     |
                    v                     v
             +-------------+       +-------------+
             |   MongoDB   |       |  Gemini AI  |
             |             |       |             |
             | Users       |       | Questions   |
             | Interviews  |       | Evaluation  |
             | Answers     |       | Feedback    |
             | Results     |       | Analysis    |
             +-------------+       +-------------+
```

---

## Interview Flow

```text
User
 |
 v
Create Interview
 |
 +-- Company
 +-- Role
 +-- Interview Type
 +-- Difficulty
 +-- Number of Questions
 |
 v
Generate Interview Question
 |
 v
User Answers Question
 |
 v
Submit Answer
 |
 v
AI Evaluates Answer
 |
 +-- Score
 +-- Feedback
 +-- Strengths
 +-- Improvements
 |
 v
Determine Next Difficulty
 |
 v
Generate Next Question
 |
 v
Repeat Until Interview Is Completed
 |
 v
Overall Interview Assessment
 |
 v
Performance Report
```

---

## Resume Matching Flow

```text
User
 |
 v
Provide Resume
 |
 +-- Resume Text
 |
 +-- PDF / DOCX Upload
 |
 v
Extract Resume Text
 |
 v
Provide Job Description
 |
 v
AI Analysis
 |
 v
Resume Match Result
```

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Artificial Intelligence

- Google Gemini API

### Resume Processing

- pdf-parse
- Mammoth

### Authentication

- JWT-based authentication
- Protected API routes

### Development Tools

- Git
- GitHub
- Nodemon
- Visual Studio Code

---

## Project Structure

```text
AI Interview Preparation Platform/
|
+-- client/
|   |
|   +-- src/
|       |
|       +-- pages/
|       +-- context/
|       +-- hooks/
|       +-- services/
|
+-- server/
|   |
|   +-- src/
|       |
|       +-- config/
|       +-- controllers/
|       +-- middleware/
|       +-- models/
|       +-- routes/
|       +-- services/
|       +-- utils/
|
+-- README.md
+-- .gitignore
+-- ...
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/hanvithachavva-bit/AI-Interview-Preparation-Platform.git
```

### 2. Navigate to the Project

```bash
cd AI-Interview-Preparation-Platform
```

---

## Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory.

Add the required environment variables:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend development server:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

---

## Environment Variables

The backend uses environment variables for configuration and sensitive credentials.

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for authentication |
| `GEMINI_API_KEY` | Gemini API key |

Never commit your actual `.env` file or API keys to GitHub.

---

## Security

The application keeps sensitive configuration values in environment variables.

Authentication-protected routes help ensure that users can access and manage their own interview data.

---

## Project Goals

The main goal of this project is to provide a personalized approach to interview preparation.

Instead of relying only on static interview questions, the platform combines:

- AI-generated interview questions
- AI-based answer evaluation
- Adaptive difficulty
- Question navigation and review
- Interview performance tracking
- Resume and job-description analysis

The adaptive interview system makes practice sessions more responsive to the candidate's performance.

---

## Future Enhancements

Potential future improvements include:

- Voice-based interviews
- Speech-to-text answers
- Real-time conversational interviews
- More advanced resume matching
- Skill-specific interview recommendations
- Personalized interview preparation plans
- Interview performance comparisons
- Advanced performance visualizations
- Support for additional AI models

---

## Author

**Hanvitha Reddy**

AI Interview Preparation Platform developed as a full-stack AI-powered interview preparation project.

---

## License

This project is intended for educational and portfolio purposes.