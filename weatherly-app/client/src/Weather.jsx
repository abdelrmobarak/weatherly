import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css'


function Weather() {
    const [input, setInput] = useState('');
    const [cityResults, setCityResults] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');  


    const searchCities = async () => {
        if (input) {
            setLoading(true);
            setErrorMessage('');  
            try {
                const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                    params: {
                        name: input,
                        count: 10,
                        language: 'en',
                        format: 'json',
                    }
                });

                if (response.data.results.length === 0) {
                    setErrorMessage('No cities found. Please try again with a different name.');
                } else {
                    setCityResults(response.data.results);
                }
            } catch (error) {
                console.error('Error fetching city data', error);
                setErrorMessage('An error occurred while fetching city data. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setLat(city.latitude);
        setLon(city.longitude);
        setCityResults([]);
    };

    useEffect(() => {
        if (lat && lon) {
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,precipitation&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,daylight_duration`)
                .then(response => {
                    setWeatherData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching weather data', error);
                    setErrorMessage('An error occurred while fetching weather data. Please try again.');
                });
        }
    }, [lat, lon]);

    return (
        <div className='container'>
            <input
                type='text'
                placeholder='Enter City Name'
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={searchCities} disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
            </button>

            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}

            {cityResults.length > 0 && (
                <div>
                    <h3>Select the City Here:</h3>
                    <ul>
                        {cityResults.map((city, index) => (
                            <li
                                key={index}
                                onClick={() => handleCitySelect(city)}
                                style={{ cursor: 'pointer' }}
                            >
                                {city.name}, {city.admin1} ({city.country})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedCity && (
                <div>
                    <h2>Selected City: {selectedCity.name}, {selectedCity.admin1}</h2>
                    <p>Country: {selectedCity.country}</p>
                </div>
            )}

            {weatherData && (
                <div>
                    <h2>Weather Information</h2>
                    <p>Current Temperature: {weatherData.current.temperature_2m}°C</p>
                    <p>Apparent Temperature: {weatherData.current.apparent_temperature}°C</p>
                    <p>Precipitation: {weatherData.current.precipitation} mm</p>
                </div>
            )}
        </div>
    );
}

export default Weather;
