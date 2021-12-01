import {useState, useEffect} from 'react';
import {fetchDataVersions} from 'services/backend';


function useDataVersions(curDataVersion: string | undefined,
    setDataVersion: (dataVersions: string) => void) {
  const [dataVersions, setDataVersions] = useState<string[]>([]);

  useEffect((): void => {
    fetchDataVersions()
    .then(dataVersions => {
      setDataVersions(dataVersions);

      if (dataVersions.find((item) => item === curDataVersion) === undefined) {
        setDataVersion(dataVersions[0]);
      }
    })
  }, [curDataVersion, setDataVersion]);

  return dataVersions; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useDataVersions;
