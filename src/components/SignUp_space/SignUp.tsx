import './SignUp_dec.css';
import Header from '../Header_space/Header';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../utils/apiService';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        gender: 'male'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            const response = await signUp(formData);
            console.log('Sign up successful:', response);
            
            // Redirect to home after successful signup
            navigate('/home');
        } catch (err) {
            console.error('Sign up error:', err);
            setError(err instanceof Error ? err.message : 'Sign up failed');
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
                        <div className="inputBox">
                            <span>Email Address</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <i></i>
                        </div>
                        <div className="rBtn">
                            <label htmlFor="" className="lbl">
                                Gender :
                            </label>
                            <div className="radio-wrapper">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="male"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="male">Male</label>
                            </div>
                            <div className="radio-wrapper">
                                <input
                                    type="radio"
                                    name="gender"
                                    id="female"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="female">Female</label>
                            </div>
                        </div>
                        <input
                            type="submit"
                            value={loading ? "Signing Up..." : "Sign Up"}
                            disabled={loading}
                        />
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