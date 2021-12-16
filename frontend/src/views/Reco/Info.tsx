import React from 'react';
import {Ci} from 'utils/helpers/Ci';
import {CiSet} from 'utils/helpers/CiSet';
import {CiNames} from 'utils/helpers/CiNames';
import {CiCount} from 'utils/helpers/CiCount';
import DataVersionSelect from 'components/DataVersionSelect';


export const Info: React.FC<{
    onSetNReco: (n: number) => void,
    nReco: number,
    maxSeen: number,
    onSetMaxSeen: (n: number) => void,
    ciNames: CiNames | undefined,
    cisSelected: CiSet,
    cisSeen: CiCount,
    dataVersion: string | undefined,
    onSetDataVersion: (version: string) => void}> =
    ({onSetNReco, onSetMaxSeen, maxSeen, cisSelected, cisSeen, nReco, ciNames, dataVersion, onSetDataVersion }) => {

  return (
    <div className="rounded p-5 border-4 border-light-blue-500 border-opacity-100 space-y-2">
      <DataVersionSelect
        label="Version des coefficients :"
        curDataVersion={dataVersion}
        onSelect={onSetDataVersion}
      />
      <div className="">
        <label className="inline" htmlFor="n-reco">Nombre de recommandations par liste :</label>
        <input 
          className="inline w-16 border-solid border-2 border-indigo-500 text-right"
          type="number" id="n-reco" name="n-reco"
          onChange={e => onSetNReco(+e.target.value)}
          value={nReco}
        />
      </div>
      <div className="">
        <label className="inline" htmlFor="max-seen">Exclure les CI qui ont déjà été vu </label>
        <input 
          className="inline w-16 border-solid border-2 border-indigo-500 text-right"
          type="number" id="max-seen" name="max-seen"
          onChange={e => onSetMaxSeen(+e.target.value)}
          value={maxSeen}
        />
         fois
      </div>
      <p>CI séléctionés:</p>
      <ul className="list-disc list-outside pl-4">
        {cisSelected.values().slice().reverse().map(ci => <li key={ci.id}>{ciNames?.get(ci)}</li>)}
      </ul>
      <p>CI exclus:</p>
      <ul className="list-disc list-outside pl-4">
        {cisSeen.entries()
          .filter(([_, count]: [Ci, number]): boolean => count >= maxSeen)
          .map(([ci, count]: [Ci, number]) =>
            <li key={ci.id}>{ciNames?.get(ci)} ({count})</li>
          )
        }
      </ul>
    </div>
  );
};

export default Info;
