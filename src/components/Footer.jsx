const Footer = ({ lastUpdate }) => {
    return (
        <>
            {/* Footer principale con ultimo aggiornamento */}
            {lastUpdate && (
                <div className="row mt-4">
                    <div className="col">
                        <div className="card bg-light border-0">
                            <div className="card-body text-center py-2">
                                <small className="text-muted">
                                    Ultimo aggiornamento: {lastUpdate.toLocaleString('it-IT')}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Informazioni aggiuntive footer */}
            <div className="row mt-3">
                <div className="col">
                    <div className="text-center">
                        <small className="text-muted">
                            <i className="fas fa-cloud me-1"></i>
                            Dati forniti da 
                            <a 
                                href="https://openweathermap.org/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-decoration-none ms-1"
                            >
                                OpenWeatherMap
                            </a>
                        </small>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="row mt-2 mb-4">
                <div className="col">
                    <hr className="my-3" />
                    <div className="text-center">
                        <small className="text-muted">
                            © {new Date().getFullYear()} Weather Dashboard
                        </small>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Footer;