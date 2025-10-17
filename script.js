const button = document.getElementById('getWeather');
const input = document.getElementById('locationInput');
const output = document.getElementById('output');

// Function to fetch weather from your backend
async function fetchWeather(city) {
  try {
    output.innerHTML = '<p>Loading weather data...</p>';
    const response = await fetch(`/api/weather?city=${city}`);
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    const temp = data.current.temp_c;
    const condition = data.current.condition.text;
    const cityName = data.location.name;
    const country = data.location.country;

    output.innerHTML = `
      <h2>${cityName}, ${country}</h2>
      <p><strong>${temp}°C</strong></p>
      <p>${condition}</p>
      <img src="https:${data.current.condition.icon}" alt="weather icon" />
    `;
  } catch (error) {
    output.innerHTML = '<p>⚠️ Could not fetch weather. Please try again.</p>';
    console.error(error);
  }
}

// Button click: user-entered city
button.addEventListener('click', () => {
  const city = input.value.trim();
  if (!city) {
    output.innerHTML = '<p>Please enter a city name ❗</p>';
    return;
  }
  fetchWeather(city);
});

// Auto-detect user location on page load
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          output.innerHTML = '<p>Detecting your location...</p>';
          // Use WeatherAPI’s latitude & longitude query
          const response = await fetch(`/api/weather?city=${latitude},${longitude}`);
          const data = await response.json();

          if (data.error) throw new Error(data.error);

          const temp = data.current.temp_c;
          const condition = data.current.condition.text;
          const cityName = data.location.name;
          const country = data.location.country;

          output.innerHTML = `
            <h2>${cityName}, ${country}</h2>
            <p><strong>${temp}°C</strong></p>
            <p>${condition}</p>
            <img src="https:${data.current.condition.icon}" alt="weather icon" />
          `;
        } catch (err) {
          output.innerHTML = '<p>⚠️ Could not fetch weather for your location.</p>';
          console.error(err);
        }
      },
      () => {
        output.innerHTML = '<p>⚠️ Geolocation denied. Please enter a city.</p>';
      }
    );
  } else {
    output.innerHTML = '<p>⚠️ Geolocation not supported. Please enter a city.</p>';
  }
});
