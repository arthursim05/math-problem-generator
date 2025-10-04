# Math Problem Generator - Developer Assessment Starter Kit

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **AI Integration**: Google Generative AI (Gemini)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/arthursim05/math-problem-generator.git
cd math-problem-generator
```
### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Edit `.env.local` and add your actual keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
   GOOGLE_API_KEY=your_actual_google_api_key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 1. Requirements Checklist

- [✅] AI generates appropriate Primary 5 level math problems
- [✅] Problems and answers are saved to Supabase
- [✅] User submissions are saved with feedback
- [✅] AI generates helpful, personalized feedback
- [✅] UI is clean and mobile-responsive
- [✅] Error handling for API failures
- [✅] Loading states during API calls

## Implementation Notes

### My Implementation:

- Built using **Next.js App Router** with client/server components.
- Integrated **Supabase** for database storage of problem submissions, score tracking, and history.
- Added **Google GenAI (Gemini)** integration to dynamically generate math problems.
- Designed a **clean, responsive UI** with Tailwind CSS, focusing on accessibility and usability.
- Implemented **difficulty levels (Easy / Medium / Hard)** and **problem types** (Addition, Subtraction, Multiplication, Division, Mixed).
- Built **score tracking** that calculates attempts, correct answers, streak, and best streak dynamically.
- Created a **history view** to display all past submissions, correctness, and feedback with timestamps.

### Design Decisions:

- Used **session IDs** to separate user problem sessions and keep stats/history unique per session.
- Calculated streak and best streak on the backend for consistency and accuracy.
- Chose **Supabase** because it provides both authentication and real-time database updates.
- Structured the project so that the API routes (`/api/math-problem`, `/api/math-problem/submit`, `/api/score`, `/api/history`) are reusable and scalable.

### Challenges Faced:

- Handling **synchronous score updates** (ensuring scoreboard refreshes after every submission).
- Maintaining **data consistency** between frontend state and Supabase records.
- Designing queries that efficiently compute streak and best streak without heavy computation.
- Handling AI responses from Gemini to ensure the math problem format is consistent.

### Features I'm Proud Of:

- ✅ Smooth **score tracking** with streaks & best streaks (gamified learning 🎯).  
- ✅ **History page** that gives students a clear record of their progress.  
- ✅ Modular API design (easy to extend with hints or step-by-step solutions later).  
- ✅ Clean UI with responsive design, making it feel like an interactive learning app.