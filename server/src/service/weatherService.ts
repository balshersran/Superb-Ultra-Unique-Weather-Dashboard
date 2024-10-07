import dotenv from 'dotenv';
import { query } from 'express';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: number;
  lat: number;
  name: string;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
class Weather {

  city: string;
  icon: string;
  iconDescription: string;
  date: number;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    icon: string,
    iconDescription: string,
    date: number,
    tempF: number,
    windSpeed: number,
    humidity: number) {
    this.city = city;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseUrl?: string;

  private apikey?: string;

  cityName: string = '';

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';

    this.apikey = process.env.API_KEY || '';

    this.cityName; 
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      const locationData = await response.json();
      return locationData;
    } catch (err) {
      console.log('Error:', err);
    }
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { name, country, state, lon, lat } = locationData;
    const destructureLocationData: Coordinates = {
      name: name,
      country: country,
      state: state,
      lon: lon,
      lat: lat,
    };
    return destructureLocationData;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&appid=${this.apikey}`;
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQueryUrl = `${this.baseUrl}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apikey}`;
    return weatherQueryUrl;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Coordinates {
    try {
      const response = await this.fetchLocationData(this.buildGeocodeQuery());
      const data = (response.json());
      const locationData: Coordinates = this.destructureLocationData( data );
      return locationData;
    } catch (err) {
      console.log('Error:', err);
    }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      const weatherData = await response.json();
      return weatherData;
    } catch (err) {
      console.log('Error:', err);
    }
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const parsedCurrentWeather = {
      city: response.name,
      icon: response.weather.icon,
      iconDescription: response.weather[0].descripton,
      date: response.dt,
      tempF: response.main.tempF,
      windSpeed: response.wind.speed,
      humidity: response.main.humidity,
    }
    return parsedCurrentWeather;
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const locationData: Coordinates = this.fetchAndDestructureLocationData();
    const weatherData = this.fetchWeatherData(locationData);
    
  }
}

export default new WeatherService();
