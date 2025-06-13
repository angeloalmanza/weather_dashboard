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

    const getTempClass = (temp) => {
        if (temp >= 25) return 'text-danger';
        if (temp >= 15) return 'text-warning';
        if (temp >= 5) return 'text-info';
        return 'text-secondary';
    };

    const getTempBgClass = (temp) => {
        if (temp >= 25) return 'bg-danger';
        if (temp >= 15) return 'bg-warning';
        if (temp >= 5) return 'bg-info';
        return 'bg-secondary';
    };

    // Helper per raggruppare le previsioni per data
    const groupByDate = (list) => {
        const map = {};
        list.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('it-IT');
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

            {/* Cards principali */}
            <div className="row g-4 mb-4">
                {/* Temperatura Principale */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body text-center">
                            <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 big-circle ${getTempBgClass(dataCity.main.temp)}`}>
                                <span>🌡️</span>
                            </div>
                            <h6 className="card-subtitle mb-2 text-muted">Temperatura</h6>
                            <h2 className={`card-title ${getTempClass(dataCity.main.temp)} mb-2`}>
                                {formatTemp(dataCity.main.temp)}
                            </h2>
                            <small className="text-muted">
                                Percepita {formatTemp(dataCity.main.feels_like)}
                            </small>
                        </div>
                    </div>
                </div>

                {/* Min/Max */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center me-3 small-circle">
                                    <span>⬅️</span>
                                </div>
                                <h6 className="card-subtitle mb-0 text-muted">Min / Max</h6>
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="text-center">
                                    <small className="text-info d-block">Minima</small>
                                    <strong className="text-info">{formatTemp(dataCity.main.temp_min)}</strong>
                                </div>
                                <div className="text-center">
                                    <small className="text-danger d-block">Massima</small>
                                    <strong className="text-danger">{formatTemp(dataCity.main.temp_max)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Umidità */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-info d-inline-flex align-items-center justify-content-center me-3 small-circle">
                                    <span>💧</span>
                                </div>
                                <h6 className="card-subtitle mb-0 text-muted">Umidità</h6>
                            </div>
                            <h3 className="text-info mb-2">{dataCity.main.humidity}%</h3>
                            <div className="progress" style={{ height: '8px' }}>
                                <div
                                    className="progress-bar bg-info"
                                    role="progressbar"
                                    style={{ width: `${dataCity.main.humidity}%` }}
                                ></div>
                            </div>
                            <small className="text-muted">
                                {dataCity.main.humidity > 70 ? 'Alta' :
                                    dataCity.main.humidity > 40 ? 'Normale' : 'Bassa'}
                            </small>
                        </div>
                    </div>
                </div>

                {/* Vento */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                                <div className="rounded-circle bg-success d-inline-flex align-items-center justify-content-center me-3 small-circle">
                                    <span>💨</span>
                                </div>
                                <h6 className="card-subtitle mb-0 text-muted">Vento</h6>
                            </div>
                            <h3 className="text-success mb-2">{formatSpeed(dataCity.wind.speed)}</h3>
                            <small className="text-muted">
                                Direzione: {dataCity.wind?.deg ? `${dataCity.wind.deg}°` : 'N/A'}
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Condizioni attuali */}
            <div className="row mb-4">
                <div className="col">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0">
                                Condizioni Attuali
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center g-4">
                                <div className="col-md-4">
                                    <h6 className="text-muted">Tempo</h6>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${dataCity.weather[0].icon}@2x.png`}
                                        alt={dataCity.weather[0].description}
                                        width={80}
                                        height={80}
                                    />
                                    <span className="badge bg-primary fs-6 px-3 py-2">
                                        {capitalizeFirst(dataCity.weather[0].description)}
                                    </span>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-muted">Pressione</h6>
                                    <h4 className="mb-0">{dataCity.main.pressure} <small className="text-muted">hPa</small></h4>
                                </div>
                                <div className="col-md-4">
                                    <h6 className="text-muted">Visibilità</h6>
                                    <h4 className="mb-0">
                                        {dataCity.visibility ? `${(dataCity.visibility / 1000).toFixed(1)} km` : 'N/A'}
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dettagli aggiuntivi */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-sun me-2 text-warning"></i>
                                Alba e Tramonto
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6 text-center">
                                    <span>🌅</span>
                                    <h6>Alba</h6>
                                    <strong>
                                        {dataCity.sys?.sunrise ?
                                            new Date(dataCity.sys.sunrise * 1000).toLocaleTimeString('it-IT', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                    </strong>
                                </div>
                                <div className="col-6 text-center">
                                    <span>🌄</span>
                                    <h6>Tramonto</h6>
                                    <strong>
                                        {dataCity.sys?.sunset ?
                                            new Date(dataCity.sys.sunset * 1000).toLocaleTimeString('it-IT', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'N/A'}
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-6">
                    <div className="card h-100 shadow-sm border-0">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-info-circle me-2 text-info"></i>
                                Informazioni Aggiuntive
                            </h5>
                        </div>
                        <div className="card-body">
                            <ul className="list-unstyled mb-0">
                                <li className="d-flex justify-content-between py-2 border-bottom">
                                    <span><i className="fas fa-flag me-2"></i>Paese:</span>
                                    <strong>{dataCity.sys?.country}</strong>
                                </li>
                                <li className="d-flex justify-content-between py-2 border-bottom">
                                    <span><i className="fas fa-map-pin me-2"></i>Coordinate:</span>
                                    <strong>
                                        {dataCity.coord ?
                                            `${dataCity.coord.lat.toFixed(2)}, ${dataCity.coord.lon.toFixed(2)}` : 'N/A'}
                                    </strong>
                                </li>
                                <li className="d-flex justify-content-between py-2 border-bottom">
                                    <span><i className="fas fa-cloud me-2"></i>Nuvole:</span>
                                    <strong>{dataCity.clouds?.all || 0}%</strong>
                                </li>
                                <li className="d-flex justify-content-between py-2">
                                    <span><i className="fas fa-clock me-2"></i>Fuso Orario:</span>
                                    <strong>UTC{dataCity.timezone >= 0 ? '+' : ''}{(dataCity.timezone / 3600).toFixed(0)}</strong>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Previsioni ogni 3 ore in 7 intervalli*/}
            <div className="row my-4">
                <div className="col">
                    <h4>🌦️ Previsioni Orarie</h4>
                    <div className="d-flex overflow-auto gap-3 py-2">
                        {forecastData.slice(0, 7).map((item, index) => (
                            <div key={index} className="text-center px-3 py-2 border rounded shadow-sm bg-light">
                                <strong>{new Date(item.dt * 1000).toLocaleTimeString('it-IT', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</strong>
                                <div>{Math.round(item.main.temp)}°C</div>
                                <img
                                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                    alt={item.weather[0].description}
                                    width={40}
                                />
                                <small>{item.weather[0].description}</small>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Prvisioni per i prossimi 3 giorni */}
            <div className="row my-4">
                <div className="col">
                    <h4>📅 Previsioni Giornaliere</h4>
                    {Object.entries(groupByDate(forecastData)).slice(1, 4).map(([date, items], index) => {
                        const temps = items.map(i => i.main.temp);
                        const min = Math.min(...temps);
                        const max = Math.max(...temps);
                        const icon = items[0].weather[0].icon;
                        const description = items[0].weather[0].description;
                        return (
                            <div key={index} className="border rounded p-3 mb-2 bg-light shadow-sm">
                                <strong>{date}</strong>
                                <div>🌡️ {Math.round(min)}°C - {Math.round(max)}°C</div>
                                <div><img
                                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                                    alt={description}
                                    width={40}
                                />
                                    {items[0].weather[0].description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer Component */}
            <Footer
                lastUpdate={lastUpdate}
            />
        </div>
    );
};

export default DashboardPage;