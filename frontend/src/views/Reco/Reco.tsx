import React, {useState} from 'react';
import {ciSet} from 'utils/helpers/CiSet';
import {ciCount} from 'utils/helpers/CiCount';
import useCiNames from 'hooks/useCiNames';
import useCisSelected from 'hooks/useCisSelected';
import useCisSeen from 'hooks/useCisSeen';
import useDataVersion from 'hooks/useDataVersion';
import Step from 'views/Reco/Step';
import Info from 'views/Reco/Info';
import Metiers from 'views/Reco/Metiers';


export const Reco: React.FC = () => {
  const [nReco, setNReco] = useState<number>(3);
  const [maxSeen, setMaxSeen] = useState<number>(3);
  const [cisSelected, addCi, setCisSelected] = useCisSelected();
  const [cisSeen, addCiSeen, setCisSeen] = useCisSeen();
  const [dataVersion, setDataVersion] = useDataVersion(undefined);
  const ciNames = useCiNames(dataVersion);

  return (
    <div className="flex space-x-20 items-start">
      <div className="flex-col w-4/6 space-y-10">
        <Step
          onSelectCi={addCi}
          cisSelected={cisSelected}
          onRestart={() => {
            setCisSelected(ciSet([]));
            setCisSeen(ciCount());
            }
          }
          cisSeen={cisSeen}
          onAddCiSeen={addCiSeen}
          maxSeen={maxSeen}
          nReco={nReco}
          ciNames={ciNames}
          dataVersion={dataVersion}
        />
        <Metiers
          cisSelected={cisSelected}
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

