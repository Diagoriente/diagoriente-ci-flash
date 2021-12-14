import {Ci} from 'utils/helpers/Ci';
import {useState, useEffect} from 'react';
import {fetchMetiersReco} from 'services/backend';

function useMetiersRecommendations(cisSelected: Ci[], n: number, dataVersion: string | undefined) {
  const [metiersReco, setMetiersReco] = useState<[string, number][] | undefined>(undefined);

  useEffect(() => {
    if (dataVersion !== undefined) {
      if (cisSelected.length > 0) {
        fetchMetiersReco(dataVersion, n, cisSelected)
          .then(setMetiersReco)
      }
    }
  }, [cisSelected, n, dataVersion]);

  return metiersReco;
}

export default useMetiersRecommendations;
