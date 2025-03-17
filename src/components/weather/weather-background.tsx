import { Meteors } from "~/components/magicui/meteors";
import { type WeatherData } from "~/lib/weather-api";
import { motion } from "motion/react";

interface WeatherBackgroundProps {
  weatherData: WeatherData;
  children: React.ReactNode;
}

export function WeatherBackground({
  weatherData,
  children,
}: WeatherBackgroundProps) {
  const conditionCode = weatherData.current.condition.code;
  const isDay = weatherData.current.is_day === 1;

  // Determine background colors based on weather condition and time of day
  const getBackgroundColors = () => {
    if (!isDay) {
      return {
        bgColor: "bg-gradient-to-b from-slate-900 via-purple-950 to-slate-900",
        showMeteors: true,
        meteorColor: "white",
      };
    }

    // Day time conditions
    if (conditionCode === 800) {
      // Clear sky
      return {
        bgColor: "bg-gradient-to-b from-blue-400 via-sky-500 to-blue-600",
        showMeteors: false,
        meteorColor: "white",
      };
    }

    if (conditionCode >= 200 && conditionCode < 300) {
      // Thunderstorm
      return {
        bgColor: "bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900",
        showMeteors: true,
        meteorColor: "blue",
      };
    }

    if (conditionCode >= 300 && conditionCode < 600) {
      // Rain
      return {
        bgColor: "bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700",
        showMeteors: true,
        meteorColor: "blue",
      };
    }

    if (conditionCode >= 600 && conditionCode < 700) {
      // Snow
      return {
        bgColor: "bg-gradient-to-b from-slate-200 via-blue-100 to-slate-300",
        showMeteors: true,
        meteorColor: "white",
      };
    }

    // Default for cloudy conditions
    return {
      bgColor: "bg-gradient-to-b from-blue-300 via-blue-400 to-blue-500",
      showMeteors: false,
      meteorColor: "white",
    };
  };

  const { bgColor, showMeteors, meteorColor } = getBackgroundColors();

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-1000`}>
      {/* Animated weather elements */}
      {showMeteors && <Meteors number={isDay ? 20 : 40} />}

      {/* Sun or moon */}
      {isDay && conditionCode === 800 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute right-10 top-10 h-20 w-20 rounded-full bg-yellow-300 shadow-[0_0_40px_20px_rgba(253,224,71,0.7)]"
        />
      )}

      {!isDay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute right-10 top-10 h-16 w-16 rounded-full bg-slate-200 shadow-[0_0_30px_10px_rgba(226,232,240,0.3)]"
        />
      )}

      {/* Clouds for cloudy weather */}
      {conditionCode > 800 && isDay && (
        <>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.7 }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute left-10 top-20 h-16 w-32 rounded-full bg-white/80 blur-md"
          />
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 0.9 }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2,
            }}
            className="absolute right-20 top-40 h-20 w-40 rounded-full bg-white/80 blur-md"
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 py-8">
        {children}
      </div>
    </div>
  );
}
