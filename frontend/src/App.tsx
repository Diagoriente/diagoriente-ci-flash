import React, {useState, useEffect} from 'react';
import {Outlet} from 'react-router-dom';
import NavBar from 'components/NavBar';

const App: React.FC = () => {
  return (
    <div className="p-1 space-y-5">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default App;

