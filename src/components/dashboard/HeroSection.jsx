const HeroSection = ({ currentDisplayData, formatTemp, capitalizeFirst }) => {
    return (
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
    );
};

export default HeroSection;