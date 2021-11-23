import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import VisuScores from "views/VisuScores/VisuScores";
import Reco from "views/Reco/Reco";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Reco />} />
            <Route path="Reco" element={<Reco />} />
            <Route path="VisuScores" element={<VisuScores />} />
            <Route
              path="*"
              element={
                <p>There's nothing here!</p>
              }
            />
          </Route>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
