import { env } from "~/env";

export interface WeatherData {
  location: {
    name: string;
    country: string;
    region: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_mph: number;
    wind_dir: string;
    pressure_mb: number;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
    is_day: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        daily_chance_of_rain: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
      hour: Array<{
        time: string;
        temp_c: number;
        temp_f: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
      }>;
    }>;
  };
}

export async function getWeatherByCoordinates(
  latitude: number,
  longitude: number,
): Promise<WeatherData> {
  const apiKey = env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=5&aqi=no&alerts=no`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}

export async function getWeatherByPostalCode(
  postalCode: string,
): Promise<WeatherData> {
  const apiKey = env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${postalCode}&days=5&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);
      throw new Error(
        `Failed to fetch weather data: ${response.status} ${response.statusText}${
          errorData.error?.message ? ` - ${errorData.error.message}` : ""
        }`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("Weather API Error:", error);
    throw error;
  }
}

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const apiKey = env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(city)}&days=5&aqi=no&alerts=no`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}
