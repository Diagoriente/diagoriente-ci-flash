import {Ci} from "utils/helpers/Ci";
import {CiReco, ciReco} from "utils/helpers/CiReco";
import {useState, useEffect} from 'react';
import {fetchCiRandom, fetchCiReco} from 'services/backend';

function useCiRecommendations(selectedCis: Ci[], nReco: number,
    dataVersion: string | undefined) {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  useEffect(() => {
    if (dataVersion !== undefined) {
      if (selectedCis.length === 0) {
        fetchCiRandom(dataVersion, nReco * 3)
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
      } else {
        fetchCiReco(dataVersion, nReco, selectedCis)
          .then(res => {
            setCiRecoState(res)
          });
      }
    }
  }, [selectedCis, nReco, dataVersion]);

  return ciRecoState;
}

export default useCiRecommendations;
