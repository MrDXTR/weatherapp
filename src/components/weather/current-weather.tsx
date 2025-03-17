import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BorderBeam } from "~/components/magicui/border-beam";
import { motion } from "motion/react";
import { type WeatherData } from "~/lib/weather-api";
import { Droplets, Wind, Thermometer, Sun } from "lucide-react";

interface CurrentWeatherProps {
  weatherData: WeatherData;
}

export function CurrentWeather({ weatherData }: CurrentWeatherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-black/50 backdrop-blur-md">
        <BorderBeam />
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-white"
            >
              {weatherData.location.name}, {weatherData.location.country}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl font-bold text-white"
            >
              {weatherData.current.temp_c}°C
            </motion.span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <motion.img
                src={`https:${weatherData.current.condition.icon}`}
                alt={weatherData.current.condition.text}
                width={80}
                height={80}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <span className="text-xl text-white">
                {weatherData.current.condition.text}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="flex items-center gap-2 text-white">
                <Thermometer className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-sm text-blue-200">Feels like</p>
                  <p className="font-medium">
                    {weatherData.current.feelslike_c}°C
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Droplets className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-sm text-blue-200">Humidity</p>
                  <p className="font-medium">{weatherData.current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Wind className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-sm text-blue-200">Wind</p>
                  <p className="font-medium">
                    {weatherData.current.wind_kph} km/h
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Sun className="h-5 w-5 text-blue-300" />
                <div>
                  <p className="text-sm text-blue-200">UV Index</p>
                  <p className="font-medium">{weatherData.current.uv}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
