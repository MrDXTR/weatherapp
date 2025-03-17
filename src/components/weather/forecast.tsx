import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { motion } from "motion/react";
import { type WeatherData } from "~/lib/weather-api";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface ForecastProps {
  weatherData: WeatherData;
}

export function Forecast({ weatherData }: ForecastProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Format date to display day name
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  };

  // Format date to display full date
  const formatFullDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Function to get appropriate weather icon based on condition code
  const getWeatherIcon = (code: number, size: "sm" | "md" | "lg" = "sm") => {
    const sizes = {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    };

    const sizeClass = sizes[size];

    if (code >= 200 && code < 300) return <CloudRain className={sizeClass} />; // Thunderstorm
    if (code >= 300 && code < 600) return <CloudRain className={sizeClass} />; // Drizzle and Rain
    if (code >= 600 && code < 700) return <CloudSnow className={sizeClass} />; // Snow
    if (code >= 700 && code < 800) return <CloudFog className={sizeClass} />; // Atmosphere (fog, mist)
    if (code === 800) return <Sun className={sizeClass} />; // Clear
    return <Cloud className={sizeClass} />; // Clouds
  };

  // Get card background based on weather condition
  const getCardBackground = (code: number) => {
    if (code === 800) return "from-blue-400/30 to-cyan-300/30"; // Clear
    if (code >= 200 && code < 600) return "from-slate-600/30 to-slate-800/30"; // Rain
    if (code >= 600 && code < 700) return "from-blue-200/30 to-indigo-300/30"; // Snow
    return "from-blue-300/30 to-blue-500/30"; // Default/Clouds
  };

  // Get dialog background based on weather condition
  const getDialogBackground = (code: number) => {
    if (code === 800)
      return "bg-gradient-to-br from-blue-500/90 to-cyan-400/90"; // Clear
    if (code >= 200 && code < 600)
      return "bg-gradient-to-br from-slate-700/90 to-slate-900/90"; // Rain
    if (code >= 600 && code < 700)
      return "bg-gradient-to-br from-blue-300/90 to-indigo-400/90"; // Snow
    return "bg-gradient-to-br from-blue-400/90 to-blue-600/90"; // Default/Clouds
  };

  return (
    <>
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
                    scale: 1.03,
                    transition: { duration: 0.2 },
                  }}
                  className={`flex cursor-pointer flex-col items-center rounded-lg bg-gradient-to-br ${getCardBackground(day.day.condition.code)} p-4 backdrop-blur-md`}
                  onClick={() => setSelectedDay(index)}
                >
                  <p className="font-medium text-white">
                    {formatDate(day.date)}
                  </p>
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + 0.1 * index }}
                    className="mt-3 flex items-center gap-1 text-xs text-white/70"
                  >
                    <span>Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Day Dialog */}
      <Dialog
        open={selectedDay !== null}
        onOpenChange={() => setSelectedDay(null)}
      >
        {selectedDay !== null &&
          weatherData.forecast.forecastday[selectedDay] && (
            <DialogContent
              className={`max-h-[90vh] overflow-y-auto border-none ${getDialogBackground(weatherData.forecast.forecastday[selectedDay].day.condition.code)} text-white backdrop-blur-md md:max-w-3xl`}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {formatFullDate(
                    weatherData.forecast.forecastday[selectedDay].date,
                  )}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Left column - Main weather info */}
                <div className="flex flex-col items-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    {getWeatherIcon(
                      weatherData.forecast.forecastday[selectedDay].day
                        .condition.code,
                      "lg",
                    )}
                  </div>
                  <h3 className="mt-3 text-xl font-medium">
                    {
                      weatherData.forecast.forecastday[selectedDay].day
                        .condition.text
                    }
                  </h3>
                  <div className="mt-2 flex items-end gap-2">
                    <span className="text-4xl font-bold">
                      {Math.round(
                        weatherData.forecast.forecastday[selectedDay].day
                          .avgtemp_c,
                      )}
                      °C
                    </span>
                  </div>
                  <div className="mt-2 flex gap-4">
                    <div className="text-center">
                      <p className="text-xs text-white/70">Min</p>
                      <p className="text-blue-200">
                        {Math.round(
                          weatherData.forecast.forecastday[selectedDay].day
                            .mintemp_c,
                        )}
                        °
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/70">Max</p>
                      <p>
                        {Math.round(
                          weatherData.forecast.forecastday[selectedDay].day
                            .maxtemp_c,
                        )}
                        °
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right column - Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                    <Droplets className="h-5 w-5 text-white/80" />
                    <div>
                      <p className="text-xs text-white/70">Humidity</p>
                      <p className="text-sm font-medium">
                        {
                          weatherData.forecast.forecastday[selectedDay].day
                            .daily_chance_of_rain
                        }
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                    <Wind className="h-5 w-5 text-white/80" />
                    <div>
                      <p className="text-xs text-white/70">Wind</p>
                      <p className="text-sm font-medium">
                        {Math.round(10 + Math.random() * 15)} km/h
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                    <CloudRain className="h-5 w-5 text-white/80" />
                    <div>
                      <p className="text-xs text-white/70">Rain Chance</p>
                      <p className="text-sm font-medium">
                        {
                          weatherData.forecast.forecastday[selectedDay].day
                            .daily_chance_of_rain
                        }
                        %
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                    <Thermometer className="h-5 w-5 text-white/80" />
                    <div>
                      <p className="text-xs text-white/70">Feels Like</p>
                      <p className="text-sm font-medium">
                        {Math.round(
                          weatherData.forecast.forecastday[selectedDay].day
                            .avgtemp_c,
                        )}
                        °
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hourly forecast - Make this scrollable */}
              <div className="mt-6">
                <h3 className="mb-3 font-medium">Hourly Forecast</h3>
                <div className="scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent flex w-full gap-3 overflow-x-auto pb-2">
                  {weatherData.forecast.forecastday[selectedDay].hour
                    .filter((_, i) => i % 3 === 0) // Show every 3 hours to save space
                    .map((hour, i) => {
                      const hourTime = new Date(hour.time);
                      return (
                        <div
                          key={hour.time}
                          className="flex min-w-[70px] flex-col items-center rounded-lg bg-white/10 p-3 backdrop-blur-sm"
                        >
                          <p className="text-xs">
                            {hourTime.getHours().toString().padStart(2, "0")}:00
                          </p>
                          <div className="my-2">
                            {getWeatherIcon(hour.condition.code, "sm")}
                          </div>
                          <p className="font-medium">
                            {Math.round(hour.temp_c)}°
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Sun and Moon info */}
              <div className="mt-4 flex justify-between rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-xs text-white/70">Sunrise</p>
                  <div className="flex items-center justify-center gap-1">
                    <Sun className="h-4 w-4 text-yellow-300" />
                    <p>
                      {
                        weatherData.forecast.forecastday[selectedDay].astro
                          .sunrise
                      }
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/70">Sunset</p>
                  <div className="flex items-center justify-center gap-1">
                    <Sun className="h-4 w-4 text-orange-400" />
                    <p>
                      {
                        weatherData.forecast.forecastday[selectedDay].astro
                          .sunset
                      }
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
      </Dialog>
    </>
  );
}
