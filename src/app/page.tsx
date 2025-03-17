"use client";

import { useEffect, useState } from "react";
import { CurrentWeather } from "~/components/weather/current-weather";
import { Forecast } from "~/components/weather/forecast";
import { LocationSearch } from "~/components/weather/location-search";
import { WeatherBackground } from "~/components/weather/weather-background";
import { motion } from "motion/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import {
  type WeatherData,
  getWeatherByCoordinates,
  getWeatherByPostalCode,
  getWeatherByCity,
} from "~/lib/weather-api";

export default function HomePage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWeather = async (
    method: "coordinates" | "postalCode" | "city",
    params: { lat?: number; lon?: number; postalCode?: string; city?: string },
  ) => {
    setLoading(true);
    setError(null);

    try {
      let data: WeatherData;

      if (method === "coordinates" && params.lat && params.lon) {
        data = await getWeatherByCoordinates(params.lat, params.lon);
      } else if (method === "postalCode" && params.postalCode) {
        data = await getWeatherByPostalCode(params.postalCode);
      } else if (method === "city" && params.city) {
        data = await getWeatherByCity(params.city);
      } else {
        throw new Error("Invalid parameters for weather fetch");
      }

      setWeatherData(data);
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";

      if (errorMessage.includes("404")) {
        setError(
          `Location not found. Please check your search terms and try again.`,
        );
      } else if (errorMessage.includes("429")) {
        setError("Too many requests. Please try again in a moment.");
      } else if (errorMessage.includes("401") || errorMessage.includes("403")) {
        setError("API authentication error. Please try again later.");
      } else if (errorMessage.includes("network")) {
        setError(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        setError(`Failed to load weather data: ${errorMessage}`);
      }

      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load default location on initial render
    const fetchDefaultWeather = async () => {
      const defaultLat = 28.6139; // New Delhi coordinates
      const defaultLon = 77.209;

      const success = await fetchWeather("coordinates", {
        lat: defaultLat,
        lon: defaultLon,
      });

      // If default location fails, try to get user's location
      if (!success && retryCount === 0) {
        try {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              await fetchWeather("coordinates", {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              });
            },
            (err) => {
              console.error("Geolocation error:", err);
              // Keep the existing error message
            },
          );
        } catch (geoErr) {
          console.error("Geolocation not supported:", geoErr);
        }
      }
    };

    fetchDefaultWeather().catch(console.error);
  }, [retryCount]);

  const handleLocationSelect = async (lat: number, lon: number) => {
    await fetchWeather("coordinates", { lat, lon });
  };

  const handlePostalCodeSearch = async (postalCode: string) => {
    await fetchWeather("postalCode", { postalCode });
  };

  const handleCitySearch = async (city: string) => {
    await fetchWeather("city", { city });
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  if (!weatherData && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-white">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weatherData && error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 to-black">
        <div className="max-w-md rounded-lg bg-black/50 p-8 backdrop-blur-md">
          <div className="mb-6 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>
          <h2 className="mb-4 text-center text-2xl font-bold text-white">
            Error Loading Weather
          </h2>
          <p className="text-center text-red-400">{error}</p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {weatherData && (
        <WeatherBackground weatherData={weatherData}>
          <div className="flex w-full flex-col items-center gap-6">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              onPostalCodeSearch={handlePostalCodeSearch}
              onCitySearch={handleCitySearch}
              isLoading={loading}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full max-w-3xl items-center gap-3 rounded-lg bg-red-500/20 p-4 text-red-200 backdrop-blur-md"
              >
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
                <button
                  onClick={handleRetry}
                  className="ml-auto rounded-full bg-white/10 p-1 hover:bg-white/20"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            <CurrentWeather weatherData={weatherData} />

            <Forecast weatherData={weatherData} />

            <motion.footer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 text-center text-sm text-white/60"
            >
              <p>Weather data provided by WeatherAPI.com</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <a
                  href="https://github.com/mrdxtr/weatherapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  View on GitHub
                </a>
                <p className="">© {new Date().getFullYear()} Weather App</p>
              </div>
            </motion.footer>
          </div>
        </WeatherBackground>
      )}
    </>
  );
}
