import {Ci} from "utils/helpers/Ci";
import {CiNames} from "utils/helpers/CiNames";
import {CiReco, ciReco} from "utils/helpers/CiReco";
import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {fetchCiRandom, fetchCiReco} from 'services/backend';


const Step: React.FC<{onSelectCi: (ci: Ci) => void, selectedCis: Ci[],
  nReco: number, ciNames: CiNames}>
    = ({onSelectCi, selectedCis, nReco, ciNames}) => {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  useEffect(() => {
    if (selectedCis.length === 0) {
      fetchCiRandom(nReco * 3)
        .then(cis => {
          if (cis.length === 0) {
            console.error("Received 0 random CI from backend.");
          } else {
              const cir = ciReco(
                cis.slice(0,nReco), 
                cis.slice(nReco,nReco * 2), 
                cis.slice(nReco * 2, nReco * 3));
            setCiRecoState(cir);
          }
        });
    } else {
      fetchCiReco(nReco, selectedCis)
        .then(res => {
          setCiRecoState(res)
        });
    }
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
          <li key={ci.id.toString()}>
            <button className="w-full bg-indigo-200 ring-indigo-500 text-black" onClick={() => onSelectCi(ci)}>{ciNames.get(ci)}</button>
          </li>
        );
      });
    }

    const ciClose = mapCisToElements(ciRecoState.ciClose);
    const ciOpening = mapCisToElements(ciRecoState.ciOpening);
    const ciDistant = mapCisToElements(ciRecoState.ciDistant);

    let prompt;
    if (selectedCis.length === 0) {
      prompt = <p className="text-center">Choisissez un centre d'intérêt (ou 
          <NavLink reloadDocument
            style={({isActive}: {isActive: boolean}) => {return {fontWeight: isActive ? "bold" : "normal"}}}
            to="/Reco">
             remélangez
          </NavLink>
        )</p>
    } else {
      prompt = <p className="text-center">Choisissez un autre centre d'intérêt (ou 
          <NavLink reloadDocument
            style={({isActive}: {isActive: boolean}) => {return {fontWeight: isActive ? "bold" : "normal"}}}
            to="/Reco">
             recommencez
          </NavLink>
        )</p>
    }

    return (
      <div className="space-y-5">
        {prompt}
        <div className="flex space-x-5">
          <div className="w-1/3 space-y-4">
            <p className="text-center">(proches)</p>
            <ul className="space-y-2"> {ciClose} </ul>
          </div>
          <div className="w-1/3 space-y-4">
            <p className="text-center">(ouverture)</p>
            <ul className="space-y-2"> {ciOpening} </ul>
          </div>
          <div className="w-1/3 space-y-4">
            <p className="text-center">(distants)</p>
            <ul className="space-y-2"> {ciDistant} </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Step;
