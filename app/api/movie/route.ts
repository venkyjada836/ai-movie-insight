import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const imdbID = searchParams.get("id");

  if (!imdbID || !/^tt\d+$/.test(imdbID)) {
    return NextResponse.json(
      { error: "Invalid IMDb ID format" },
      { status: 400 }
    );
  }

  try {
    const movieRes = await fetch(
      `https://www.omdbapi.com/?i=${imdbID}&apikey=trilogy`
    );

    const movie = await movieRes.json();

    if (movie.Response === "False") {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    // Simulated AI sentiment logic
    let classification = "Mixed";
    const rating = parseFloat(movie.imdbRating);

    if (rating >= 8) classification = "Positive";
    else if (rating >= 6) classification = "Mixed";
    else classification = "Negative";

    const sentiment = {
      summary: `Audience response to "${movie.Title}" is generally ${classification.toLowerCase()}. Viewers appreciate its performances and storytelling, while some note minor weaknesses.`,
      classification,
    };

    return NextResponse.json({ movie, sentiment });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}