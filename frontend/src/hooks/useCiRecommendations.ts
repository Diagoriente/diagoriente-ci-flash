import {Ci, ci} from "utils/helpers/Ci";
import {CiSet} from "utils/helpers/CiSet";
import {CiCount} from "utils/helpers/CiCount";
import {CiReco, ciReco} from "utils/helpers/CiReco";
import {useState, useEffect, useCallback} from 'react';
import {fetched} from 'services/backend';

function useCiRecommendations(cisSelected: CiSet, cisSeen: CiCount,
  maxSeen: number, nReco: number, dataVersion: string | undefined) {
  const [ciRecoState, setCiRecoState] = useState<CiReco | undefined>(undefined);

  const drawRandomReco = useCallback(
    () => {
      if (dataVersion !== undefined) {
        fetched<Ci[]>(
          "ci_random",
          { ci_data_version: dataVersion, 
            n: nReco * 3, 
            excluding: cisSelected.insert(Array.from(cisSeen.keys())) },
          (r => r.map(ci)))
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
      if (cisSelected.size() === 0) {
        drawRandomReco();
      } else {
        fetched<CiReco>(
          "ci_recommend",
          { ci_data_version: dataVersion, n: nReco, max_seen: maxSeen, 
            cis_selected: cisSelected, cis_seen: cisSeen },
          ( r: { proches: number[], ouverture: number[], distant: number[]}) =>
            ciReco(r.proches.map(ci), r.ouverture.map(ci), r.distant.map(ci)) )
        .then(setCiRecoState);
      }
    }
  }, [cisSelected, cisSeen, maxSeen, nReco, dataVersion]);

  const reShuffle = drawRandomReco;

  return [ciRecoState, reShuffle] as const;
}

export default useCiRecommendations;
