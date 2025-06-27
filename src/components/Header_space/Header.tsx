import './Header_dec.css';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const handleClick = (): void => {
      navigate('/models');
    }

    const handleClick2 = (): void => {
      navigate('/home');
    }

    const handleClick3 = (): void => {
      navigate('/login');
    }

    const navLinks = document.getElementById('navLinks');
    
    function showMenu() {
      if (navLinks) {
        navLinks.style.right = '0';
      }
    }
  
    function hideMenu() {
      if (navLinks) {
        navLinks.style.right = '-200px';
      }
    }

    return (
      <header>
        <a href="#" target="_blank" onClick={handleClick2}>
          <img
            id="logo"
            src="https://cdn-icons-png.flaticon.com/128/16066/16066544.png"
            alt="CENTURION"
          />
        </a>
        <div className="beside-logo">
          <h1>
            <a href="#" target="_blank" onClick={handleClick2}>
              CENTURION
            </a>
          </h1>
        </div>
        <div className="search-new-screen">
          <span className="search-icon material-symbols-outlined">search</span>
          <input
            className="search-input"
            type="search"
            name="search-bar"
            id="search-bar"
            placeholder="Search"
          />
        </div>
        <div className="first-nav" id="navLinks">
          <i className="fa fa-times" onClick={hideMenu}></i>
          <ul>
            <li>
              <a href="#3D-models" target="_blank" onClick={handleClick}>
                3D models
              </a>
            </li>
            {/*<li>
              <a href="#custom-models" target="_blank">
                Custom models
              </a>
            </li>*/}
            <li>
              <a href="#Sign-in" target="_blank" onClick={handleClick3}>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/64/64572.png"
                  alt="sign in"
                />
              </a>
            </li>
          </ul>
          <i className="fa fa-bars" onClick={showMenu}></i>
        </div>
      </header>
    );
  };
  
  export default Header;
  