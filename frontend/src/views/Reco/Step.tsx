import {Ci} from "utils/helpers/Ci";
import {CiSet} from "utils/helpers/CiSet";
import {CiCount} from "utils/helpers/CiCount";
import {CiNames} from "utils/helpers/CiNames";
import React from 'react';
import useCiRecommendations from 'hooks/useCiRecommendations';
import CiRecommendationList from 'components/CiRecommendationList';


type StepPropsType = {
  onSelectCi: (ci: Ci) => void,
  onAddCiSeen: (ci: Ci[]) => void,
  cisSelected: CiSet,
  onRestart: () => void,
  cisSeen: CiCount,
  maxSeen: number,
  nReco: number, 
  ciNames: CiNames | undefined, 
  dataVersion: string | undefined
};


const Step: React.FC<StepPropsType> = ({onSelectCi, onRestart, onAddCiSeen, cisSelected, cisSeen,
  maxSeen, nReco, ciNames, dataVersion}) => {

  const [ciRecoState, reShuffle] = useCiRecommendations(cisSelected, cisSeen,
    maxSeen, nReco, dataVersion);

  if (ciRecoState === undefined || ciNames === undefined) {
    return <p>Chargement…</p>;
  } else {

    let prompt;
    if (cisSelected.size() === 0) {
      prompt = (
        <p className="text-center">
          Choisissez un centre d'intérêt (ou 
          <button 
            className="bg-transparent border-none ring-0 text-indigo-500 p-0 m-0"
            onClick={reShuffle}
          >
            remélangez
          </button>
          )
        </p>
      );
    } else {
      prompt = (
        <p className="text-center">
          Choisissez un autre centre d'intérêt (ou 
          <button 
            className="bg-transparent border-none ring-0 text-indigo-500 p-0 m-0"
            onClick={onRestart}
          >
            recommencez
          </button>
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
            <CiRecommendationList 
              onSelect={(ci: Ci) => {
                onSelectCi(ci);
                const seen = [...ciRecoState.ciClose, ...ciRecoState.ciOpening,
                ...ciRecoState.ciDistant];
                console.log("ONADDCISEEN " + JSON.stringify(seen.map((ci: Ci) => [ci.id.toString(), ciNames.get(ci)])));
                onAddCiSeen(seen);
              }}
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
