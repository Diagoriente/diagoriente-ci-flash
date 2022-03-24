import {Ci, ci} from "utils/helpers/Ci";
import {CiSet} from "utils/helpers/CiSet";
import {CiCount} from "utils/helpers/CiCount";
import {CiNames} from "utils/helpers/CiNames";
import {CiReco, ciReco as ciReco_} from "utils/helpers/CiReco";
import React from 'react';
import useFetched from 'hooks/useFetched';
import useReShuffle from 'hooks/useReShuffle';
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

  const [ciReco, setCiReco] = useFetched<CiReco>(
    "ci_recommend",
    {
      ci_data_version: dataVersion, n: nReco, max_seen: maxSeen,
      cis_selected: cisSelected, cis_seen: cisSeen
    },
    [dataVersion, nReco, maxSeen, cisSelected, cisSeen],
    (r: {proches: number[], ouverture: number[], distant: number[]}) =>
      ciReco_(r.proches.map(ci), r.ouverture.map(ci), r.distant.map(ci))
  );

  const reShuffle = useReShuffle(cisSelected, cisSeen,
    maxSeen, nReco, dataVersion, setCiReco);

  if (ciReco === undefined || ciNames === undefined) {
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
                const seen = [...ciReco.ciClose, ...ciReco.ciOpening,
                ...ciReco.ciDistant];
                onAddCiSeen(seen);
              }}
              items={ciReco.ciClose} ciNames={ciNames}/>
          </div>
          <div className="w-1/3 space-y-4">
            <p className="text-center">(ouverture)</p>
            <CiRecommendationList onSelect={onSelectCi}
              items={ciReco.ciOpening} ciNames={ciNames}/>
          </div>
          <div className="w-1/3 space-y-4">
            <p className="text-center">(distants)</p>
            <CiRecommendationList onSelect={onSelectCi}
              items={ciReco.ciDistant} ciNames={ciNames}/>
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
