import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { motion } from "motion/react";
import { type WeatherData } from "~/lib/weather-api";

interface ForecastProps {
  weatherData: WeatherData;
}

export function Forecast({ weatherData }: ForecastProps) {
  // Format date to display day name
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-black/50 backdrop-blur-md">
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
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center rounded-lg bg-black/30 p-3 text-white"
              >
                <p className="font-medium">{formatDate(day.date)}</p>
                <motion.img
                  src={`https:${day.day.condition.icon}`}
                  alt={day.day.condition.text}
                  width={50}
                  height={50}
                  className="my-2"
                  whileHover={{ rotate: 10 }}
                />
                <p className="text-sm">{day.day.condition.text}</p>
                <div className="mt-2 flex w-full justify-between">
                  <span className="text-blue-300">{day.day.mintemp_c}°</span>
                  <span>{day.day.maxtemp_c}°</span>
                </div>
                <p className="mt-1 text-xs text-blue-300">
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
