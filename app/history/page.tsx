'use client'

import { useEffect, useState } from 'react';

interface Submission {
  id: number;
  user_answer: string;
  is_correct: boolean;
  feedback_text: string;
  created_at: string;
}

export default function Score() {
  const [history, setHistory] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const getSocre = async () => {
      try {
        const res = await fetch("/api/history", { method: "GET" });
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        setErrMsg("Could not load score");
      } finally {
        setLoading(false);
      }
    };
    getSocre();
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-100">📜 History</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {errMsg && <p className="text-red-500">{errMsg}</p>}

      {history.length === 0 && !loading && (
        <p className="text-gray-600 text-center">No history found yet.</p>
      )}

      <ul className="space-y-4">
        {history.map((item) => (
          <li
            key={item.id}
            className={`p-4 rounded-lg shadow-md border ${
              item.is_correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  item.is_correct ? "bg-green-200 text-black" : "bg-red-200 text-red-800"
                }`}
              >
                {item.is_correct ? "Correct" : "Incorrect"}
              </span>
            </div>
            <p className="mt-2 text-gray-700">
              <strong>Your Answer:</strong> {item.user_answer}
            </p>
            <p className="mt-1 text-gray-700">
              <strong>Feedback:</strong> {item.feedback_text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}