const HourlyForecast = ({ hourlyData, getSelectedDayLabel }) => {
    return (
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
                            {hourlyData.map((item, index) => (
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
    );
};

export default HourlyForecast;