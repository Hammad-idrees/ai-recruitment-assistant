# AI Recruiter (Deep Agent Harness)

A small but complete AI agent harness built as a technical challenge.
This custom AI agent streamlines the recruiting workflow by evaluating candidates against job descriptions using reasoning, deterministic scoring, and structured outputs.

## 🚀 Features

- **Resume Parsing:** Upload candidate resumes (PDF/DOCX). Text is extracted and passed to the agent.
- **Job Matching:** Paste a job description. The agent compares the candidate's extracted skills and experience against the requirements.
- **ATS Score Calculation:** A deterministic scoring tool calculates the candidate's fit, while the LLM agent provides the contextual rationale.
- **Automated Interview Questions:** The agent drafts tailored interview questions focusing on missing skills or areas requiring deeper exploration.
- **Evaluation History & Persistence:** All candidate evaluations and agent chats are persisted to Supabase and can be reviewed in a premium dashboard.

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router, TS), Tailwind CSS, shadcn/ui.
- **Backend & Database:** Supabase (PostgreSQL, Storage for resumes).
- **Agent Framework:** `deepagents` (LangGraph.js-based harness).
- **LLM:** @langchain/google-genai / Anthropic.
- **Deployment:** Vercel.

## 🏗 Architecture & Agent Harness

This project implements a multi-step workflow driven by a single robust Deep Agent, rather than a generic chatbot. The agent is initialized using `createDeepAgent` with domain-specific tools:

1. `parseResumeTool`: Parses and structures the raw resume text.
2. `jobMatcherTool`: Compares the parsed resume with the job description.
3. `atsScoreCalculatorTool`: Computes a deterministic match score.
4. `dbSaveTool` / `dbRetrieveTool`: Interfaces with Supabase.
5. `interviewQuestionGeneratorTool`: Generates contextual questions based on the candidate's gaps.

State is maintained via Supabase (`chat_messages` and `evaluations` tables) to provide persistent memory for stateless Vercel Serverless Functions.

## 💻 Running Locally

### 1. Clone & Install
```bash
git clone <repository-url>
cd "AI Recruitment Assistant"
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Depending on the active model configuration:
ANTHROPIC_API_KEY=your_anthropic_key
# or
GOOGLE_API_KEY=your_google_key
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Design Decisions

- **Interactive Premium UI:** The frontend uses a custom glassmorphism aesthetic with animated marquees and fluid transitions (`tw-animate-css`) to provide a highly polished, interactive experience.
- **Security:** Resumes (PII) are stored in a private Supabase bucket and accessed only via server-generated signed URLs.
- **Stateless Vercel Compatibility:** The API layer specifically handles Chat History persistence on every turn to ensure the Deep Agent retains context between individual stateless HTTP requests.
