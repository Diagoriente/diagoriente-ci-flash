import React, {useState, useEffect} from 'react';
import './App.css';
import {Ci, ci, CiReco, ciReco, CiNames, ciNamesFromRecord, CiScores} from './core';
import {fetchCiNames, fetchCiRandom, fetchCiReco, fetchCiScores} from './requests';
import * as d3 from 'd3';
import {BarChart} from './d3/horizontal-bar-chart';
import {Outlet, Link, NavLink} from 'react-router-dom';
import useCiNames from './hooks/use-ci-names';
import QueryNavLink from './components/query-nav-link';

const App: React.FC = () => {
  return (
    <div className="App">
      <nav>
        <ol style={{display: "flex", gap: "2em"}}>
        <li>
          <NavLink reloadDocument
            style={({isActive}: {isActive: boolean}) => {return {fontWeight: isActive ? "bold" : "normal"}}}
            to="/user-path">
            Chemin Utilisateur
          </NavLink>
        </li>
        <li>
          <NavLink reloadDocument
            style={({isActive}) => {return {fontWeight: isActive ? "bold" : "normal"}}}
            to="/visu-scores">
            Visualiser les scores
          </NavLink>
        </li>
        </ol>
      </nav>
      <Outlet />
    </div>
  );
};


export default App;

