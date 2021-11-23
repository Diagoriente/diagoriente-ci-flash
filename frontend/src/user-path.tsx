import React, {useState, useEffect} from 'react';
import './App.css';
import {Ci, ci, ciListFromString, CiReco, ciReco, CiNames, ciNamesFromRecord, CiScores} from './core';
import {fetchCiNames, fetchCiRandom, fetchCiReco, fetchCiScores} from './requests';
import * as d3 from 'd3';
import {BarChart} from './d3/horizontal-bar-chart';
import useCiNames from './hooks/use-ci-names';
import Start from './components/start';
import Reco from './components/reco';
import {useSearchParams} from 'react-router-dom';


export const UserPath: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nReco, setNReco] = useState<number>(3);
  const [ciNames, setCiNames] = useCiNames();
  const [selectedCis, setSelectedCis] =
    useState<Ci[]>(ciListFromString(searchParams.get("selectedCis")));

  const addCi = (ci: Ci): void => {
    setSelectedCis([...selectedCis, ci])
  };

  useEffect(() => {
    searchParams.set("selectedCis",
       selectedCis.map(ci => ci.id.toString()).join(","));
    setSearchParams(searchParams);
  }, [selectedCis]);

  return (
    <div className="row">
      <div className="column column-70">
        {
          selectedCis.length === 0 ?
            <Start onYes={addCi} ciNames={ciNames}/> :
            <Reco 
              onSelectCi={addCi}
              selectedCis={selectedCis}
              nReco={nReco}
              ciNames={ciNames}
            />
        }
      </div>
      <div className="column">
        <label htmlFor="n-reco">Nombre de recommendation par liste :</label>
        <input 
          type="number" id="n-reco" name="n-reco"
          onChange={e => setNReco(+e.target.value)}
          value={nReco}
        />
        <p>CI séléctionés:</p>
        <ul>
          {selectedCis.slice().reverse().map(ci => <li key={ci.id}>{ciNames.get(ci)}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default UserPath;
