import {useState, useEffect} from 'react';
import {fetchDataVersions} from 'services/backend';


export const useDataVersions = () => {
  const [dataVersions, setDataVersions] = useState<string[]>([]);

  useEffect((): void => {
    fetchDataVersions()
      .then(setDataVersions)
  }, []);

  return dataVersions; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useDataVersions;
