import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { motion } from "motion/react";
import { type WeatherData } from "~/lib/weather-api";
import { Cloud, CloudRain, CloudSnow, CloudFog, Sun } from "lucide-react";

interface ForecastProps {
  weatherData: WeatherData;
}

export function Forecast({ weatherData }: ForecastProps) {
  // Format date to display day name
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Function to get appropriate weather icon based on condition code
  const getWeatherIcon = (code: number) => {
    if (code >= 200 && code < 300) return <CloudRain className="h-6 w-6" />; // Thunderstorm
    if (code >= 300 && code < 600) return <CloudRain className="h-6 w-6" />; // Drizzle and Rain
    if (code >= 600 && code < 700) return <CloudSnow className="h-6 w-6" />; // Snow
    if (code >= 700 && code < 800) return <CloudFog className="h-6 w-6" />; // Atmosphere (fog, mist)
    if (code === 800) return <Sun className="h-6 w-6" />; // Clear
    return <Cloud className="h-6 w-6" />; // Clouds
  };

  // Get card background based on weather condition
  const getCardBackground = (code: number) => {
    if (code === 800) return "from-blue-400/30 to-cyan-300/30"; // Clear
    if (code >= 200 && code < 600) return "from-slate-600/30 to-slate-800/30"; // Rain
    if (code >= 600 && code < 700) return "from-blue-200/30 to-indigo-300/30"; // Snow
    return "from-blue-300/30 to-blue-500/30"; // Default/Clouds
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full max-w-3xl"
    >
      <Card className="bg-black/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            {weatherData.forecast.forecastday.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                className={`flex flex-col items-center rounded-lg bg-gradient-to-br ${getCardBackground(day.day.condition.code)} p-4 backdrop-blur-md`}
              >
                <p className="font-medium text-white">{formatDate(day.date)}</p>
                <div className="my-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className="text-white"
                  >
                    {getWeatherIcon(day.day.condition.code)}
                  </motion.div>
                </div>
                <p className="text-center text-sm text-white/90">
                  {day.day.condition.text}
                </p>
                <div className="mt-3 flex w-full justify-between">
                  <span className="text-blue-200">
                    {Math.round(day.day.mintemp_c)}°
                  </span>
                  <span className="text-white">
                    {Math.round(day.day.maxtemp_c)}°
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${day.day.daily_chance_of_rain}%` }}
                    transition={{ duration: 1, delay: 0.5 + 0.1 * index }}
                    className="h-full bg-blue-400/70"
                  />
                </div>
                <p className="mt-1 text-xs text-blue-200">
                  Rain: {day.day.daily_chance_of_rain}%
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
