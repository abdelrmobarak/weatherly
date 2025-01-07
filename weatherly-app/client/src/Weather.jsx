import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

function Weather(props) {
    const [input, setInput] = useState('');
    const [cityResults, setCityResults] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
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
                console.error('Error fetching data', error);
                setErrorMessage('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        }
    };

    function handleCitySelect(city){
        setSelectedCity(city);
        const lat = city.latitude;
        const lon = city.longitude;
        props.onSubmit(lat, lon, city);
        setCityResults([]);
    };

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

            {errorMessage && <p>{errorMessage}</p>}

            {cityResults.length > 0 && (
                <div className='cities'>
                    <ul>
                        {cityResults.map((city, index) => (
                            <li key={index} onClick={() => handleCitySelect(city)} className='citylist'>
                                {city.name}, {city.admin1} ({city.country})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <h1 className='name'>© weatherly</h1>
        </div>
    );
}

export default Weather;
