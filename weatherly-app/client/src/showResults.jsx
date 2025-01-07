import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Results.css';

function Results({ lat, lon, selectedCity, setWeatherScreen, setResultScreen }) {
    const [weatherData, setWeatherData] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (lat && lon) {
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,is_day,precipitation&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`)
                .then(response => {
                    setWeatherData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching data', error);
                    setErrorMessage('An error occurred');
                });
        }
    }, [lat, lon]);

    // Formatting time for easy reading
    function formatTime(datetime) {
        if (!datetime) return ''; 
        const time = datetime.split('T')[1];
        const [hour, minute] = time.split(':'); 
        const hourInt = parseInt(hour, 10); 
        const period = hourInt >= 12 ? 'PM' : 'AM'; 
        const hour12 = hourInt % 12 || 12; 
        return `${hour12}:${minute} ${period}`; 
    };

    function backHome() {
        setWeatherScreen(true);
        setResultScreen(false);
    }
    
    return (
        <div>
            {weatherData ? (
                <div className='container'>
                    <h2 className='info'>Weather in {selectedCity.name}, {selectedCity.country}</h2>
                    <div className='grid-container'>
                        <div className='temperature'>
                            <h1>Temperature</h1>
                            <p>Current: {weatherData.current.temperature_2m}°C</p>
                            <p>Feels Like: {weatherData.current.apparent_temperature}°C</p>
                            <p className='tagline'>Have a great day!</p>
                        </div>
                        <div className='precipitation'>
                            <h1>Precipitation</h1>
                            <p>{weatherData.current.precipitation} mm</p>
                        </div>
                        <div className='sunrise'>
                            <h1>Sunrise</h1>
                            <p>{formatTime(weatherData.daily.sunrise[0])}</p>
                        </div>
                        <div className='sunset'>
                            <h1>Sunset</h1>
                            <p>{formatTime(weatherData.daily.sunset[0])}</p>
                        </div>
                    </div>
                    <button className='back' onClick={backHome}>Home</button>
                    <h1 className='foots'>© weatherly</h1>
                </div>
            ) : (
                <p>{errorMessage}</p>
            )}
    
        </div>
    );
}

export default Results;
