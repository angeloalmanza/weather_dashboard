import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardPage = () => {

    // Variabili
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const CITY_NAME = 'Lodi,IT';
    const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

    const [dataCity, setDataCity] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    
    // 🎯 NUOVI STATI per la navigazione giorni
    const [selectedDay, setSelectedDay] = useState(0); // 0 = oggi, 1 = domani, etc.
    const [currentDisplayData, setCurrentDisplayData] = useState({});

    if (!API_KEY) {
        console.error('API Key mancante! Verifica il file .env');
    }

    // Chiamata Api
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

    // Funzioni helper
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

    // 🎯 FUNZIONE JAVASCRIPT INTERATTIVA - Cambio giorno
    const handleDaySelect = (dayIndex, dayData, dayDate) => {
        setSelectedDay(dayIndex);
        
        if (dayIndex === 0) {
            // Se è oggi, usa i dati attuali
            setCurrentDisplayData(dataCity);
        } else {
            // Crea un oggetto simile ai dati attuali ma con i dati del forecast
            const dayItems = dayData;
            const temps = dayItems.map(item => item.main.temp);
            const humidities = dayItems.map(item => item.main.humidity);
            const pressures = dayItems.map(item => item.main.pressure);
            const winds = dayItems.map(item => item.wind.speed);
            
            // Prendi il dato più rappresentativo (mezzogiorno se disponibile, altrimenti il primo)
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

    // Loading state
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

    // Error state
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
                            <h4 className="alert-heading">
                                Ops! Qualcosa è andato storto
                            </h4>
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

    // Controlla se i dati sono caricati
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

    return (
        <div className="container min-height py-4">
            {/* Header Component */}
            <Header
                cityName={dataCity.name || "Lodi"}
                onRefresh={fetchData}
                loading={loading}
            />

            {/* 📅 NAVIGATORE GIORNI - Elemento JavaScript Interattivo */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-lg day-navigator-card">
                        <div className="card-header day-navigator-header">
                            <h5 className="card-title mb-0 text-white">
                                📅 Seleziona Giorno - <span className="selected-day-label">{getSelectedDayLabel()}</span>
                            </h5>
                        </div>
                        <div className="card-body p-2">
                            <div className="day-selector-scroll">
                                {Object.entries(groupByDate(forecastData)).slice(0, 4).map(([date, items], index) => {
                                    const temps = items.map(i => i.main.temp);
                                    const min = Math.min(...temps);
                                    const max = Math.max(...temps);
                                    const icon = items[0].weather[0].icon;
                                    const description = items[0].weather[0].description;
                                    
                                    const dayLabel = index === 0 ? 'Oggi' : 
                                                   index === 1 ? 'Domani' : 
                                                   new Date(date).toLocaleDateString('it-IT', { weekday: 'short' });
                                    
                                    const displayDate = new Date(date).toLocaleDateString('it-IT', { 
                                        day: '2-digit', 
                                        month: '2-digit' 
                                    });
                                    
                                    return (
                                        <div 
                                            key={index} 
                                            className={`day-selector-item ${selectedDay === index ? 'selected' : ''}`}
                                            onClick={() => handleDaySelect(index, items, date)}
                                        >
                                            <div className="day-name">{dayLabel}</div>
                                            <div className="day-date">{displayDate}</div>
                                            <img
                                                src={`https://openweathermap.org/img/wn/${icon}.png`}
                                                alt={description}
                                                className="day-icon"
                                                width="40"
                                            />
                                            <div className="day-temps">
                                                <span className="temp-max">{Math.round(max)}°</span>
                                                <span className="temp-min">{Math.round(min)}°</span>
                                            </div>
                                            {selectedDay === index && (
                                                <div className="selected-indicator">✓</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🎯 HERO SECTION - Usa currentDisplayData */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-lg hero-card">
                        <div className="card-body text-center py-5">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    {/* Temperatura principale */}
                                    <div className="temperature-display text-white">
                                        <span className="current-temp">{formatTemp(currentDisplayData.main?.temp)}</span>
                                        <div className="temp-range mt-2">
                                            <small>
                                                ⬇️ {formatTemp(currentDisplayData.main?.temp_min)} • 
                                                ⬆️ {formatTemp(currentDisplayData.main?.temp_max)}
                                            </small>
                                        </div>
                                        <div className="feels-like mt-1">
                                            <small>Percepita {formatTemp(currentDisplayData.main?.feels_like)}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {/* Condizione meteo con icona */}
                                    <div className="weather-condition text-white">
                                        <img
                                            src={`https://openweathermap.org/img/wn/${currentDisplayData.weather?.[0]?.icon}@4x.png`}
                                            alt={currentDisplayData.weather?.[0]?.description}
                                            className="weather-icon"
                                            style={{ width: '120px', height: '120px' }}
                                        />
                                        <h4 className="mt-2 mb-0">
                                            {capitalizeFirst(currentDisplayData.weather?.[0]?.description || '')}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 💨 DETTAGLI RAPIDI - Usa currentDisplayData */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat humidity-card">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">💧</div>
                            <div className="stat-label">Umidità</div>
                            <div className="stat-value">{currentDisplayData.main?.humidity}%</div>
                            <div className="progress mt-2" style={{ height: '4px' }}>
                                <div className="progress-bar bg-info" style={{ width: `${currentDisplayData.main?.humidity}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat wind-card">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">💨</div>
                            <div className="stat-label">Vento</div>
                            <div className="stat-value">{formatSpeed(currentDisplayData.wind?.speed)}</div>
                            <div className="wind-direction mt-1">
                                🧭 {currentDisplayData.wind?.deg ? `${currentDisplayData.wind.deg}°` : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat visibility-card">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">👁️</div>
                            <div className="stat-label">Visibilità</div>
                            <div className="stat-value">
                                {currentDisplayData.visibility ? `${(currentDisplayData.visibility / 1000).toFixed(1)} km` : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat pressure-card">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">📊</div>
                            <div className="stat-label">Pressione</div>
                            <div className="stat-value">{currentDisplayData.main?.pressure}</div>
                            <div className="pressure-unit">hPa</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📅 PREVISIONI ORARIE del giorno selezionato */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-lg forecast-hourly-card">
                        <div className="card-header hourly-header">
                            <h5 className="card-title mb-0 text-white">
                                ⏰ Previsioni di {getSelectedDayLabel()}
                            </h5>
                        </div>
                        <div className="card-body p-3">
                            <div className="forecast-scroll">
                                {getSelectedDayHourlyForecast().map((item, index) => (
                                    <div key={index} className="forecast-hour-item">
                                        <div className="forecast-time">
                                            {new Date(item.dt * 1000).toLocaleTimeString('it-IT', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                        <img
                                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                            alt={item.weather[0].description}
                                            className="forecast-icon"
                                        />
                                        <div className="forecast-temp">
                                            {Math.round(item.main.temp)}°C
                                        </div>
                                        <div className="forecast-humidity">
                                            💧 {item.main.humidity}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📅 PREVISIONI GIORNALIERE - Con colori alternati */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-lg forecast-daily-card">
                        <div className="card-header daily-header">
                            <h5 className="card-title mb-0 text-white">📅 Prossimi Giorni</h5>
                        </div>
                        <div className="card-body p-0">
                            {Object.entries(groupByDate(forecastData)).slice(1, 4).map(([date, items], index) => {
                                const temps = items.map(i => i.main.temp);
                                const min = Math.min(...temps);
                                const max = Math.max(...temps);
                                const icon = items[0].weather[0].icon;
                                const description = items[0].weather[0].description;
                                
                                const displayDate = new Date(date).toLocaleDateString('it-IT', { 
                                    weekday: 'long',
                                    day: '2-digit', 
                                    month: '2-digit' 
                                });
                                
                                return (
                                    <div key={index} className={`daily-forecast-item ${index % 2 === 0 ? 'daily-even' : 'daily-odd'}`}>
                                        <div className="row align-items-center py-3 px-3">
                                            <div className="col-3">
                                                <strong className="day-name">{displayDate}</strong>
                                            </div>
                                            <div className="col-3 text-center">
                                                <img
                                                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                                                    alt={description}
                                                    width="40"
                                                    className="daily-icon"
                                                />
                                            </div>
                                            <div className="col-3 text-center">
                                                <span className="temp-max">{Math.round(max)}°</span>
                                                <span className="temp-min ms-2">{Math.round(min)}°</span>
                                            </div>
                                            <div className="col-3 text-end">
                                                <small className="weather-desc">{description}</small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌅 DETTAGLI SECONDARI - Layout dinamico */}
            <div className="row g-4 mb-4">
                {/* Alba/Tramonto solo per oggi */}
                {selectedDay === 0 && (
                    <div className="col-lg-6">
                        <div className="card h-100 border-0 shadow-lg sun-card">
                            <div className="card-header sun-header">
                                <h6 className="card-title mb-0 text-white">🌅 Sole - Oggi</h6>
                            </div>
                            <div className="card-body sun-body">
                                <div className="row text-center">
                                    <div className="col-6">
                                        <div className="sun-time sunrise-section">
                                            <div className="sun-icon">🌅</div>
                                            <div className="sun-label">Alba</div>
                                            <div className="sun-value">
                                                {dataCity.sys?.sunrise ?
                                                    new Date(dataCity.sys.sunrise * 1000).toLocaleTimeString('it-IT', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="sun-time sunset-section">
                                            <div className="sun-icon">🌄</div>
                                            <div className="sun-label">Tramonto</div>
                                            <div className="sun-value">
                                                {dataCity.sys?.sunset ?
                                                    new Date(dataCity.sys.sunset * 1000).toLocaleTimeString('it-IT', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dettagli completi per tutti i giorni - Layout dinamico */}
                <div className={selectedDay === 0 ? "col-lg-6" : "col-lg-12"}>
                    <div className="card h-100 border-0 shadow-lg details-card">
                        <div className="card-header details-header">
                            <h6 className="card-title mb-0 text-white">
                                ℹ️ Dettagli - {getSelectedDayLabel()}
                            </h6>
                        </div>
                        <div className="card-body details-body">
                            <div className="detail-grid">
                                <div className="detail-item clouds-detail">
                                    <span className="detail-label">☁️ Nuvole</span>
                                    <span className="detail-value">{currentDisplayData.clouds?.all || 0}%</span>
                                </div>
                                <div className="detail-item coords-detail">
                                    <span className="detail-label">🗺️ Coordinate</span>
                                    <span className="detail-value">
                                        {currentDisplayData.coord ?
                                            `${currentDisplayData.coord.lat.toFixed(1)}, ${currentDisplayData.coord.lon.toFixed(1)}` : 'N/A'}
                                    </span>
                                </div>
                                <div className="detail-item timezone-detail">
                                    <span className="detail-label">🕐 Fuso</span>
                                    <span className="detail-value">
                                        UTC{currentDisplayData.timezone >= 0 ? '+' : ''}{(currentDisplayData.timezone / 3600).toFixed(0)}
                                    </span>
                                </div>
                                <div className="detail-item country-detail">
                                    <span className="detail-label">🏴 Paese</span>
                                    <span className="detail-value">{currentDisplayData.sys?.country}</span>
                                </div>
                                
                                {/* Dettagli aggiuntivi per tutti i giorni */}
                                <div className="detail-item">
                                    <span className="detail-label">📅 Giorno</span>
                                    <span className="detail-value">{getSelectedDayLabel()}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">🌡️ Escursione</span>
                                    <span className="detail-value">
                                        {currentDisplayData.main?.temp_max && currentDisplayData.main?.temp_min ?
                                            `${Math.round(currentDisplayData.main.temp_max - currentDisplayData.main.temp_min)}°C` : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer lastUpdate={lastUpdate} />
        </div>
    );
};

export default DashboardPage;