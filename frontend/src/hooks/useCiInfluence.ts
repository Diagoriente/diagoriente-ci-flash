import {useState, useEffect} from 'react';
import {CiMap} from "utils/helpers/CiMap";
import {fetchCiInfluence} from "services/backend";


function useCiInfluence(dataVersion: string | undefined, method: string) {
  const [ciInfluence, setCiInfluence] = useState<CiMap<{influence: number,
    rank: number}> | undefined>(undefined);

  useEffect(() => {
    if (dataVersion !== undefined) {
      fetchCiInfluence(dataVersion, method)
      .then(setCiInfluence);
    }
  }, [dataVersion, setCiInfluence]);

  return ciInfluence;
}

export default useCiInfluence;


