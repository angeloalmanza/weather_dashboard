const DailyForecast = ({ forecastData, groupByDate }) => {
    return (
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
    );
};

export default DailyForecast;