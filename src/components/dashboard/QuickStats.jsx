const QuickStats = ({ currentDisplayData, formatSpeed }) => {
    return (
        <div className="row g-3 mb-4">
            {/* Umidità */}
            <div className="col-6 col-md-3">
                <div className="card h-100 border-0 shadow-sm quick-stat humidity-card">
                    <div className="card-body text-center py-3">
                        <div className="stat-icon mb-2">💧</div>
                        <div className="stat-label">Umidità</div>
                        <div className="stat-value">{currentDisplayData.main?.humidity}%</div>
                        <div className="progress mt-2" style={{ height: '4px' }}>
                            <div 
                                className="progress-bar bg-info" 
                                style={{ width: `${currentDisplayData.main?.humidity}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vento */}
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

            {/* Visibilità */}
            <div className="col-6 col-md-3">
                <div className="card h-100 border-0 shadow-sm quick-stat visibility-card">
                    <div className="card-body text-center py-3">
                        <div className="stat-icon mb-2">👁️</div>
                        <div className="stat-label">Visibilità</div>
                        <div className="stat-value">
                            {currentDisplayData.visibility ? 
                                `${(currentDisplayData.visibility / 1000).toFixed(1)} km` : 'N/A'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Pressione */}
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
    );
};

export default QuickStats;