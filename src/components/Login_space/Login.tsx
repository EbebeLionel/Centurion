import './Login_dec.css';
import Header from '../Header_space/Header';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/apiService';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await login(formData);
            console.log('Login successful:', response);
            
            // Redirect to home after successful login
            navigate('/home');
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
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
                        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                        <div className="inputBox">
                            <span>Username</span>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                            <i></i>
                        </div>
                        <div className="inputBox">
                            <span>Enter Password</span>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <i></i>
                        </div>
                        <input
                            type="submit"
                            value={loading ? "Logging in..." : "Login"}
                            disabled={loading}
                        />
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