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
                            {cityName} - Dashboard Meteo
                        </h1>
                        <p className="text-muted mb-0">
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
                                {loading ? 'Aggiornando...' : 'Aggiorna'}
                            </button>
                        )}
                        <Link to="/settings" className="btn btn-primary">
                            Settings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;