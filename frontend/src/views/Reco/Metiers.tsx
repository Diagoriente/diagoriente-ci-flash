import {CiSet} from "utils/helpers/CiSet";
import {CiNames} from "utils/helpers/CiNames";
import React, { useState } from 'react';
import useFetched from "hooks/useFetched";


type PropsType = {
  cisSelected: CiSet,
  ciNames: CiNames | undefined, 
  dataVersion: string | undefined
};

const Metiers: React.FC<PropsType> = props => {
  const [n, setN] = useState<number>(20);
  const [metiers] = useFetched<[string, string, number][]>("metiers_recommend_with_score",
    {ci_data_version: props.dataVersion, n: n, cis_selected: props.cisSelected},
    [props.dataVersion, n, props.cisSelected]);

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
      {metiers?.map(([rome, name, score]: [string, string, number]) => 
        <li key={rome}>{rome} : {name} (score: {score})</li>
      )}
      </ol>
    </div>

  );
};

export default Metiers;
