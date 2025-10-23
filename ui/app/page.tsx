'use client'

import { useState, FormEvent, ChangeEvent } from "react";

interface AnalysisResult {
  summary: string;
  sentiment: "Positive" | "Negative" | "Neutral" | string;
  polarity?: number;
}

export default function Home() {
  const [text, setText] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
        <h1 className="text-center text-4xl font-semibold font-serif text-gray-800 mb-8">
          📰 News & Article Summarizer
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="url"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Enter Article URL
            </label>
            <input
              required
              id="url"
              name="url"
              type="url"
              placeholder="Paste a valid article URL..."
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 p-3 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Summarizing..." : "Summarize"}
          </button>
        </form>

        {result && (
          <div className="mt-8 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Summary</h2>
            <p className="text-gray-700 leading-relaxed">{result.summary}</p>

            <div className="mt-4 flex items-center justify-between">
              <p
                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  result.sentiment === "Positive"
                    ? "bg-green-100 text-green-700"
                    : result.sentiment === "Negative"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {result.sentiment}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
