"use client";

import { useState } from "react";

export default function Home() {
  const [imdbID, setImdbID] = useState("");
  const [movie, setMovie] = useState<any>(null);
  const [sentiment, setSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
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
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setMovie(data.movie);
        setSentiment(data.sentiment);
      }
    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const badgeColor = (type: string) => {
    if (type === "Positive") return "bg-green-600";
    if (type === "Mixed") return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-800 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          🎬 AI Movie Insight Builder
        </h1>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Enter IMDb ID (tt0133093)"
            value={imdbID}
            onChange={(e) => setImdbID(e.target.value)}
            className="flex-1 p-4 rounded-xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition"
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
            <div className="grid md:grid-cols-2 gap-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="rounded-xl shadow-lg"
              />

              <div>
                <h2 className="text-3xl font-bold mb-4">
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

            {sentiment && (
              <div className="mt-10 bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold mb-4">
                  🤖 Audience Sentiment
                </h3>

                <p className="mb-6 text-gray-300">
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