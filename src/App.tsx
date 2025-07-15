import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home_space/Home';
import Models from './components/Models_space/Models';
import Login from './components/Login_space/Login';
import SignUp from './components/SignUp_space/SignUp';
import SettingsPage from './components/Settings_page/Settings';
import Sell from './components/Sell_page/Sell';
import { JSX } from 'react';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        {/* Home Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Models Routes */}
        <Route path="/models" element={<Models />} />
        <Route path="/models/:id" element={<Models />} /> {/* For individual model pages in the future */}
        
        {/* Sell Routes */}
        <Route path="/sell" element={<Sell />} />
        
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Settings Routes */}
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/settings/:section" element={<SettingsPage />} />
        
        {/* Catch-all route - redirect to home for any unknown routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;