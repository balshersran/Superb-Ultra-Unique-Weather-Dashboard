import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lon: number;
  lat: number;
}

// TODO: Define a class for the Weather object
class Weather {

  icon: string;
  iconDescription: string;
  date: number;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    icon: string,
    iconDescription: string,
    date: number,
    tempF: number,
    windSpeed: number,
    humidity: number) {
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
  private apiKey?: string;
  private city: string = '';

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const url = `${this.baseUrl}/data/2.5/weather?q=${query}&appid=${this.apiKey}`;

    try {
      const response = await fetch(url);
      if (!response) {
        throw new Error('error fetching http');
      }

      const locationData = await response.json()
      return this.destructureLocationData(locationData);
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }
  //   // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coordinates.lat,
      lon: locationData.coordinates.lon
    };
  }
  //   // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(_city: string): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${this.city}&appid=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return`${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    return await this.fetchLocationData(city);
  }
  //   // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    if (!response) {
      throw new Error('error fetching weather data');
    }
    return await response.json();
  }
  //   // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    return {
      city: response.city,
      icon: response.weather.icon,
      iconDescription: response.weather[0].description,
      date: response.dt,
      tempF: response.main.tempF,
      windSpeed: response.wind.speed,
      humidity: response.main.humidity,
    };
  }
  //   // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [];
    currentWeather = this.parseCurrentWeather(weatherData);

    forecastArray.push(currentWeather);

    return forecastArray;
  }

  //   // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<any> {
    try {
      const coordinates = await this.fetchAndDestructureLocationData(this.buildGeocodeQuery(city));
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);
      const forecastArr = this.buildForecastArray(currentWeather, weatherData.list);
  
      return {
          currentWeather,
          forecast: forecastArr,
      };
  } catch (error) {
      console.error("Error fetching weather data:", error);
      throw new Error("Failed to fetch weather data");
  }
  }
}
export default new WeatherService();

