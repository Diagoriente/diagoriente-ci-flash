import {useState, useEffect} from 'react';
import {CiMap} from 'utils/helpers/CiMap';
import {fetchCiCoefsMetiersQuantiles} from 'services/backend';


export function useCiCoefsMetiersQuantiles(dataVersion: string | undefined, 
    quantiles: number[]) {
  const [val, setVal] = useState<CiMap<number[]> | undefined>(undefined);

  useEffect((): void => {
    if (dataVersion !== undefined) {
      fetchCiCoefsMetiersQuantiles(dataVersion, quantiles).then(setVal)
    }
  }, [dataVersion, setVal]);

  return val; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useCiCoefsMetiersQuantiles;

