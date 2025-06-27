import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header_space/Header';
import Home from './components/Home_space/Home';
import SignUp from './components/SignUp_space/SignUp';
import Models from './components/Models_space/Models';
import Login from './components/Login_space/Login';
import { JSX } from 'react';

function App(): JSX.Element {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/models" element={<Models />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<Login />} />
      </Routes>    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
