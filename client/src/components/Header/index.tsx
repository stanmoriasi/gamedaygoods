import { Link } from "react-router-dom";
import { type MouseEvent } from "react";
import Auth from "../../utils/auth";
import "./header.css";

const Header = () => {
  const logout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className="bg-dark text-light mb-4 py-3 d-flex align-items-center header-gradient">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6">
            <Link className="text-light text-decoration-none" to="/">
              <div className="d-flex align-items-center">
                <div>
                  <h1 className="m-0 brand-text">
                    <span className="text-warning">Game</span>
                    <span className="text-white">day</span>
                    <span className="text-info">Goods</span>
                  </h1>
                  <p className="m-0 tagline">Shop the latest gear!</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6 d-flex justify-content-md-end">
            {Auth.loggedIn() ? (
              <>
                <Link className="btn btn-dark btn-lg mx-2 nav-button" to="/">
                  Home
                </Link>
                <Link className="btn btn-light btn-lg mx-2 nav-button" to="/me">
                  {Auth.getProfile().data.username}'s Orders
                </Link>
                <Link
                  to="/cart"
                  className="btn btn-warning btn-lg mx-2 nav-button"
                >
                  View Cart
                </Link>
                <button
                  className="btn btn-info btn-lg mx-2 nav-button"
                  onClick={logout}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link className="btn btn-dark btn-lg mx-2 nav-button" to="/">
                  Home
                </Link>
                <Link
                  className="btn btn-info btn-lg mx-2 nav-button"
                  to="/login"
                >
                  Log In
                </Link>
                <Link
                  className="btn btn-light btn-lg mx-2 nav-button"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
