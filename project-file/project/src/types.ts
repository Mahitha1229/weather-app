export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  description: string;
  icon: string;
}

export interface GeocodingResult {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
}

export interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  fullName: string;
}