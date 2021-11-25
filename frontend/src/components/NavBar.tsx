import React from 'react';
import {NavLink} from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
      <nav className="flex space-x-10">
        <p>Navigation: </p>
        <ul className="flex space-x-10">
          <li>
            <NavLink reloadDocument
              className={({isActive}: {isActive: boolean}) => 
                isActive ? "font-bold" : ""}
              to="/Reco">
              Recommandation de CI
            </NavLink>
          </li>
          <li>
            <NavLink reloadDocument
              className={({isActive}: {isActive: boolean}) => 
                isActive ? "font-bold" : ""}
              to="/VisuScores">
              Visualiser les scores
            </NavLink>
          </li>
          <li>
            <NavLink reloadDocument
              className={({isActive}: {isActive: boolean}) => 
                isActive ? "font-bold" : ""}
              to="/Readme">
              À propos
            </NavLink>
          </li>
        </ul>
      </nav>
  );
}

export default NavBar;
