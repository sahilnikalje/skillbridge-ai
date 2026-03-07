<div align="center">

# ⚡ SkillBridge AI

### AI-powered career tool — paste a job description, upload your resume, get fully prepared.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-skillbridge--ai-6382ff?style=for-the-badge&logo=render)](https://skillbridge-ai-1-ku8j.onrender.com)
[![Backend](https://img.shields.io/badge/Backend%20API-online-4ade80?style=for-the-badge&logo=render)](https://skillbridge-ai-lacn.onrender.com)

</div>

---

## ✨ What it does

Upload your resume (PDF) and paste any job description. SkillBridge AI uses **Groq + LLaMA 3.3 70B** to analyze your profile and generate a complete, actionable prep report.

- 🎯 **Profile Match Score** — rated against the job description
- ❓ **Q&A Generation** — interview questions with detailed model answers
- 🔍 **Skill Gap Analysis** — missing skills detected and flagged by severity
- 🗺️ **Prep Roadmap** — personalized day-by-day study plan
- 📄 **ATS-Friendly Resume** — AI-generated resume optimised for the target role, downloadable as PDF

---

## 🛠️ Tech Stack

| | Frontend | Backend |
|---|---|---|
| **Framework** | React 18 + Vite | Node.js + Express |
| **Styling** | SCSS (modular, feature-scoped) | — |
| **State** | Context API + custom hooks | — |
| **Database** | — | MongoDB + Mongoose |
| **AI** | — | Groq API — `llama-3.3-70b-versatile` |
| **Auth** | JWT (HttpOnly cookies) | JWT + token blacklist |
| **File Upload** | — | Multer |
| **Deployment** | Render (port 5173) | Render (port 3000) |

---

## 📂 Project Structure

```
skillbridge-ai
│
├── Backend
│   ├── package.json
│   ├── server.js
│   ├── render-build.sh
│   └── src
│       ├── app.js
│       │
│       ├── config
│       │   └── db.js
│       │
│       ├── controllers
│       │   ├── authController.js
│       │   └── interviewController.js
│       │
│       ├── middlewares
│       │   ├── authMiddleware.js
│       │   └── fileMiddleware.js
│       │
│       ├── models
│       │   ├── blacklistModel.js
│       │   ├── interviewReportModel.js
│       │   └── userModel.js
│       │
│       ├── routes
│       │   ├── authRoutes.js
│       │   └── interviewRoutes.js
│       │
│       └── services
│           └── ai.service.js          ← Groq LLaMA 3.3 70B integration
│
├── Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src
│       ├── main.jsx
│       ├── App.jsx
│       ├── app.routes.jsx
│       │
│       ├── features
│       │   ├── auth
│       │   │   ├── auth.context.jsx
│       │   │   ├── auth.form.scss
│       │   │   ├── components
│       │   │   │   ├── Protected.jsx
│       │   │   │   └── Toast.jsx
│       │   │   ├── hooks
│       │   │   │   └── useAuth.js
│       │   │   ├── pages
│       │   │   │   ├── Login.jsx
│       │   │   │   └── Register.jsx
│       │   │   └── services
│       │   │       └── auth.api.js
│       │   │
│       │   └── interview
│       │       ├── interview.context.jsx
│       │       ├── hooks
│       │       │   └── useInterview.js
│       │       ├── pages
│       │       │   ├── Home.jsx        ← Resume + JD upload
│       │       │   ├── Interview.jsx   ← Report viewer
│       │       │   └── Reports.jsx     ← Past reports
│       │       ├── loader
│       │       │   ├── Loader.jsx
│       │       │   └── Loader.scss
│       │       ├── services
│       │       │   └── interview.api.js
│       │       └── style
│       │           ├── Home.scss
│       │           ├── Interview.scss
│       │           └── Reports.scss
│       │
│       └── style
│           ├── button.scss
│           └── style.scss
│
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas URI)
- [Groq API key](https://console.groq.com) (free tier available)

### 1. Clone

```bash
git clone https://github.com/sahilnikalje/skillbridge-ai.git
cd skillbridge-ai
```

### 2. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
# http://localhost:3000
```

### 3. Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
# http://localhost:5173
```

---

## 🌍 Deployed URLs

| Service | URL |
|---|---|
| 🌐 Frontend | [skillbridge-ai-1-ku8j.onrender.com](https://skillbridge-ai-1-ku8j.onrender.com) |
| ⚙️ Backend API | [skillbridge-ai-lacn.onrender.com](https://skillbridge-ai-lacn.onrender.com) |

> **Note:** Hosted on Render's free tier — the backend may take 30–60 seconds to wake up on first request.

---

## 🔑 API Reference

### Auth — `/api/auth`

| Method | Route | Description |
|---|---|---|
| `POST` | `/register` | Create a new account |
| `POST` | `/login` | Login, returns JWT |
| `POST` | `/logout` | Blacklists token, ends session |

### Interview — `/api/interview`

| Method | Route | Description |
|---|---|---|
| `POST` | `/generate` | Upload resume PDF + job description, generate report |
| `GET` | `/reports` | Get all past reports for current user |
| `GET` | `/reports/:id` | Get a single report by ID |
| `POST` | `/resume/:id` | Download ATS-friendly resume PDF for a report |

---
