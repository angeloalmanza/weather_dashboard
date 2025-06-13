import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardPage = () => {

    // Varibili
    const API_KEY = import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY;
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const CITY_NAME = 'Lodi,IT';
    const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

    const [dataCity, setDataCity] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [forecastData, setForecastData] = useState([]);

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

            {/* 🎯 HERO SECTION - Informazioni principali a colpo d'occhio */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-lg bg-primary text-white hero-card">
                        <div className="card-body text-center py-5">
                            <div className="row align-items-center">
                                <div className="col-md-6">
                                    {/* Temperatura principale */}
                                    <div className="temperature-display">
                                        <span className="current-temp">{formatTemp(dataCity.main.temp)}</span>
                                        <div className="temp-range mt-2">
                                            <small>
                                                ⬇️ {formatTemp(dataCity.main.temp_min)} •
                                                ⬆️ {formatTemp(dataCity.main.temp_max)}
                                            </small>
                                        </div>
                                        <div className="feels-like mt-1">
                                            <small>Percepita {formatTemp(dataCity.main.feels_like)}</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {/* Condizione meteo con icona */}
                                    <div className="weather-condition">
                                        <img
                                            src={`https://openweathermap.org/img/wn/${dataCity.weather[0].icon}@4x.png`}
                                            alt={dataCity.weather[0].description}
                                            className="weather-icon"
                                            style={{ width: '120px', height: '120px' }}
                                        />
                                        <h4 className="mt-2 mb-0">
                                            {capitalizeFirst(dataCity.weather[0].description)}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 💨 DETTAGLI RAPIDI - Quick facts in 4 colonne */}
            <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">💧</div>
                            <div className="stat-label">Umidità</div>
                            <div className="stat-value">{dataCity.main.humidity}%</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">💨</div>
                            <div className="stat-label">Vento</div>
                            <div className="stat-value">{formatSpeed(dataCity.wind.speed)}</div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">👁️</div>
                            <div className="stat-label">Visibilità</div>
                            <div className="stat-value">
                                {dataCity.visibility ? `${(dataCity.visibility / 1000).toFixed(1)} km` : 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6 col-md-3">
                    <div className="card h-100 border-0 shadow-sm quick-stat">
                        <div className="card-body text-center py-3">
                            <div className="stat-icon mb-2">📊</div>
                            <div className="stat-label">Pressione</div>
                            <div className="stat-value">{dataCity.main.pressure} hPa</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📅 PREVISIONI ORARIE - Priorità alta */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">⏰ Prossime 24 Ore</h5>
                        </div>
                        <div className="card-body p-3">
                            <div className="forecast-scroll">
                                {forecastData.slice(0, 8).map((item, index) => (
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

            {/* 📅 PREVISIONI GIORNALIERE - Pianificazione settimanale */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h5 className="card-title mb-0">📅 Prossimi Giorni</h5>
                        </div>
                        <div className="card-body">
                            {Object.entries(groupByDate(forecastData)).slice(1, 4).map(([date, items], index) => {
                                const temps = items.map(i => i.main.temp);
                                const min = Math.min(...temps);
                                const max = Math.max(...temps);
                                const icon = items[0].weather[0].icon;
                                const description = items[0].weather[0].description;
                                const formattedDate = new Date(date).toLocaleDateString('it-IT', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                });

                                return (
                                    <div key={index} className="daily-forecast-item">
                                        <div className="row align-items-center py-2">
                                            <div className="col-3">
                                                <strong>{formattedDate}</strong>
                                            </div>
                                            <div className="col-3 text-center">
                                                <img
                                                    src={`https://openweathermap.org/img/wn/${icon}.png`}
                                                    alt={description}
                                                    width="40"
                                                />
                                            </div>
                                            <div className="col-3 text-center">
                                                <span className="fw-bold">{Math.round(max)}°</span>
                                                <span className="text-muted ms-2">{Math.round(min)}°</span>
                                            </div>
                                            <div className="col-3 text-end">
                                                <small className="text-muted">{description}</small>
                                            </div>
                                        </div>
                                        {index < 2 && <hr className="my-1" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🌅 DETTAGLI SECONDARI - Solo se interessato */}
            <div className="row g-4 mb-4">
                <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h6 className="card-title mb-0">🌅 Sole</h6>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="sun-time">
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
                                    <div className="sun-time">
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

                <div className="col-lg-6">
                    <div className="card h-100 border-0 shadow-sm">
                        <div className="card-header bg-light">
                            <h6 className="card-title mb-0">ℹ️ Dettagli</h6>
                        </div>
                        <div className="card-body">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">☁️ Nuvole</span>
                                    <span className="detail-value">{dataCity.clouds?.all || 0}%</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">🗺️ Coordinate</span>
                                    <span className="detail-value">
                                        {dataCity.coord ?
                                            `${dataCity.coord.lat.toFixed(1)}, ${dataCity.coord.lon.toFixed(1)}` : 'N/A'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">🕐 Fuso</span>
                                    <span className="detail-value">
                                        UTC{dataCity.timezone >= 0 ? '+' : ''}{(dataCity.timezone / 3600).toFixed(0)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">🏴 Paese</span>
                                    <span className="detail-value">{dataCity.sys?.country}</span>
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