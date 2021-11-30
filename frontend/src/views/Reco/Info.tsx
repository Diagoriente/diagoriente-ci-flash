import React, {useEffect} from 'react';
import {Ci} from 'utils/helpers/Ci';
import {CiNames} from 'utils/helpers/CiNames';
import useDataVersions from 'hooks/useDataVersions';


export const Info: React.FC<{
    onSetNReco: (n: number) => void,
    selectedCis: Ci[],
    nReco: number,
    ciNames: CiNames | undefined,
    dataVersion: string | undefined,
    onSetDataVersion: (version: string) => void}> =
    ({onSetNReco, selectedCis, nReco, ciNames, dataVersion, onSetDataVersion }) => {

  const dataVersions = useDataVersions();

  useEffect(() => {
    if (dataVersions !== undefined) {
      if (dataVersions.find((item) => item === dataVersion) === undefined) {
        onSetDataVersion(dataVersions[0]);
      }
    }
  }, [dataVersions, dataVersion, onSetDataVersion]);

  return (
    <div className="rounded p-5 border-4 border-light-blue-500 border-opacity-100 space-y-2">
      <div className="">
        <label className="inline" htmlFor="data-version">Coefficients utilisés :</label>
        <select 
          className="rounded bg-indigo-200"
          name="data-version"
          id="data-version"
          defaultValue={dataVersion || dataVersions[0]}
          onChange={e => onSetDataVersion(e.target.value)}
        >
          {
            dataVersions.map((version) => 
              <option key={version} value={version}>
                {version}
              </option>
            )
          }
        </select>
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
