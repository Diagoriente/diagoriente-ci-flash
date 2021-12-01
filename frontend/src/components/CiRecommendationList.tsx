import React from 'react';
import {Ci} from "utils/helpers/Ci";
import {CiNames} from "utils/helpers/CiNames";

const CiRecommendationList: React.FC<{onSelect: (ci: Ci) => void, items: Ci[], 
    ciNames: CiNames}> = ({onSelect, items, ciNames}) => {

  const listItems: JSX.Element[] = items.map(ci =>
    <li key={ci.id.toString()}>
      <button 
        className="w-full bg-indigo-200 ring-indigo-500 text-black" 
        onClick={() => onSelect(ci)}
      >
        {ciNames.get(ci)}
      </button>
    </li>
    );

  return <ul className="space-y-2"> {listItems} </ul>;
};

export default CiRecommendationList;
