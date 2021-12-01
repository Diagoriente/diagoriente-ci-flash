import React from 'react';
import {Ci} from 'utils/helpers/Ci';
import {CiNames} from 'utils/helpers/CiNames';
import useDataVersions from 'hooks/useDataVersions';
import DataVersionSelect from 'components/DataVersionSelect';


export const Info: React.FC<{
    onSetNReco: (n: number) => void,
    selectedCis: Ci[],
    nReco: number,
    ciNames: CiNames | undefined,
    dataVersion: string | undefined,
    onSetDataVersion: (version: string) => void}> =
    ({onSetNReco, selectedCis, nReco, ciNames, dataVersion, onSetDataVersion }) => {

  return (
    <div className="rounded p-5 border-4 border-light-blue-500 border-opacity-100 space-y-2">
      <div className="">
        <DataVersionSelect
          label="Version des coefficients :"
          curDataVersion={dataVersion}
          onSelect={onSetDataVersion}
        />
        <label className="inline" htmlFor="n-reco">Nombre de recommandations par liste :</label>
        <input 
          className="inline w-16 border-solid border-2 border-indigo-500 text-right"
          type="number" id="n-reco" name="n-reco"
          onChange={e => onSetNReco(+e.target.value)}
          value={nReco}
        />
      </div>
      <p>CI séléctionés:</p>
      <ul className="list-disc list-outside pl-4">
        {selectedCis.slice().reverse().map(ci => <li key={ci.id}>{ciNames?.get(ci)}</li>)}
      </ul>
    </div>
  );
};

export default Info;
