const button = document.getElementById('getWeather');
const input = document.getElementById('locationInput');
const output = document.getElementById('output');

// WeatherAPI key and HTTPS base URL
const API_KEY = '48fd506a158b4749881134930251610';
const BASE_URL = 'https://api.weatherapi.com/v1/current.json';

// Function to fetch weather by city name or coordinates
async function fetchWeather(query) {
  try {
    output.innerHTML = '<p>Loading weather data...</p>';

    const response = await fetch(`${BASE_URL}?key=${API_KEY}&q=${query}&aqi=yes`);
    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const { temp_c, condition } = data.current;
    const { name: cityName, country } = data.location;

    output.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <p><strong>${temp_c}°C</strong></p>
      <p>${condition.text}</p>
      <img src="https:${condition.icon}" alt="Weather Icon" />
    `;
  } catch (error) {
    output.innerHTML = '<p>⚠️ Could not fetch weather. Please try again.</p>';
    console.error(error);
  }
}

// Fetch weather when user clicks the button
button.addEventListener('click', () => {
  const city = input.value.trim();
  if (!city) {
    output.innerHTML = '<p>Please enter a city name ❗</p>';
    return;
  }
  fetchWeather(city);
});

// Auto-detect weather based on user's geolocation
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
