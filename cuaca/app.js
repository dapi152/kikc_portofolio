const searchForm = document.querySelector('#searchForm');
const cityInput = document.querySelector('#cityInput');
const formStatus = document.querySelector('#formStatus');
const weatherCodeMap = {
  0: ['Cerah', '☀'], 1: ['Cerah berawan', '◐'], 2: ['Berawan sebagian', '◐'], 3: ['Mendung', '☁'],
  45: ['Berkabut', '〰'], 48: ['Berkabut', '〰'], 51: ['Gerimis ringan', '雨'], 53: ['Gerimis', '雨'], 55: ['Gerimis lebat', '雨'],
  61: ['Hujan ringan', '☂'], 63: ['Hujan', '☂'], 65: ['Hujan lebat', '☂'], 71: ['Salju ringan', '✣'], 73: ['Salju', '✣'], 75: ['Salju lebat', '✣'],
  80: ['Hujan singkat', '☂'], 81: ['Hujan singkat', '☂'], 82: ['Hujan deras', '☂'], 95: ['Badai petir', 'ϟ'], 96: ['Badai petir', 'ϟ'], 99: ['Badai petir', 'ϟ']
};

const elements = {
  placeName: document.querySelector('#placeName'), placeMeta: document.querySelector('#placeMeta'), weatherDate: document.querySelector('#weatherDate'),
  temperature: document.querySelector('#temperature'), condition: document.querySelector('#condition'), weatherIcon: document.querySelector('#weatherIcon'),
  humidity: document.querySelector('#humidity'), wind: document.querySelector('#wind'), feelsLike: document.querySelector('#feelsLike')
};

function showStatus(message = '') { formStatus.textContent = message; }
function formatDate(value) { return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(value)); }

async function findCity(city) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=id&format=json`);
  if (!response.ok) throw new Error('Pencarian kota gagal.');
  const data = await response.json();
  if (!data.results?.length) throw new Error('Kota tidak ditemukan. Coba nama kota lain.');
  return data.results[0];
}

async function getWeather(city) {
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`);
  if (!response.ok) throw new Error('Data cuaca sedang tidak tersedia.');
  return response.json();
}

async function loadWeather(cityName) {
  showStatus('Mengambil data cuaca...');
  try {
    const city = await findCity(cityName);
    const weather = await getWeather(city);
    const current = weather.current;
    const [condition, icon] = weatherCodeMap[current.weather_code] || ['Kondisi tidak diketahui', '·'];
    elements.placeName.textContent = city.name;
    elements.placeMeta.textContent = [city.admin1, city.country].filter(Boolean).join(', ');
    elements.weatherDate.textContent = formatDate(current.time);
    elements.temperature.textContent = Math.round(current.temperature_2m);
    elements.condition.textContent = condition;
    elements.weatherIcon.textContent = icon;
    elements.humidity.textContent = `${current.relative_humidity_2m}%`;
    elements.wind.textContent = `${Math.round(current.wind_speed_10m)} km/jam`;
    elements.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°C`;
    showStatus('');
  } catch (error) {
    showStatus(error.message);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (cityInput.value.trim()) loadWeather(cityInput.value.trim());
});

loadWeather('Purwokerto');
