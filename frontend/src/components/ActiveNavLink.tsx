import React from 'react';
import {NavLink} from 'react-router-dom';

const ActiveNavLink: React.FC<{reloadDocument?: boolean, to:string}> = ({reloadDocument, to, children, ...props}) => {
  return (
    <NavLink
      reloadDocument
      style={({isActive}: {isActive: boolean}) => {
        return {fontWeight: isActive ? "bold" : "normal"}
      }} 
      to={to}
      {...props}
    >
      {children}
    </NavLink>
  );
};

export default ActiveNavLink;
