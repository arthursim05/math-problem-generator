import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenAI } from "@google/genai";

interface ProblemResponse {
  session_id: string;
  problem_text: string;
  final_answer: number;
};

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const genAi = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // use service key for inserts
);

export async function POST(req: Request) {
  try {
    const { session_id, user_answer } = await req.json();

    if (!session_id || user_answer === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: session, error: fetchError } = await supabase
      .from("math_problem_sessions")
      .select("problem_text, correct_answer")
      .eq("id", session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const { problem_text, correct_answer } = session;
    const isCorrect = Number(user_answer) === Number(correct_answer);

    const prompt = `
    A student attempted this math problem:

    Problem: ${problem_text}
    Correct Answer: ${correct_answer}
    Student's Answer: ${user_answer}
    Result: ${isCorrect ? "Correct" : "Incorrect"}

    Write short, encouraging feedback:
    - If correct: praise and encourage.
    - If incorrect: explain the mistake simply and guide them towards the right reasoning.
    Limit response to 3-4 sentences.
    `;

    const response = await genAi.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const feedback = response.text.trim();

    // Save submission
    const { error: insertError } = await supabase
      .from("math_problem_submissions")
      .insert({
        session_id,
        user_answer,
        is_correct: isCorrect,
        feedback_text: feedback,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
    }

    return NextResponse.json({
      is_correct: isCorrect,
      feedback,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Problem generation failed" }, { status: 500 });
  }
}
