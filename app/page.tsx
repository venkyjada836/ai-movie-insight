"use client";

import { useState } from "react";

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movie, setMovie] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMovie = async () => {
    if (!imdbID) {
      setError("Please enter IMDb ID");
      return;
    }

    setLoading(true);
    setError("");
    setMovie(null);
    setSentiment(null);

    try {
      const res = await fetch(`/api/movie?id=${imdbID}`);
      const result = await res.json();

      if (!res.ok) {
        setError(result.error);
      } else {
        setMovie(result.movie);
        setSentiment(result.sentiment);
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const badgeColor = (type: string) => {
    if (type === "Positive") return "bg-green-500";
    if (type === "Mixed") return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-6 text-center">
          🎬 AI Movie Insight Builder
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter IMDb ID (tt0133093)"
            value={imdbID}
            onChange={(e) => setImdbID(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-neutral-800 border border-neutral-700"
          />
          <button
            onClick={fetchMovie}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          >
            Search
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {movie && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-800 p-6 rounded-2xl shadow-lg">
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="rounded-xl"
              />

              <div>
                <h2 className="text-3xl font-semibold mb-2">
                  {movie.Title}
                </h2>

                <p><strong>Year:</strong> {movie.Year}</p>
                <p><strong>Rating:</strong> {movie.imdbRating}</p>
                <p><strong>Cast:</strong> {movie.Actors}</p>

                <p className="mt-4 text-neutral-300">
                  {movie.Plot}
                </p>
              </div>
            </div>

            {sentiment && (
              <div className="bg-neutral-800 p-6 rounded-2xl mt-6 shadow-lg">
                <h3 className="text-2xl font-semibold mb-3">
                  🤖 AI Audience Insight
                </h3>

                <p className="mb-4 text-neutral-300">
                  {sentiment.summary}
                </p>

                <span
                  className={`px-4 py-2 rounded-full text-white ${badgeColor(
                    sentiment.classification
                  )}`}
                >
                  {sentiment.classification}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}