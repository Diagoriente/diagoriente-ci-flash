import {useState, useEffect} from 'react';
import { Pca } from 'utils/helpers/Pca';
import {fetchPca} from "services/backend";


function usePca(dataVersion: string | undefined) {
  const [pca, setPca] = useState<Pca | undefined>(undefined);

  useEffect(() => {
    if (dataVersion !== undefined) {
      fetchPca(dataVersion)
      .then(setPca)
    }
  }, [dataVersion, setPca]);

  return pca;
}

export default usePca;


