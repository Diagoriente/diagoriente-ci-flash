import {Ci, ci} from "utils/helpers/Ci";
import {CiNames} from "utils/helpers/CiNames";
import React from 'react';
import useCiRecommendations from 'hooks/useCiRecommendations';
import CiRecommendationList from 'components/CiRecommendationList';
import {NavLink} from 'react-router-dom';


type StepPropsType = {
  onSelectCi: (ci: Ci) => void, 
  selectedCis: Ci[],
  nReco: number, 
  ciNames: CiNames | undefined, 
  dataVersion: string | undefined
};


const Step: React.FC<StepPropsType> = ({onSelectCi, selectedCis, nReco, ciNames,
    dataVersion}) => {
  const [ciRecoState, reShuffle] = useCiRecommendations(selectedCis, nReco, dataVersion);

  if (ciRecoState === undefined || ciNames === undefined) {
    return <p>Chargement…</p>;
  } else {

    let prompt;
    if (selectedCis.length === 0) {
      prompt = (
        <p className="text-center">
          Choisissez un centre d'intérêt (ou 
          <NavLink to="/Reco" reloadDocument > remélangez </NavLink>
          )
        </p>
      );
    } else {
      prompt = (
        <p className="text-center">
          Choisissez un autre centre d'intérêt (ou 
          <NavLink to="/Reco" reloadDocument> recommencez </NavLink>
          )
        </p>
      );
    }

    return (
      <div className="space-y-5">
        {prompt}
        <div className="flex space-x-5">
          <div className="w-1/3 space-y-4">
            <p className="text-center">(proches)</p>
            <CiRecommendationList onSelect={onSelectCi}
              items={ciRecoState.ciClose} ciNames={ciNames}/>
          </div>
          <div className="w-1/3 space-y-4">
            <p className="text-center">(ouverture)</p>
            <CiRecommendationList onSelect={onSelectCi}
              items={ciRecoState.ciOpening} ciNames={ciNames}/>
          </div>
          <div className="w-1/3 space-y-4">
            <p className="text-center">(distants)</p>
            <CiRecommendationList onSelect={onSelectCi}
              items={ciRecoState.ciDistant} ciNames={ciNames}/>
          </div>
        </div>
        <div>
          <button 
            className="w-full bg-yellow-100 ring-yellow-300 text-black" 
            onClick={() => reShuffle()}
          >
            Proposez-moi autre chose !
          </button>
        </div>
      </div>
    );
  }
}


export default Step;
