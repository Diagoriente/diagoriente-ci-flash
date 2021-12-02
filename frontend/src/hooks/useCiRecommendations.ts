import {Ci} from "utils/helpers/Ci";
import {CiReco, ciReco} from "utils/helpers/CiReco";
import {useState, useEffect, useCallback} from 'react';
import {fetchCiRandom, fetchCiReco} from 'services/backend';

function useCiRecommendations(selectedCis: Ci[], nReco: number,
    dataVersion: string | undefined) {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  const drawRandomReco = useCallback(
    () => {
      if (dataVersion !== undefined) {
        fetchCiRandom(dataVersion, nReco * 3, selectedCis)
          .then(cis => {
            if (cis.length === 0) {
              console.error("Received 0 random CI from backend.");
            } else {
                const cir = ciReco(
                  cis.slice(0,nReco), 
                  cis.slice(nReco,nReco * 2), 
                  cis.slice(nReco * 2, nReco * 3));
              setCiRecoState(cir);
            }
          });
      }
    },
    [dataVersion, nReco, selectedCis]
  );

  useEffect(() => {
    if (dataVersion !== undefined) {
      if (selectedCis.length === 0) {
        drawRandomReco();
      } else {
        fetchCiReco(dataVersion, nReco, selectedCis)
          .then(res => {
            setCiRecoState(res)
          });
      }
    }
  }, [selectedCis, nReco, dataVersion]);

  const reShuffle = drawRandomReco;

  return [ciRecoState, reShuffle] as const;
}

export default useCiRecommendations;
