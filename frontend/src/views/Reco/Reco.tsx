import React, {useState, useEffect} from 'react';
import {Ci} from 'types/types';
import {ciListFromString} from 'utils/helpers/Ci';
import useCiNames from 'hooks/useCiNames';
import Start from 'views/Reco/Start';
import Step from 'views/Reco/Step';
import {useSearchParams} from 'react-router-dom';


export const Reco: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [nReco, setNReco] = useState<number>(3);
  const ciNames = useCiNames();
  const [selectedCis, setSelectedCis] =
    useState<Ci[]>(ciListFromString(searchParams.get("selectedCis")));

  const addCi = (ci: Ci): void => {
    setSelectedCis([...selectedCis, ci])
  };

  useEffect(() => {
    searchParams.set("selectedCis",
       selectedCis.map(ci => ci.id.toString()).join(","));
    setSearchParams(searchParams);
  }, [selectedCis, searchParams, setSearchParams]);

  return (
    <div className="row">
      <div className="column column-70">
        {
          selectedCis.length === 0 ?
            <Start onYes={addCi} ciNames={ciNames}/> :
            <Step 
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

export default Reco;
