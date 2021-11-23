import React from 'react';
import './App.css';
import {Outlet} from 'react-router-dom';
import NavBar from 'components/NavBar';

const App: React.FC = () => {
  return (
    <div className="App">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default App;

