const button = document.getElementById('getWeather');
const input = document.getElementById('locationInput');
const output = document.getElementById('output');

// WeatherAPI key and base URL
const API_KEY = '48fd506a158b4749881134930251610';
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

// Function to fetch weather by city or coordinates
async function fetchWeather(query) {
  try {
    output.innerHTML = '<p>Loading weather data...</p>';

    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&aqi=yes`);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const temp = data.current.temp_c;
    const condition = data.current.condition.text;
    const icon = data.current.condition.icon;
    const cityName = data.location.name;
    const country = data.location.country;

    output.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <p><strong>${temp}°C</strong></p>
      <p>${condition}</p>
      <img src="https:${icon}" alt="weather icon" />
    `;
  } catch (error) {
    output.innerHTML = '<p>⚠️ Could not fetch weather. Please try again.</p>';
    console.error(error);
  }
}

// Button click: fetch weather by city
button.addEventListener('click', () => {
  const city = input.value.trim();
  if (!city) {
    output.innerHTML = '<p>Please enter a city name ❗</p>';
    return;
  }
  fetchWeather(city);
});

// On page load: auto-detect user location
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(`${latitude},${longitude}`);
      },
      () => {
        output.innerHTML = '<p>⚠️ Geolocation denied. Please enter a city.</p>';
      }
    );
  } else {
    output.innerHTML = '<p>⚠️ Geolocation not supported. Please enter a city.</p>';
  }
});
