import React, { useState } from 'react';
import { Cloud, Wind, Droplets, Thermometer } from 'lucide-react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import { WeatherData, LocationSuggestion } from './types';
import { API, weatherCodes } from './config/api';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeather = async (location: LocationSuggestion): Promise<WeatherData> => {
    const response = await fetch(
      `${API.weather}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.reason || 'Failed to fetch weather data');
    }

    const weatherCode = data.current.weather_code;
    const weatherInfo = weatherCodes[weatherCode] || {
      condition: 'Unknown',
      description: 'Unknown weather condition',
      icon: '01d'
    };

    return {
      city: location.name,
      country: location.country,
      temp: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      windSpeed: Math.round(data.current.wind_speed_10m * 3.6), // Convert m/s to km/h
      condition: weatherInfo.condition,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
    };
  };

  const handleSearch = async (location: LocationSuggestion) => {
    try {
      setLoading(true);
      setError(null);
      const weatherData = await getWeather(location);
      setWeather(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Weather App
        </h1>
        
        <SearchBar onSearch={handleSearch} />

        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 text-center text-white">Loading...</div>
        ) : (
          weather && <WeatherCard weather={weather} />
        )}
      </div>
    </div>
  );
}

export default App;