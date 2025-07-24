import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home_space/Home';
import Models from './components/Models_space/Models';
import ModelDetail from './components/ModelDetail_page/ModelDetail'; // Add this import
import Login from './components/Login_space/Login';
import SignUp from './components/SignUp_space/SignUp';
import SettingsPage from './components/Settings_page/Settings';
import Sell from './components/Sell_page/Sell';
import Cart from './components/Cart_Page/Cart';
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
        <Route path="/models/:id" element={<ModelDetail />} /> {/* Updated to use ModelDetail component */}
        
        {/* Sell Routes */}
        <Route path="/sell" element={<Sell />} />
        
        {/* Cart Routes */}
        <Route path="/cart" element={<Cart />} />
        
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