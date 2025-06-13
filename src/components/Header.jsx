import { Link } from "react-router-dom";

const Header = ({ 
    cityName = "Lodi", 
    onRefresh, 
    loading = false, 
    showRefresh = true 
}) => {
    return (
        <div className="row mb-4">
            <div className="col">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    {/* Titolo e data */}
                    <div>
                        <h1 className="h2 mb-1">
                            <i className="fas fa-map-marker-alt text-primary me-2"></i>
                            {cityName} - Dashboard Meteo
                        </h1>
                        <p className="text-muted mb-0">
                            <i className="fas fa-calendar-day me-2"></i>
                            {new Date().toLocaleDateString('it-IT', { 
                                weekday: 'long', 
                                day: 'numeric', 
                                month: 'long',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                    
                    {/* Pulsanti azioni */}
                    <div className="mt-3 mt-md-0">
                        {showRefresh && (
                            <button 
                                className="btn btn-outline-primary me-2" 
                                onClick={onRefresh}
                                disabled={loading}
                            >
                                <i className={`fas fa-sync-alt me-2 ${loading ? 'fa-spin' : ''}`}></i>
                                {loading ? 'Aggiornando...' : 'Aggiorna'}
                            </button>
                        )}
                        <Link to="/settings" className="btn btn-primary">
                            <i className="fas fa-cog me-2"></i>
                            Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;