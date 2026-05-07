export interface WeatherData {
  temp: number;
  feels_like: number;
  description: string;
  main: string;
  humidity: number;
  wind_speed: number;
  icon: string;
  location: string;
  country: string;
}

const BELAGAVI_LAT = 15.85;
const BELAGAVI_LON = 74.5;

export async function fetchWeather(): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenWeatherMap API key not configured');
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${BELAGAVI_LAT}&lon=${BELAGAVI_LON}&appid=${apiKey}&units=metric`
  );

  if (!response.ok) {
    throw new Error(`Weather API returned ${response.status}`);
  }

  const data = await response.json();

  return {
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    main: data.weather[0].main,
    humidity: data.main.humidity,
    wind_speed: Math.round(data.wind.speed),
    icon: data.weather[0].icon,
    location: data.name,
    country: data.sys.country,
  };
}
