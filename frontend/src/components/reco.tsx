import React, {useState, useEffect} from 'react';
import {Ci, ci, CiReco, ciReco, CiNames, ciNamesFromRecord, CiScores} from '../core';
import {fetchCiNames, fetchCiRandom, fetchCiReco, fetchCiScores} from '../requests';
import * as d3 from 'd3';
import {Outlet, NavLink} from 'react-router-dom';
import useCiNames from '../hooks/use-ci-names';




const Reco: React.FC<{onSelectCi: (ci: Ci) => void, selectedCis: Ci[], 
  nReco: number, ciNames: CiNames}>
    = ({onSelectCi, selectedCis, nReco, ciNames}) => {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  useEffect(() => {
    console.log(`Fetching ci reco: ${JSON.stringify(selectedCis)}`);
    fetchCiReco(nReco, selectedCis)
      .then(res => {
        console.log(`Setting siRecoState to ${JSON.stringify(res)}`);
        setCiRecoState(res)
      });
  }, [selectedCis, nReco]);

  if (ciRecoState === undefined) {

    return (
      <div>
        <p>Chargement…</p>
      </div>
    );

  } else {

    const mapCisToElements = (cis: Ci[]): JSX.Element[]  => {
      return cis.map(ci => {
        return (
          <li key={ci.id.toString()} onClick={() => onSelectCi(ci)}>
            <a>{ciNames.get(ci)}</a>
          </li>
        );
      });
    }

    const ciClose = mapCisToElements(ciRecoState.ciClose);
    const ciOpening = mapCisToElements(ciRecoState.ciOpening);
    const ciDistant = mapCisToElements(ciRecoState.ciDistant);

    return (
      <div>
        <p>Choisissez un autre centre d'intérêt</p>
        <div className="container">
          <div className="row">
            <div className="column column-30">
              <p>(proches)</p>
              <ul> {ciClose} </ul>
            </div>
            <div className="column column-30">
              <p>(ouverture)</p>
              <ul> {ciOpening} </ul>
            </div>
            <div className="column column-30">
              <p>(distants)</p>
              <ul> {ciDistant} </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Reco;
