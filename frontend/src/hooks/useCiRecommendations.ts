import {Ci} from "utils/helpers/Ci";
import {CiCount} from "utils/helpers/CiCount";
import {CiReco, ciReco} from "utils/helpers/CiReco";
import {useState, useEffect, useCallback} from 'react';
import {fetchCiRandom, fetchCiReco} from 'services/backend';

function useCiRecommendations(cisSelected: Ci[], cisSeen: CiCount,
  maxSeen: number, nReco: number, dataVersion: string | undefined) {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  const drawRandomReco = useCallback(
    () => {
      if (dataVersion !== undefined) {
        fetchCiRandom(
          dataVersion, nReco * 3,
          [...cisSelected, ...Array.from(cisSeen.keys())]
        )
          .then(cis => {
            if (cis.length === 0) {
              console.error("Received 0 random CI from backend.");
            } else {
              const cir = ciReco(
                cis.slice(0, nReco),
                cis.slice(nReco, nReco * 2),
                cis.slice(nReco * 2, nReco * 3));
              setCiRecoState(cir);
            }
          });
      }
    },
    [dataVersion, nReco, cisSelected]
  );

  useEffect(() => {
    if (dataVersion !== undefined) {
      if (cisSelected.length === 0) {
        drawRandomReco();
      } else {
        fetchCiReco(dataVersion, nReco, cisSelected, cisSeen, maxSeen)
          .then(res => {
            setCiRecoState(res)
          });
      }
    }
  }, [cisSelected, cisSeen, maxSeen, nReco, dataVersion]);

  const reShuffle = drawRandomReco;

  return [ciRecoState, reShuffle] as const;
}

export default useCiRecommendations;
