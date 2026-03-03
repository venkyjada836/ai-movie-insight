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
      setError("Please enter a valid IMDb ID (e.g., tt0133093)");
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 tracking-wide">
          🎬 AI Movie Insight Builder
        </h1>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter IMDb ID (tt0133093)"
            value={imdbID}
            onChange={(e) => setImdbID(e.target.value)}
            className="flex-1 p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            onClick={fetchMovie}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-semibold transition transform hover:scale-105"
          >
            Search
          </button>
        </div>

        {loading && (
          <p className="text-center text-indigo-400 animate-pulse">
            Loading movie details...
          </p>
        )}

        {error && (
          <p className="text-center text-red-400 font-medium">
            {error}
          </p>
        )}

        {movie && (
          <>
            {/* Movie Card */}
            <div className="grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transition hover:shadow-indigo-500/20">
              
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="rounded-2xl shadow-lg"
              />

              <div>
                <h2 className="text-3xl font-bold mb-3">
                  {movie.Title}
                </h2>

                <p className="mb-2 text-gray-300">
                  <strong>Year:</strong> {movie.Year}
                </p>

                <p className="mb-2 text-gray-300">
                  <strong>IMDb Rating:</strong> ⭐ {movie.imdbRating}
                </p>

                <p className="mb-4 text-gray-300">
                  <strong>Cast:</strong> {movie.Actors}
                </p>

                <p className="text-gray-400 leading-relaxed">
                  {movie.Plot}
                </p>
              </div>
            </div>

            {/* Sentiment Section */}
            {sentiment && (
              <div className="mt-10 bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold mb-4">
                  🤖 AI Audience Insight
                </h3>

                <p className="mb-6 text-gray-300 leading-relaxed">
                  {sentiment.summary}
                </p>

                <span
                  className={`px-6 py-2 rounded-full text-white font-semibold ${badgeColor(
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