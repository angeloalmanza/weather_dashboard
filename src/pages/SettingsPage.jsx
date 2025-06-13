import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const SettingsPage = () => {
    return (
        <div className="container min-height py-4">
            <h1>Settings</h1>

            {/* Main Content - Coming Soon */}
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center py-5">
                            <h1 className="h2 text-primary mb-4">Coming Soon</h1>
                            <Link to="/" className="btn btn-primary btn-lg">
                                Torna alla Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Component */}
            <Footer />
        </div>
    );
};

export default SettingsPage;