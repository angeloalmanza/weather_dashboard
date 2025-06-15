const DayNavigator = ({ 
    forecastData, 
    selectedDay, 
    onDaySelect, 
    getSelectedDayLabel,
    groupByDate 
}) => {
    return (
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
                                        onClick={() => onDaySelect(index, items, date)}
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
    );
};

export default DayNavigator;