import './SignUp_dec.css';
import Header from '../Header_space/Header';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const handleLoginClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/login');
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
        // Handle signup logic here
        console.log('Sign up form submitted');
        // For now, redirect to home after signup
        navigate('/home');
    };

    // Custom navigation function for Header
    const handleHeaderNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <Header onNavigate={handleHeaderNavigation} />
            <div id="sign-up">
                <div className="box">
                    <button className="form-back-button" onClick={handleBackClick} aria-label="Go back">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    
                    <span className="boxLine"></span>
                    <form onSubmit={handleSubmit}>
                        <h2>Sign Up</h2>
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
                        <div className="inputBox">
                            <span>Email Address</span>
                            <input type="email" required />
                            <i></i>
                        </div>
                        <div className="rBtn">
                            <label htmlFor="" className="lbl">
                                Gender :
                            </label>
                            <div className="radio-wrapper">
                                <input type="radio" name="gender" id="male" value="male" defaultChecked />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="radio-wrapper">
                                <input type="radio" name="gender" id="female" value="female" />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                        <input type="submit" value="Sign Up" />
                        <div className="log-in">
                            <p>Already have an account? 
                                <a href="#" onClick={handleLoginClick}> Log in</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
  
export default SignUp;