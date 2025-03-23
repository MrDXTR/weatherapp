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
        maxwind_kph: any;
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

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const response = await fetch(`/api/weather?q=${encodeURIComponent(city)}`);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}

export async function getWeatherByPostalCode(
  postalCode: string,
): Promise<WeatherData> {
  const response = await fetch(
    `/api/weather?q=${encodeURIComponent(postalCode)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}

export async function getWeatherByCoordinates(
  lat: number,
  lon: number,
): Promise<WeatherData> {
  const response = await fetch(`/api/weather?q=${lat},${lon}`);

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return response.json();
}
