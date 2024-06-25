const apiKey = 'a6cf2f2a58bfd200537b4287313c179b';
let cityHistory = JSON.parse(localStorage.getItem('cityHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    loadSearchHistory();
});

function searchCity() {
    const city = document.getElementById('city-input').value;
    if (city) {
        fetchWeatherData(city);
        addCityToHistory(city);
    }
}

function fetchWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayCurrentWeather(data))
        .catch(error => console.error('Error fetching current weather:', error));
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayForecast(data))
        .catch(error => console.error('Error fetching forecast:', error));
}

function displayCurrentWeather(data) {
    if (!data || !data.weather || !data.weather[0]) {
        console.error('Invalid data structure for current weather:', data);
        return;
    }

    const currentWeatherInfo = document.getElementById('current-weather-info');
    const weatherItem = `
        <div class="weather-item">
            <div>
                <p>Date: ${new Date(data.dt * 1000).toLocaleDateString()}</p>
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                <p>Temperature: ${data.main.temp} °F</p>
                <p>Humidity: ${data.main.humidity} %</p>
                <p>Wind Speed: ${data.wind.speed} mph</p>
            </div>
        </div>
    `;
    currentWeatherInfo.innerHTML = weatherItem;
}

function displayForecast(data) {
    if (!data || !data.list) {
        console.error('Invalid data structure for forecast:', data);
        return;
    }

    const forecastInfo = document.getElementById('forecast-info');
    let forecastItems = '';

    data.list.forEach((forecast, index) => {
        if (new Date(forecast.dt * 1000).getHours() === 12) {
            const forecastItem = `
                <div class="weather-item">
                    <div>
                        <p>Date: ${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
                        <p>Temperature: ${forecast.main.temp} °F</p>
                        <p>Humidity: ${forecast.main.humidity} %</p>
                        <p>Wind Speed: ${forecast.wind.speed} mph</p>
                    </div>
                </div>
            `;
            forecastItems += forecastItem;
        }
    });

    forecastInfo.innerHTML = forecastItems;
}

function addCityToHistory(city) {
    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
        localStorage.setItem('cityHistory', JSON.stringify(cityHistory));
        loadSearchHistory();
    }
}

function loadSearchHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    cityHistory.forEach(city => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        listItem.onclick = () => fetchWeatherData(city);
        historyList.appendChild(listItem);
    });
}