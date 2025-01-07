import React, { useState } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Weather from './Weather.jsx';
import Results from './showResults.jsx';

function App() {
  const [weatherScreen, setWeatherScreen] = useState(true);
  const [resultScreen, setResultScreen] = useState(false);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);

  function onSubmit(lat, lon, city) {
    setLat(lat);
    setLon(lon);
    setSelectedCity(city);
    setWeatherScreen(false);
    setResultScreen(true);
  }

  function homeClick() {
    setWeatherScreen(true);
    setResultScreen(false);
  }
  const props = {
    setWeatherScreen,
    setResultScreen,
  };

  if (weatherScreen) {
    return(
    <Weather onSubmit={onSubmit} {...props} />)
  }
  if (resultScreen) {
    return(
    <Results {...props} onSubmit={homeClick} lat={lat} lon={lon} selectedCity={selectedCity} />)
  }
}

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
