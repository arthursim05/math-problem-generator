'use client'

import { useEffect, useState } from 'react';

interface ScoreData {
  attempts: number;
  corrects: number;
  streak: number;
  bestStreak: number;
}

export default function Score() {
  const [score, setScore] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  useEffect(() => {
    const getSocre = async () => {
      try {
        const res = await fetch("/api/score", { method: "GET" });
        const data = await res.json();
        setScore(data);
      } catch (error) {
        setErrMsg("Could not load score");
      } finally {
        setLoading(false);
      }
    };
    getSocre();
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">📊 Score Tracker</h2>
      
      {loading && <p className="text-gray-500">Loading...</p>}
      {errMsg && <p className="text-red-500">{errMsg}</p>}

      {score && (
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-lg font-bold text-blue-700">{score.attempts}</p>
            <p className="text-sm text-gray-600">Attempts</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-lg font-bold text-green-700">{score.corrects}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-lg font-bold text-yellow-700">{score.streak}</p>
            <p className="text-sm text-gray-600">Current Streak 🔥</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-lg font-bold text-purple-700">{score.bestStreak}</p>
            <p className="text-sm text-gray-600">Best Streak 🏆</p>
          </div>
        </div>
      )}
    </div>
  )
}