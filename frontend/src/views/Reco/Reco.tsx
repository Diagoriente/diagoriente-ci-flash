import React, {useState} from 'react';
import {Ci, ciListFromString, ciListToString} from 'utils/helpers/Ci';
import useCiNames from 'hooks/useCiNames';
import useStateSP from 'hooks/useStateSP';
import useDataVersion from 'hooks/useDataVersion';
import Step from 'views/Reco/Step';
import Info from 'views/Reco/Info';


export const Reco: React.FC = () => {
  const [nReco, setNReco] = useState<number>(3);
  const [selectedCis, setSelectedCis] =
    useStateSP<Ci[]>([], "selectedCis", ciListFromString, ciListToString);
  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const ciNames = useCiNames(dataVersion);

  const addCi = (ci: Ci): void => {
    if (selectedCis === null) {
      setSelectedCis([ci]);
    } else {
      setSelectedCis([...selectedCis, ci]);
    }
  };

  return (
    <div className="flex space-x-20 items-start">
      <div className="w-4/6">
        <Step 
          onSelectCi={addCi}
          selectedCis={selectedCis}
          nReco={nReco}
          ciNames={ciNames}
          dataVersion={dataVersion}
        />
      </div>
      <Info 
        onSetNReco={setNReco}
        nReco={nReco}
        ciNames={ciNames}
        selectedCis={selectedCis}
        dataVersion={dataVersion}
        onSetDataVersion={setDataVersion}
      />
    </div>
  );
};

export default Reco;

