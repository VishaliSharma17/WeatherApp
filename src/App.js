import React, { useEffect, useState } from "react";
import TopButtons from "./Component/TopButtons";
import Inputs from "./Component/Inputs";
import "./App.css";
import TimeAndLocation from "./Component/TimeAndLocation";
import TempAndDetails from "./Component/TempAndDetails";
import Forecast from "./Component/Forecast";
import getFormattedWeatherData from "./services/weatherService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function captializeFirstLetter(string){
  return string.charAt(0).toUpperCase() +string.slice(1);
}

const App = () => {
  const [query, setQuery] = useState({ q: "Shimla" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    const cityName=query.q ? query.q :'current location';
    toast.info(`Fetching weather data for ${captializeFirstLetter(cityName)}`);
    await getFormattedWeatherData({...query,units}).then((data) => {
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`);
      setWeather(data);
    });
    // console.log(data);
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);
   

  const formatBackground=()=>{
    if(!weather) return "from-cyan-600 to-blue-700";
    const threshold=units=== "metric"? 20 :60
    if(weather.temp<=threshold) return "from-cyan-600 to-blue-700";
    return "from-orange-600 to-red-700";
  }
  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400
    ${formatBackground()}`}>
      <TopButtons setQuery={setQuery} />
      <Inputs  setQuery={setQuery} setUnits={setUnits} />
      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} units={units}/>
          <Forecast title='3 hour step forecast' data={weather.hourly}/>
          <Forecast title='daily forecast' data={weather.daily}/>
        </>
      )}

     <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored"/>
    </div>
  );
};

export default App;
