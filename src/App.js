import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/landing-page/LandingPage.js';
import { Helmet } from 'react-helmet';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <div className="App">
      <AnimatedRoutes/>
    </div>
  );
}

export default App;
