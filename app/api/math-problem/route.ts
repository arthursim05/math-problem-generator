import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service key for inserts
);

export async function POST() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    Generate ONE Primary 5 math word problem (Singapore standard).
    Respond strictly in JSON format:
    {
      "problem_text": "The word problem text here",
      "final_answer": <numeric_answer>
    }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from Gemini
    let problemData;
    try {
      problemData = JSON.parse(text);
    } catch (err) {
      console.error("JSON parse error:", text);
      return NextResponse.json(
        { error: "Invalid response from AI" },
        { status: 500 }
      );
    }

    // Save into Supabase
    // const { data, error } = await supabase
    //   .from("math_problem_sessions")
    //   .insert({
    //     problem_text: problemData.problem_text,
    //     final_answer: problemData.final_answer,
    //   })
    //   .select("id")
    //   .single();

    // if (error) {
    //   console.error("Supabase insert error:", error);
    //   return NextResponse.json({ error: "Database insert failed" }, { status: 500 });
    // }

    return NextResponse.json({
    //   session_id: data.id,
      problem_text: problemData.problem_text,
      final_answer: problemData.final_answer,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Problem generation failed" }, { status: 500 });
  }
}
