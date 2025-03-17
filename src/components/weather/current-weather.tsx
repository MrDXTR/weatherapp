import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BorderBeam } from "~/components/magicui/border-beam";
import { motion } from "motion/react";
import { type WeatherData } from "~/lib/weather-api";
import {
  Droplets,
  Wind,
  Thermometer,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
} from "lucide-react";

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

export function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  // Get weather condition code to determine icon
  const conditionCode = weatherData.current.condition.code;
  const isDay = weatherData.current.is_day === 1;

  // Function to get appropriate weather icon
  const getWeatherIcon = () => {
    // This is a simplified version - you can expand based on condition codes
    if (conditionCode >= 200 && conditionCode < 300)
      return <CloudRain className="h-10 w-10" />; // Thunderstorm
    if (conditionCode >= 300 && conditionCode < 600)
      return <CloudRain className="h-10 w-10" />; // Drizzle and Rain
    if (conditionCode >= 600 && conditionCode < 700)
      return <CloudSnow className="h-10 w-10" />; // Snow
    if (conditionCode >= 700 && conditionCode < 800)
      return <CloudFog className="h-10 w-10" />; // Atmosphere (fog, mist)
    if (conditionCode === 800)
      return isDay ? (
        <Sun className="h-10 w-10" />
      ) : (
        <Sun className="h-10 w-10 opacity-50" />
      ); // Clear
    return <Cloud className="h-10 w-10" />; // Clouds
  };

  // Get background gradient based on weather and time of day
  const getCardBackground = () => {
    if (!isDay) return "bg-gradient-to-br from-indigo-900/80 to-purple-900/80";

    if (conditionCode === 800)
      return "bg-gradient-to-br from-blue-500/80 to-cyan-400/80"; // Clear
    if (conditionCode >= 200 && conditionCode < 600)
      return "bg-gradient-to-br from-slate-700/80 to-slate-900/80"; // Rain
    if (conditionCode >= 600 && conditionCode < 700)
      return "bg-gradient-to-br from-blue-300/80 to-indigo-400/80"; // Snow
    return "bg-gradient-to-br from-blue-400/80 to-blue-600/80"; // Default/Clouds
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl"
    >
      <Card
        className={`overflow-hidden backdrop-blur-md ${getCardBackground()}`}
      >
        <CardHeader className="pb-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {weatherData.location.name}
              </CardTitle>
              <p className="text-sm text-white/80">
                {weatherData.location.region}, {weatherData.location.country}
              </p>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="rounded-full bg-white/20 p-3 backdrop-blur-sm"
            >
              {getWeatherIcon()}
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="flex items-end">
                <span className="text-6xl font-bold text-white">
                  {Math.round(weatherData.current.temp_c)}
                </span>
                <span className="mb-2 text-2xl text-white/80">°C</span>
              </div>
              <p className="mt-1 text-white/90">
                {weatherData.current.condition.text}
              </p>
              <p className="text-sm text-white/70">
                Feels like {Math.round(weatherData.current.feelslike_c)}°C
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-3"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
              >
                <Wind className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Wind</p>
                  <p className="text-sm font-medium text-white">
                    {weatherData.current.wind_kph} km/h
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
              >
                <Droplets className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Humidity</p>
                  <p className="text-sm font-medium text-white">
                    {weatherData.current.humidity}%
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
              >
                <Thermometer className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">Pressure</p>
                  <p className="text-sm font-medium text-white">
                    {weatherData.current.pressure_mb} mb
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
              >
                <Sun className="h-5 w-5 text-white/80" />
                <div>
                  <p className="text-xs text-white/70">UV Index</p>
                  <p className="text-sm font-medium text-white">
                    {weatherData.current.uv}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
