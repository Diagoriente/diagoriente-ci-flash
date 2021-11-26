import React, {useState, useEffect} from 'react';
import {Ci, ciListFromString} from 'utils/helpers/Ci';
import useCiNames from 'hooks/useCiNames';
import useStateSP from 'hooks/useStateSP';
import Start from 'views/Reco/Start';
import Step from 'views/Reco/Step';
import {useSearchParams} from 'react-router-dom';


export const Reco: React.FC = () => {
  const [nReco, setNReco] = useState<number>(3);
  const ciNames = useCiNames();
  const [selectedCis, setSelectedCis] =
    useStateSP<Ci[]>([], "selectedCis",
      (s) => ciListFromString(s),
      (l) => l.map(ci => ci.id.toString()).join(",")
    )

  const addCi = (ci: Ci): void => {
    if (selectedCis === null) {
      setSelectedCis([ci]);
    } else {
      setSelectedCis([...selectedCis, ci]);
    }
  };

  if (selectedCis === null) {
    return <p>Error: could not decode url search parameter "selectedCis"</p>;
  } else {
    return (
      <div className="flex space-x-20 items-start">
        <div className="w-4/6">
          {
              <Step 
                onSelectCi={addCi}
                selectedCis={selectedCis}
                nReco={nReco}
                ciNames={ciNames}
              />
          }
        </div>
        <div className="rounded p-5 border-4 border-light-blue-500 border-opacity-100 space-y-2">
          <div className="">
            <label className="inline" htmlFor="n-reco">Nombre de recommandations par liste :</label>
            <input 
              className="inline w-16 border-solid border-2 border-indigo-500 text-right"
              type="number" id="n-reco" name="n-reco"
              onChange={e => setNReco(+e.target.value)}
              value={nReco}
            />
          </div>
          <p>CI séléctionés:</p>
          <ul className="list-disc list-outside pl-4">
            {selectedCis.slice().reverse().map(ci => <li key={ci.id}>{ciNames.get(ci)}</li>)}
          </ul>
        </div>
      </div>
    );
  }
};

export default Reco;
