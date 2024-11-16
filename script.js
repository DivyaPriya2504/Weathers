const apiKey = 'YOUR_API_KEY'; // Replace with your actual API key
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('city');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const forecastContainer = document.getElementById('forecastContainer');

// Function to fetch weather data for a city
function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Current Weather Info
            cityName.textContent = data.name;
            temperature.textContent = `Temperature: ${data.main.temp} °C`;
            weatherCondition.textContent = `Weather: ${data.weather[0].description}`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

            // Fetch 5-day Forecast
            getForecastData(data.coord.lat, data.coord.lon);
        })
        .catch(err => alert("City not found"));
}

// Function to fetch 5-day forecast data
function getForecastData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            forecastContainer.innerHTML = ''; // Clear previous forecast
            data.list.slice(0, 5).forEach(item => {
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');

                const date = new Date(item.dt * 1000).toLocaleDateString();
                const icon = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;

                forecastItem.innerHTML = `
                    <p>${date}</p>
                    <img src="${icon}" alt="${item.weather[0].description}" />
                    <p>${item.main.temp} °C</p>
                `;

                forecastContainer.appendChild(forecastItem);
            });
        });
}

// Event listener for the search button
searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city');
    }
});
let isCelsius = true;  // Default unit is Celsius

// Function to toggle between Celsius and Fahrenheit
function toggleUnit() {
    isCelsius = !isCelsius;
    const unit = isCelsius ? 'metric' : 'imperial';
    const unitSymbol = isCelsius ? '°C' : '°F';
    
    // Update the button text
    document.getElementById('unitToggle').textContent = isCelsius ? 'Switch to Fahrenheit' : 'Switch to Celsius';
    
    // Fetch weather data again with the selected unit
    const city = cityInput.value || "London"; // Default to London if no city is provided
    getWeatherData(city, unit, unitSymbol);
}

// Update the fetch function to accept unit and unitSymbol
function getWeatherData(city, unit = 'metric', unitSymbol = '°C') {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Display the temperature in the selected unit
            temperature.textContent = `Temperature: ${data.main.temp} ${unitSymbol}`;
            // Other data...
        })
        .catch(err => alert("Error fetching weather data"));
}

// Event listener to toggle units
document.getElementById('unitToggle').addEventListener('click', toggleUnit);


// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.textContent = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark');  // Save dark mode preference
    } else {
        themeToggle.textContent = 'Switch to Dark Mode';
        localStorage.removeItem('theme');  // Remove dark mode preference
    }
});

