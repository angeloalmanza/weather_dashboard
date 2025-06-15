import axios from "axios";
import { useEffect, useState } from "react";

// Import componenti layout
import Header from "../components/Header";
import Footer from "../components/Footer";

// Import componenti dashboard
import DayNavigator from "../components/dashboard/DayNavigator";
import HeroSection from "../components/dashboard/HeroSection";
import QuickStats from "../components/dashboard/QuickStats";
import HourlyForecast from "../components/dashboard/HourlyForecast";
import DailyForecast from "../components/dashboard/DailyForecast";
import WeatherDetails from "../components/dashboard/WeatherDetails";

const DashboardPage = () => {
    // ===== CONFIGURAZIONE API =====
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const CITY_NAME = 'Lodi,IT';
    const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

    // ===== STATI PRINCIPALI =====
    const [dataCity, setDataCity] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    
    // Stati per navigazione giorni
    const [selectedDay, setSelectedDay] = useState(0);
    const [currentDisplayData, setCurrentDisplayData] = useState({});

    // ===== VALIDAZIONE API KEY =====
    if (!API_KEY) {
        console.error('API Key mancante! Verifica il file .env');
    }

    // ===== FETCH DATI API =====
    const fetchData = () => {
        setLoading(true);
        axios
            .all([
                axios.get(`${BASE_URL}?q=${CITY_NAME}&appid=${API_KEY}&units=metric&lang=it`),
                axios.get(`${FORECAST_URL}?q=${CITY_NAME}&appid=${API_KEY}&units=metric&lang=it`)
            ])
            .then(axios.spread((currentWeatherRes, forecastRes) => {
                setDataCity(currentWeatherRes.data);
                setForecastData(forecastRes.data.list);
                setLastUpdate(new Date());
                
                // Imposta i dati iniziali per oggi
                setCurrentDisplayData(currentWeatherRes.data);
                setSelectedDay(0);
            }))
            .catch(err => {
                setError('Errore nel caricamento dei dati meteo');
                console.error(err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ===== FUNZIONI HELPER =====
    const formatTemp = (temp) => temp ? `${Math.round(temp)}°C` : 'N/A';
    const formatSpeed = (speed) => speed ? `${Math.round(speed * 3.6)} km/h` : 'N/A';
    const capitalizeFirst = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

    // Helper per raggruppare le previsioni per data
    const groupByDate = (list) => {
        const map = {};
        list.forEach(item => {
            const dt = new Date(item.dt * 1000);
            const date = dt.toISOString().split('T')[0];
            if (!map[date]) map[date] = [];
            map[date].push(item);
        });
        return map;
    };

    // ===== GESTIONE NAVIGAZIONE GIORNI =====
    const handleDaySelect = (dayIndex, dayData, dayDate) => {
        setSelectedDay(dayIndex);
        
        if (dayIndex === 0) {
            // Se è oggi, usa i dati attuali
            setCurrentDisplayData(dataCity);
        } else {
            // Crea un oggetto con i dati del forecast per il giorno selezionato
            const dayItems = dayData;
            const temps = dayItems.map(item => item.main.temp);
            const humidities = dayItems.map(item => item.main.humidity);
            const pressures = dayItems.map(item => item.main.pressure);
            const winds = dayItems.map(item => item.wind.speed);
            
            // Prendi il dato più rappresentativo (mezzogiorno se disponibile)
            const mainItem = dayItems.find(item => {
                const hour = new Date(item.dt * 1000).getHours();
                return hour >= 12 && hour <= 14;
            }) || dayItems[0];

            const mockData = {
                name: dataCity.name,
                sys: dataCity.sys,
                coord: dataCity.coord,
                timezone: dataCity.timezone,
                clouds: mainItem.clouds,
                visibility: mainItem.visibility || dataCity.visibility,
                main: {
                    temp: mainItem.main.temp,
                    feels_like: mainItem.main.feels_like,
                    temp_min: Math.min(...temps),
                    temp_max: Math.max(...temps),
                    humidity: Math.round(humidities.reduce((a, b) => a + b, 0) / humidities.length),
                    pressure: Math.round(pressures.reduce((a, b) => a + b, 0) / pressures.length),
                },
                weather: mainItem.weather,
                wind: {
                    speed: winds.reduce((a, b) => a + b, 0) / winds.length,
                    deg: mainItem.wind.deg
                }
            };
            
            setCurrentDisplayData(mockData);
        }

        // Animazione di feedback visivo
        setTimeout(() => {
            const selectedCard = document.querySelector(`.day-selector-item:nth-child(${dayIndex + 1})`);
            if (selectedCard) {
                selectedCard.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    selectedCard.style.transform = 'scale(1)';
                }, 200);
            }
        }, 100);
    };

    // Funzione per ottenere il nome del giorno selezionato
    const getSelectedDayLabel = () => {
        if (selectedDay === 0) return "Oggi";
        if (selectedDay === 1) return "Domani";
        
        const groupedData = groupByDate(forecastData);
        const dates = Object.keys(groupedData).sort();
        if (dates[selectedDay]) {
            const date = new Date(dates[selectedDay]);
            return date.toLocaleDateString('it-IT', { weekday: 'long' });
        }
        return "Giorno selezionato";
    };

    // Funzione per ottenere le previsioni orarie del giorno selezionato
    const getSelectedDayHourlyForecast = () => {
        if (selectedDay === 0) {
            // Per oggi, mostra le prossime ore
            return forecastData.slice(0, 8);
        } else {
            // Per gli altri giorni, filtra per quella data
            const groupedData = groupByDate(forecastData);
            const dates = Object.keys(groupedData).sort();
            const selectedDate = dates[selectedDay];
            
            if (selectedDate && groupedData[selectedDate]) {
                return groupedData[selectedDate];
            }
            return [];
        }
    };

    // ===== STATI DI CARICAMENTO =====
    if (loading && !dataCity.name) {
        return (
            <div className="container min-height">
                <Header
                    cityName="Lodi"
                    onRefresh={fetchData}
                    loading={loading}
                    showRefresh={false}
                />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3 spinner" role="status">
                            <span className="visually-hidden">Caricamento...</span>
                        </div>
                        <h3>Caricamento dati meteo...</h3>
                        <p className="text-muted">Connessione a OpenWeatherMap in corso</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error && !dataCity.name) {
        return (
            <div className="container min-height">
                <Header
                    cityName="Lodi"
                    onRefresh={fetchData}
                    loading={loading}
                />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Ops! Qualcosa è andato storto</h4>
                            <p className="mb-3">{error}</p>
                            <button className="btn btn-outline-danger" onClick={fetchData}>
                                Riprova
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!dataCity.main) {
        return (
            <div className="container min-height">
                <Header
                    cityName="Lodi"
                    onRefresh={fetchData}
                    loading={loading}
                />
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
                    <div className="text-center">
                        <h3>Nessun dato disponibile</h3>
                        <button className="btn btn-primary mt-3" onClick={fetchData}>
                            Carica dati meteo
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ===== RENDER PRINCIPALE =====
    return (
        <div className="container min-height py-4">
            {/* Header Component */}
            <Header
                cityName={dataCity.name || "Lodi"}
                onRefresh={fetchData}
                loading={loading}
            />

            {/* Day Navigator - Elemento JavaScript Interattivo */}
            <DayNavigator 
                forecastData={forecastData}
                selectedDay={selectedDay}
                onDaySelect={handleDaySelect}
                getSelectedDayLabel={getSelectedDayLabel}
                groupByDate={groupByDate}
            />

            {/* Hero Section - Temperatura principale e condizioni */}
            <HeroSection 
                currentDisplayData={currentDisplayData}
                formatTemp={formatTemp}
                capitalizeFirst={capitalizeFirst}
            />

            {/* Quick Stats - 4 cards statistiche rapide */}
            <QuickStats 
                currentDisplayData={currentDisplayData}
                formatSpeed={formatSpeed}
            />

            {/* Hourly Forecast - Previsioni orarie del giorno selezionato */}
            <HourlyForecast 
                hourlyData={getSelectedDayHourlyForecast()}
                getSelectedDayLabel={getSelectedDayLabel}
            />

            {/* Daily Forecast - Previsioni giornaliere */}
            <DailyForecast 
                forecastData={forecastData}
                groupByDate={groupByDate}
            />

            {/* Weather Details - Alba/tramonto + dettagli info */}
            <WeatherDetails 
                selectedDay={selectedDay}
                dataCity={dataCity}
                currentDisplayData={currentDisplayData}
                getSelectedDayLabel={getSelectedDayLabel}
            />

            {/* Footer Component */}
            <Footer lastUpdate={lastUpdate} />
        </div>
    );
};

export default DashboardPage;