import { NextResponse } from "next/server";
import { env } from "~/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  const apiKey = env.OPENWEATHER_API_KEY; // No NEXT_PUBLIC_ prefix
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=5&aqi=no&alerts=no`,
  );

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error?.message || "Failed to fetch weather data" },
      { status: response.status },
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}
