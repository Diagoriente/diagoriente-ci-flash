import {Ci, ci} from "utils/helpers/Ci";
import {CiCount} from "utils/helpers/CiCount";
import {CiNames} from "utils/helpers/CiNames";
import React, { useState } from 'react';
import useCiRecommendations from 'hooks/useCiRecommendations';
import CiRecommendationList from 'components/CiRecommendationList';
import {NavLink} from 'react-router-dom';
import useMetiersRecommendations from "hooks/useMetiersRecommendations";


type PropsType = {
  cisSelected: Ci[],
  ciNames: CiNames | undefined, 
  dataVersion: string | undefined
};

const Metiers: React.FC<PropsType> = props => {
  const [n, setN] = useState<number>(20);
  const metiers = useMetiersRecommendations(props.cisSelected, n, props.dataVersion);

  return (
    <div className="rounded p-5 border-4 border-opacity-100 space-y-2">
      <div className="">
        <h2 className="font-bold text-lg">
          <input 
            className="inline w-16 border text-right font-bold"
            type="number" id="max-seen" name="max-seen"
            onChange={e => setN(parseFloat(e.target.value))}
            value={n}
          />
          <label className="inline" htmlFor="max-seen">
             premiers métiers recommandés :
          </label>
        </h2>
      </div>
      <ol className="list-decimal list-outside ml-10">
      {metiers?.map(([name, score]: [string, number]) => 
        <li key={name}>{name} (score: {score})</li>
      )}
      </ol>
    </div>

  );
};

export default Metiers;
