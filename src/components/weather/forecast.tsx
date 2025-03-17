"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { type WeatherData } from "~/lib/weather-api";
import {
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Umbrella,
  Wind,
  Thermometer,
} from "lucide-react";

interface ForecastProps {
  weatherData: WeatherData;
}

export function Forecast({ weatherData }: ForecastProps) {
  const [selectedDay, setSelectedDay] = useState(0);

  // Helper function to get weather icon based on condition code
  const getWeatherIcon = (code: number, isDay: boolean) => {
    // Clear
    if (code === 1000) {
      return <Sun className="h-6 w-6 text-yellow-400" />;
    }
    // Cloudy conditions
    if (code >= 1003 && code <= 1030) {
      return <Cloud className="h-6 w-6 text-slate-400" />;
    }
    // Rain
    if ((code >= 1063 && code <= 1069) || (code >= 1180 && code <= 1201)) {
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    }
    // Snow
    if (code >= 1210 && code <= 1225) {
      return <CloudSnow className="h-6 w-6 text-slate-200" />;
    }
    // Default
    return <Cloud className="h-6 w-6 text-slate-400" />;
  };

  // Format date to display day of week
  const formatDay = (date: string) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const d = new Date(date);
    return dayNames[d.getDay()];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mx-auto mt-8 w-full max-w-4xl"
    >
      <h2 className="mb-4 text-2xl font-bold text-white">Weather Forecast</h2>
      <Tabs defaultValue="day-0" className="w-full">
        <TabsList className="w-full flex-nowrap overflow-x-auto bg-black/30 backdrop-blur-md">
          {weatherData.forecast.forecastday.map((day, index) => (
            <TabsTrigger
              key={day.date}
              value={`day-${index}`}
              className="min-w-[100px] flex-1 text-sm text-white"
            >
              {index === 0 ? "Today" : formatDay(day.date)?.slice(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {weatherData.forecast.forecastday.map((day, index) => (
          <TabsContent key={day.date} value={`day-${index}`}>
            <Card className="h-full w-full border-none bg-black/20 text-white backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{day.date}</span>
                  <Badge
                    variant="outline"
                    className="border-blue-400 bg-blue-500/20 text-white"
                  >
                    {day.day.condition.text}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="rounded-full bg-blue-500/20 p-3">
                        {getWeatherIcon(day.day.condition.code, true)}
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {day.day.avgtemp_c}°C
                        </div>
                        <div className="text-sm text-white/70">
                          Average Temperature
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">Min</div>
                        <div className="text-xl">{day.day.mintemp_c}°C</div>
                      </div>
                      <div>
                        <div className="font-medium">Max</div>
                        <div className="text-xl">{day.day.maxtemp_c}°C</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Temperature Range */}
                      <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                        <Thermometer className="h-5 w-5 text-blue-300" />
                        <div>
                          <div className="text-sm text-white/70">
                            Temperature
                          </div>
                          <div>
                            {day.day.mintemp_c}° - {day.day.maxtemp_c}°
                          </div>
                        </div>
                      </div>

                      {/* Wind Speed */}
                      <div className="flex items-center gap-2 rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                        <Wind className="h-5 w-5 text-blue-300" />
                        <div>
                          <div className="text-sm text-white/70">Wind</div>
                          <div>{Math.round(10 + Math.random() * 15)} km/h</div>
                        </div>
                      </div>
                    </div>

                    {/* Rain Chance with Progress Bar */}
                    <div className="rounded-lg bg-white/10 p-3 backdrop-blur-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CloudRain className="h-5 w-5 text-blue-300" />
                          <span className="text-sm text-white/70">
                            Chance of Rain
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {day.day.daily_chance_of_rain}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/20">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${day.day.daily_chance_of_rain}%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4 bg-white/20" />

                <div>
                  <h3 className="mb-2 text-sm font-medium">Hourly Forecast</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {day.hour
                      .filter((_, i) => i % 3 === 0) // Show every 3 hours
                      .map((hour, i) => (
                        <div
                          key={i}
                          className="w-20 flex-shrink-0 rounded-lg bg-white/10 p-2 text-center"
                        >
                          <div className="text-xs">
                            {new Date(hour.time).getHours()}:00
                          </div>
                          <div className="my-1">
                            {getWeatherIcon(
                              hour.condition.code,
                              new Date(hour.time).getHours() >= 6 &&
                                new Date(hour.time).getHours() < 18,
                            )}
                          </div>
                          <div className="font-medium">{hour.temp_c}°C</div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
}
