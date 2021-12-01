import {useState, useEffect} from 'react';
import {Ci} from "utils/helpers/Ci";
import {CiNames} from "utils/helpers/CiNames";
import {CiScores} from "utils/helpers/CiScores";
import {fetchCiScores} from "services/backend";

function useCiScores(curCi: Ci | null, dataVersion: string | undefined,
    ciNames: CiNames | undefined) {
  const [ciDist, setCiDist] = useState<{name: string, val: number}[]>([]);
  const [ciOuv, setCiOuv] = useState<{name: string, val: number}[]>([]);

  useEffect(() => {
    if (curCi !== null && dataVersion !== undefined && ciNames !== undefined) {
      fetchCiScores(dataVersion, curCi).then((ciScores: CiScores): void => {
        setCiDist(ciScores.distanceAsc(ciNames));
        setCiOuv(ciScores.ouvertureDesc(ciNames));
      });
    }
  }, [curCi, ciNames, dataVersion]);

  return [ciDist, ciOuv] as const;
}

export default useCiScores;
