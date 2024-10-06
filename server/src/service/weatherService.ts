import dotenv from 'dotenv';
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
class WeatherService implements Coordinates{
  // TODO: Define the baseURL, API key, and city name properties
  private baseUrl?: string;

  private apikey?: string;

  cityName: string = '';

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';

    this.apikey = process.env.API_KEY || '';

    this.cityName: '';
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
    const {name, country, state} = locationData;
    locationDataUrl = `${this.baseUrl}/data/2.5/weather?q=${name},${state},${country}&appid=${this.apikey}`;
    return locationData;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&appid=${this.apikey}`;
    return geocodeQuery;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseUrl}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apikey}`;
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
   try{
    const response = await fetch(this.fetchAndDestructureLocationData(locationDataUrl));
    const destructureLocationData = await this.fetchLocationData(response.json());
    return destructureLocationData;
   }catch(err){
    console.log('Error:', err);
   }
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try{
      const response = await fetch(coordinates);
      const weatherData = await response.json();
      return weatherData;
    }catch(err){
      console.log('Error:', err);
    }
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}

export default new WeatherService();
