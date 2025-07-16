import React from 'react';
import { Cloud, Wind, Droplets, Thermometer } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="mt-8 bg-white/20 backdrop-blur-sm rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {weather.city}, {weather.country}
          </h2>
          <p className="text-lg capitalize">{weather.description}</p>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.condition}
          className="w-20 h-20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Thermometer className="w-6 h-6" />
          <div>
            <p className="text-sm">Temperature</p>
            <p className="text-xl font-bold">{weather.temp}°C</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6" />
          <div>
            <p className="text-sm">Wind Speed</p>
            <p className="text-xl font-bold">{weather.windSpeed} km/h</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Droplets className="w-6 h-6" />
          <div>
            <p className="text-sm">Humidity</p>
            <p className="text-xl font-bold">{weather.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6" />
          <div>
            <p className="text-sm">Condition</p>
            <p className="text-xl font-bold">{weather.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;