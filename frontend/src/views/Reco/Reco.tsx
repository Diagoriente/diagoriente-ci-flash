import React, {useState} from 'react';
import useCiNames from 'hooks/useCiNames';
import useCisSelected from 'hooks/useCisSelected';
import useCisSeen from 'hooks/useCisSeen';
import useDataVersion from 'hooks/useDataVersion';
import Step from 'views/Reco/Step';
import Info from 'views/Reco/Info';


export const Reco: React.FC = () => {
  const [nReco, setNReco] = useState<number>(3);
  const [maxSeen, setMaxSeen] = useState<number>(3);
  const [cisSelected, addCi] = useCisSelected();
  const [cisSeen, addCiSeen] = useCisSeen();
  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const ciNames = useCiNames(dataVersion);

  return (
    <div className="flex space-x-20 items-start">
      <div className="w-4/6">
        <Step 
          onSelectCi={addCi}
          cisSelected={cisSelected}
          cisSeen={cisSeen}
          onAddCiSeen={addCiSeen}
          maxSeen={maxSeen}
          nReco={nReco}
          ciNames={ciNames}
          dataVersion={dataVersion}
        />
      </div>
      <Info 
        onSetNReco={setNReco}
        nReco={nReco}
        maxSeen={maxSeen}
        onSetMaxSeen={setMaxSeen}
        ciNames={ciNames}
        cisSelected={cisSelected}
        cisSeen={cisSeen}
        dataVersion={dataVersion}
        onSetDataVersion={setDataVersion}
      />
    </div>
  );
};

export default Reco;

