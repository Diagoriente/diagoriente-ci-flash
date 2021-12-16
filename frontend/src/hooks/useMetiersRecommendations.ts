import {CiSet} from 'utils/helpers/CiSet';
import {useState, useEffect} from 'react';
import {fetchMetiersReco} from 'services/backend';

function useMetiersRecommendations(cisSelected: CiSet, n: number, dataVersion: string | undefined) {
  const [metiersReco, setMetiersReco] = useState<[string, number][] | undefined>(undefined);

  useEffect(() => {
    if (dataVersion !== undefined) {
      if (cisSelected.size() > 0) {
        fetchMetiersReco(dataVersion, n, cisSelected)
          .then(setMetiersReco)
      }
    }
  }, [cisSelected, n, dataVersion]);

  return metiersReco;
}

export default useMetiersRecommendations;
