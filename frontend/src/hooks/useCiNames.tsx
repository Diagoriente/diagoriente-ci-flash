import {useState, useEffect} from 'react';
import {CiNames} from 'utils/helpers/CiNames';
import {fetchCiNames} from 'services/backend';


export function useCiNames(dataVersion: string | undefined) {
  const [ciNames, setCiNames] = useState<CiNames | undefined>(undefined);

  useEffect((): void => {
    console.log("DATAVERSION CHANGED");
    if (dataVersion !== undefined) {
      fetchCiNames(dataVersion)
        .then(setCiNames)
    }
  }, [dataVersion, setCiNames]);

  return ciNames; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useCiNames;
