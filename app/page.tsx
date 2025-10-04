'use client'

import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import {Accordion, AccordionItem} from "@heroui/accordion"

type Difficulty = 'easy' | 'medium' | 'hard';
type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

interface MathProblem {
  problem_text: string
  final_answer: number
  hints: string
  stepbystep: string
  session_id?: string
};

export default function Home() {
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [operation, setOperation] = useState<Operation>('addition')
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '',
  });

  const generateProblem = async () => {
    // TODO: Implement problem generation logic
    // This should call your API route to generate a new problem
    // and save it to the database
    setIsLoading(true);
    setIsCorrect(null);
    setErrMsg(null);
    setUserAnswer('');
    setFeedback('');
    try {
      const res = await fetch("/api/math-problem", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          difficulty,
          operation,
        }),
      });
      const data = await res.json();
      if (data.problem_text && data.final_answer !== undefined) {
        setProblem({
          problem_text: data.problem_text,
          final_answer: data.final_answer,
          hints: data.hints || '',
          stepbystep: data.stepbystep || '',
          session_id: data.session_id || null,
        });
        setSessionId(data.session_id || null);
      } else {
        setErrMsg("Failed to generate problem. Please try again.");
      }
    } catch (error) {
      setErrMsg("Error generating problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement answer submission logic
    // This should call your API route to check the answer,
    // save the submission, and generate feedback
    setIsSubmitting(true);
    if (!problem || !sessionId) return;
    try {
      const res = await fetch("/api/math-problem/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          user_answer: userAnswer,
        }),
      });

      const data = await res.json();
      setFeedback(data.feedback);
      setIsCorrect(data.is_correct);
    } catch (error) { 
      setErrMsg("Error submitting answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className=" bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-8 max-w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Math Problem Generator
        </h1>
        
        <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-lg p-6 mb-6 gap-2">
          <button
            onClick={generateProblem}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
          >
            {isLoading ? 'Generating...' : 'Generate New Problem'}
          </button>
          <select className='rounded-lg border w-full text-gray-800' value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className='rounded-lg border w-full text-gray-800' value={operation} onChange={(e) => setOperation(e.target.value as Operation)}>
            <option value="add">Addition</option>
            <option value="sub">Subtraction</option>
            <option value="multi">Multiplication</option>
            <option value="div">Division</option>
          </select>
        </div>

        {problem && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Problem:</h2>
            <p className="text-lg text-gray-800 leading-relaxed mb-6">
              {problem.problem_text}
            </p>
            
            <form onSubmit={submitAnswer} className="space-y-4">
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer:
                </label>
                <input
                  type="number"
                  id="answer"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  placeholder="Enter your answer"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!userAnswer || isLoading || isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-105"
              >
                {isSubmitting ? "Submiting..." : "Submit Answer"}
              </button>
            </form>
          </div>
        )}

        {problem && 
          <div className='flex flex-row mb-6'>
            <Accordion variant="splitted">
              <AccordionItem key="1" aria-label="Accordion 1" title="Hints">
                {problem.hints}
              </AccordionItem>
            </Accordion>
            <Accordion variant="splitted">
              <AccordionItem key="1" aria-label="Accordion 1" title="Step By Step">
                {problem.stepbystep}
              </AccordionItem>
            </Accordion>
          </div>
        }

        {feedback && (
          <div className={`rounded-lg shadow-lg p-6 ${isCorrect ? 'bg-green-50 border-2 border-green-200' : 'bg-yellow-50 border-2 border-yellow-200'}`}>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {isCorrect ? '✅ Correct!' : '❌ Not quite right'}
            </h2>
            <p className="text-gray-800 leading-relaxed">{feedback}</p>
          </div>
        )}
      </main>
    </div>
  )
}