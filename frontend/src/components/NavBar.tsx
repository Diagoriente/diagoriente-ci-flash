import React from 'react';
import {NavLink} from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
      <nav className="flex-wrap space-x-5">
        <span>Navigation:</span>
        <NavLink reloadDocument
          className={({isActive}: {isActive: boolean}) => 
            (isActive ? "font-bold" : "") + " inline-block"}
          to="/Reco">
          Recommandation de CI
        </NavLink>
        <NavLink reloadDocument
          className={({isActive}: {isActive: boolean}) => 
            (isActive ? "font-bold" : "") + " inline-block"}
          to="/VisuScores">
          Visualiser les scores
        </NavLink>
        <NavLink reloadDocument
          className={({isActive}: {isActive: boolean}) => 
            (isActive ? "font-bold" : "") + " inline-block"}
          to="/Readme">
          À propos
        </NavLink>
      </nav>
  );
}

export default NavBar;
