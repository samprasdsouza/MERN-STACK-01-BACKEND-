import { Link } from "react-router-dom"

export const DashHeader = () => {
    return (
        <>
        <header className="dash-header">
            <div className="dash-header__container">
                <Link to="/dash/notes">
                    <h1 className="dash-header__title">techNotes</h1>
                </Link>
                <nav className="dash-header__nav">
                    {/* add nav buttons later */}
                </nav>
            </div>
        </header>
        </>
    )
}