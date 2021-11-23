import React from 'react';
import {NavLink} from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
      <nav>
        <ol style={{display: "flex", gap: "2em"}}>
        <li>
          <NavLink reloadDocument
            style={({isActive}: {isActive: boolean}) => {return {fontWeight: isActive ? "bold" : "normal"}}}
            to="/Reco">
            Chemin Utilisateur
          </NavLink>
        </li>
        <li>
          <NavLink reloadDocument
            style={({isActive}) => {return {fontWeight: isActive ? "bold" : "normal"}}}
            to="/VisuScores">
            Visualiser les scores
          </NavLink>
        </li>
        </ol>
      </nav>
  );
}

export default NavBar;
