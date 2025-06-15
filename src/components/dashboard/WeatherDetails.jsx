const WeatherDetails = ({ 
    selectedDay, 
    dataCity, 
    currentDisplayData, 
    getSelectedDayLabel 
}) => {
    return (
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
    );
};

export default WeatherDetails;