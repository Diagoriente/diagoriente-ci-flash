import React, {useState} from 'react';
import useCiNames from 'hooks/useCiNames';
import useSelectedCis from 'hooks/useSelectedCis';
import useDataVersion from 'hooks/useDataVersion';
import Step from 'views/Reco/Step';
import Info from 'views/Reco/Info';


export const Reco: React.FC = () => {
  const [nReco, setNReco] = useState<number>(3);
  const [selectedCis, addCi] = useSelectedCis();
  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const ciNames = useCiNames(dataVersion);

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

