import './Login_dec.css';
import Header from '../Header_space/Header';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const handleSignUpClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/signup');
    };

    const handleForgotPasswordClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // You can implement forgot password functionality here
        console.log('Forgot password clicked');
    };

    const handleBackClick = () => {
        // Go back to previous page, or home if no previous page
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/home');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login form submitted');
        // For now, redirect to home after login
        navigate('/home');
    };

    // Custom navigation function for Header
    const handleHeaderNavigation = (path: string) => {
        navigate(path);
    };

    return ( 
        <>
            <Header onNavigate={handleHeaderNavigation} />
            <div id="login">
                <div className="box">
                    <button className="form-back-button" onClick={handleBackClick} aria-label="Go back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    
                    <form onSubmit={handleSubmit}>
                        <h2>Sign In</h2>
                        <div className="inputBox">
                            <span>Username</span>
                            <input type="text" required />
                            <i></i>
                        </div>
                        <div className="inputBox">
                            <span>Enter Password</span>
                            <input type="password" required />
                            <i></i>
                        </div>
                        <input type="submit" value="Login" />
                        <div className="links">
                            <a href="#" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                            <a href="#" onClick={handleSignUpClick}>Sign Up</a>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
 
export default Login;