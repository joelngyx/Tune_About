import logo from './logo.svg';
import './App.css';
import LandingPage from './pages/landing-page/LandingPage.js';
import Test from './test.jpg';
import {Helmet} from 'react-helmet';

function App() {
  return (
    <div className="App">
      <Helmet>
        <style>{"body {background-color: #DD702C; overflow-x: hidden}"}</style>
      </Helmet>
      <div className='row d-flex'>
          <div className='container justify-content-center'>
            <LandingPage/>
          </div>
        </div>
    </div>
  );
}

export default App;
