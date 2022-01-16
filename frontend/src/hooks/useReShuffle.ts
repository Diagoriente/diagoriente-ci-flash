import {Ci, ci} from "utils/helpers/Ci";
import {CiSet} from "utils/helpers/CiSet";
import {CiCount} from "utils/helpers/CiCount";
import {CiReco, ciReco} from "utils/helpers/CiReco";
import {useCallback} from 'react';
import {fetched} from 'services/backend';

function useReShuffle(cisSelected: CiSet, cisSeen: CiCount, maxSeen: number, nReco: number, dataVersion: string | undefined, setCiReco: (val: CiReco | undefined) => void) {

  const reShuffle = useCallback(
    () => {
      if (dataVersion !== undefined) {
        fetched<Ci[]>(
          "ci_random",
          { ci_data_version: dataVersion,
            n: nReco * 3,
            excluding: cisSelected.insert(
              Array.from(
                cisSeen.entries()
                .filter(([_, count]) => count >= maxSeen)
                .map(([ci, _]) => ci)
              )
            ) },
          (r => r.map(ci)))
        .then(cis => {
          if (cis.length === 0) {
            console.error("Received 0 random CI from backend.");
          } else {
            const cir = ciReco(
              cis.slice(0, nReco),
              cis.slice(nReco, nReco * 2),
              cis.slice(nReco * 2, nReco * 3));
            setCiReco(cir);
          }
        });
      }
    },
    [dataVersion, nReco, cisSelected, setCiReco]
  );

  return reShuffle;
}

export default useReShuffle;

