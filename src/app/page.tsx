"use client";

import { useEffect, useState } from "react";
import { CurrentWeather } from "~/components/weather/current-weather";
import { Forecast } from "~/components/weather/forecast";
import { LocationSearch } from "~/components/weather/location-search";
import { AuroraBackground } from "~/components/ui/aurora-background";
import { Meteors } from "~/components/magicui/meteors";
import { motion } from "motion/react";
import { env } from "~/env";
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

  useEffect(() => {
    // Load default location on initial render
    const fetchDefaultWeather = async () => {
      try {
        const defaultLat = 28.6139; // New Delhi coordinates
        const defaultLon = 77.209;
        const data = await getWeatherByCoordinates(defaultLat, defaultLon);
        setWeatherData(data);
      } catch (err) {
        setError("Failed to load default weather data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultWeather().catch(console.error);
  }, []);

  const handleLocationSelect = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCoordinates(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError("Failed to load weather data for your location");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostalCodeSearch = async (postalCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByPostalCode(postalCode);
      setWeatherData(data);
    } catch (err) {
      setError(`Failed to load weather data for postal code: ${postalCode}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherByCity(city);
      setWeatherData(data);
    } catch (err) {
      setError(`Failed to load weather data for city: ${city}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="min-h-screen">
      <Meteors number={10} />
      <div className="container max-w-4xl px-4 py-8">
        <motion.h1
          className="mb-8 text-center text-4xl font-bold text-black"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Weather Forecast
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            onPostalCodeSearch={handlePostalCodeSearch}
            onCitySearch={handleCitySearch}
          />
        </motion.div>

        {error && (
          <motion.div
            className="mb-6 rounded-lg bg-red-500/20 p-4 text-center text-red-200"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <motion.div
            className="flex h-64 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xl text-white">Loading weather data...</div>
          </motion.div>
        ) : (
          weatherData && (
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CurrentWeather weatherData={weatherData} />
              <Forecast weatherData={weatherData} />
            </motion.div>
          )
        )}
      </div>
    </AuroraBackground>
  );
}
