

````markdown

\# AI Interview Preparation Platform



An AI-powered full-stack interview preparation platform that helps users practice personalized mock interviews, receive AI-based answer evaluations, track their performance, and compare resumes with job descriptions.



\---



\## 🚀 Overview



The AI Interview Preparation Platform simulates an interview experience using AI.



Users can create an interview by selecting:



\- Company

\- Job role

\- Interview type

\- Difficulty

\- Number of questions



During the interview, users answer AI-generated questions and receive AI-based evaluation and feedback.



The platform also supports adaptive interviews, where the difficulty of subsequent questions can change based on the quality of the user's previous answer.



In addition to interview practice, the platform provides performance analytics and a Resume Matcher for comparing a resume with a job description.



\---



\## ✨ Features



\### 🤖 AI-Powered Mock Interviews



Create personalized interviews based on:



\- Company

\- Job role

\- Interview type

\- Difficulty

\- Number of questions



Supported interview types:



\- Technical

\- HR

\- Behavioral

\- Coding

\- Panel

\- Group Discussion

\- Mixed



\---



\### 🧠 Adaptive Interview System



The platform supports adaptive interview difficulty.



After a user submits an answer:



1\. The answer is evaluated by the AI.

2\. A score and feedback are generated.

3\. The system determines the appropriate difficulty for the next question.

4\. A new question is generated based on the updated difficulty.



This allows the interview to adapt to the candidate's performance instead of using the same difficulty throughout the entire interview.



The difficulty levels are:



```text

Easy

Medium

Hard

````



\---



\### 📝 Question Navigation



During an interview, users can:



\* View all question numbers

\* Navigate between questions

\* Return to previous questions

\* Review answered questions

\* Mark questions for review

\* Track the current interview progress



Question status is visually indicated as:



\* ⚪ Unattempted

\* 🔵 Attempted

\* 🟠 Marked for Review



\---



\### 📊 AI Answer Evaluation



Each submitted answer can be evaluated by the AI.



The evaluation stores:



\* Score

\* Feedback

\* Strengths

\* Improvements



The evaluation is also used as part of the adaptive interview process.



\---



\### 📋 Interview Results



After completing an interview, users can view a detailed result page containing:



\* Overall score

\* Average score

\* Overall percentage

\* Questions answered

\* Overall AI assessment

\* Overall strengths

\* Areas for improvement

\* Recommendation



\---



\### 📈 Performance Analytics



The platform tracks interview performance over time.



Users can view:



\* Total interviews

\* Completed interviews

\* Interviews in progress

\* Average score

\* Best score

\* Average interview duration

\* Performance by interview type

\* Performance by difficulty

\* Recent interview performance



\---



\### 📚 Interview History



The My Interviews section allows users to view and manage their interview sessions.



Users can:



\* View completed interviews

\* Continue interviews that are still in progress

\* View interview results

\* Delete interviews

\* Search interviews

\* Filter interviews by status



\---



\### 📄 Resume Matcher



The platform includes a Resume Matcher that compares a resume with a job description.



Users can provide resume content as text or upload a resume file.



Supported file formats:



\* PDF

\* DOCX



The application extracts the text from uploaded resumes and sends the resume content together with the job description to the AI analysis service.



\---



\### 🔐 Authentication



The application includes user authentication and protected routes.



Users can:



\* Register

\* Log in

\* Access their own interviews

\* View their profile

\* Update account information

\* Change their password



\---



\### 👤 Profile



The Profile page displays account information such as:



\* Full name

\* Email

\* Account type

\* Account creation date



\---



\### ⚙️ Settings



The Settings page allows users to:



\* Update their full name

\* View their email

\* View their account type

\* Change their password



\---



\## 🏗️ System Architecture



The application follows a full-stack client-server architecture.



```text

&#x20;                   ┌─────────────────────────┐

&#x20;                   │      React Client       │

&#x20;                   │                         │

&#x20;                   │  Dashboard              │

&#x20;                   │  Create Interview       │

&#x20;                   │  Interview              │

&#x20;                   │  Interview Results      │

&#x20;                   │  My Interviews          │

&#x20;                   │  Performance             │

&#x20;                   │  Resume Matcher         │

&#x20;                   │  Profile / Settings     │

&#x20;                   └────────────┬────────────┘

&#x20;                                │

&#x20;                                │ REST API

&#x20;                                ▼

&#x20;                   ┌─────────────────────────┐

&#x20;                   │   Node.js + Express     │

&#x20;                   │                         │

&#x20;                   │  Routes                 │

&#x20;                   │  Controllers            │

&#x20;                   │  Middleware             │

&#x20;                   │  Services               │

&#x20;                   └──────────┬───────┬──────┘

&#x20;                              │       │

&#x20;                   ┌──────────┘       └──────────┐

&#x20;                   ▼                             ▼

&#x20;         ┌──────────────────┐          ┌──────────────────┐

&#x20;         │     MongoDB      │          │    Gemini AI     │

&#x20;         │                  │          │                  │

&#x20;         │ Users            │          │ Question         │

&#x20;         │ Interviews       │          │ Generation       │

&#x20;         │ Answers          │          │ Answer Evaluation│

&#x20;         │ Results          │          │ Feedback         │

&#x20;         └──────────────────┘          └──────────────────┘

```



\---



\## 🔄 Adaptive Interview Flow



```text

User

&#x20; │

&#x20; ▼

Create Interview

&#x20; │

&#x20; ├── Company

&#x20; ├── Role

&#x20; ├── Interview Type

&#x20; ├── Difficulty

&#x20; └── Number of Questions

&#x20; │

&#x20; ▼

Generate Interview Questions

&#x20; │

&#x20; ▼

Display Question

&#x20; │

&#x20; ▼

User Submits Answer

&#x20; │

&#x20; ▼

AI Evaluates Answer

&#x20; │

&#x20; ├── Score

&#x20; ├── Feedback

&#x20; ├── Strengths

&#x20; └── Improvements

&#x20; │

&#x20; ▼

Determine Next Difficulty

&#x20; │

&#x20; ▼

Generate Next Question

&#x20; │

&#x20; ▼

Repeat Until Questions Are Completed

&#x20; │

&#x20; ▼

Complete Interview

&#x20; │

&#x20; ▼

Generate Overall Assessment

&#x20; │

&#x20; ▼

Display Performance Report

```



\---



\## 📄 Resume Matching Flow



```text

User

&#x20; │

&#x20; ▼

Resume

&#x20; │

&#x20; ├── Enter Resume Text

&#x20; │

&#x20; └── Upload PDF / DOCX

&#x20;         │

&#x20;         ▼

&#x20;  Extract Resume Text

&#x20;         │

&#x20;         ▼

&#x20;   Job Description

&#x20;         │

&#x20;         ▼

&#x20;     AI Analysis

&#x20;         │

&#x20;         ▼

&#x20;  Resume Match Result

```



\---



\## 🛠️ Technology Stack



\### Frontend



\* React

\* Vite

\* JavaScript

\* HTML

\* CSS



\### Backend



\* Node.js

\* Express.js



\### Database



\* MongoDB

\* Mongoose



\### Artificial Intelligence



\* Google Gemini API



\### Resume Processing



\* pdf-parse

\* Mammoth



\### Authentication



\* JWT-based authentication

\* Protected API routes



\### Development Tools



\* Git

\* GitHub

\* Nodemon

\* Visual Studio Code



\---



\## 📁 Project Structure



```text

AI Interview Preparation Platform/

│

├── client/

│   ├── src/

│   │   ├── pages/

│   │   │   ├── Dashboard.jsx

│   │   │   ├── CreateInterview.jsx

│   │   │   ├── Interview.jsx

│   │   │   ├── InterviewResult.jsx

│   │   │   ├── Interviews.jsx

│   │   │   ├── Performance.jsx

│   │   │   ├── Profile.jsx

│   │   │   ├── Settings.jsx

│   │   │   └── ResumeMatcher.jsx

│   │   │

│   │   ├── context/

│   │   ├── hooks/

│   │   └── services/

│   │

│   └── package.json

│

├── server/

│   ├── src/

│   │   ├── config/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   ├── models/

│   │   ├── routes/

│   │   ├── services/

│   │   └── utils/

│   │

│   └── package.json

│

├── README.md

├── .gitignore

└── ...

```



\---



\## ⚙️ Installation and Setup



\### 1. Clone the repository



```bash

git clone https://github.com/hanvithachavva-bit/AI-Interview-Preparation-Platform.git

```



\### 2. Navigate to the project



```bash

cd AI-Interview-Preparation-Platform

```



\---



\## 🔧 Backend Setup



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

MONGODB\_URI=your\_mongodb\_connection\_string

JWT\_SECRET=your\_jwt\_secret

GEMINI\_API\_KEY=your\_gemini\_api\_key

```



Start the backend development server:



```bash

npm run dev

```



The backend runs on:



```text

http://localhost:5000

```



\---



\## 💻 Frontend Setup



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



\---



\## 🔑 Environment Variables



The backend uses environment variables for configuration and sensitive credentials.



| Variable         | Purpose                        |

| ---------------- | ------------------------------ |

| `PORT`           | Backend server port            |

| `MONGODB\_URI`    | MongoDB connection string      |

| `JWT\_SECRET`     | Secret used for authentication |

| `GEMINI\_API\_KEY` | Gemini API key                 |



\*\*Never commit your actual `.env` file or API keys to GitHub.\*\*



\---



\## 🔒 Security



The application keeps sensitive configuration values in environment variables.



Authentication-protected routes ensure that users can access and manage their own interview data.



\---



\## 🎯 Project Goals



The main goal of this project is to provide a more personalized approach to interview preparation.



Instead of relying only on static interview questions, the platform combines:



\* AI-generated interview questions

\* AI-based answer evaluation

\* Adaptive difficulty

\* Question navigation and review

\* Interview performance tracking

\* Resume and job-description analysis



The adaptive interview system is designed to make practice sessions more responsive to the candidate's performance.



\---



\## 🚀 Future Enhancements



Potential future improvements include:



\* Voice-based interviews

\* Speech-to-text answers

\* Real-time conversational interviews

\* More advanced resume matching

\* Skill-specific interview recommendations

\* Personalized interview preparation plans

\* Interview performance comparisons

\* Advanced performance visualizations

\* Support for additional AI models



\---



\## 👩‍💻 Author



\*\*Hanvitha Reddy\*\*



AI Interview Preparation Platform developed as a full-stack AI-powered interview preparation project.



\---



\## 📜 License



This project is intended for educational and portfolio purposes.



```



