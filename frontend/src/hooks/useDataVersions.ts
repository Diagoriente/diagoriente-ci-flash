import {useState, useEffect} from 'react';
import {fetchDataVersions} from 'services/backend';
import {DataVersions} from 'utils/helpers/DataVersions';


function useDataVersions(curDataVersion: string | undefined,
    setDataVersion: (dataVersions: string) => void) {
  const [dataVersions, setDataVersions] = useState<DataVersions | undefined>(undefined);

  useEffect((): void => {
    fetchDataVersions()
    .then(dataVersions => {
      setDataVersions(dataVersions);

      if (dataVersions.list.find((item) => item === curDataVersion) === undefined) {
        setDataVersion(dataVersions.default);
      }
    })
  }, [curDataVersion, setDataVersion]);

  return dataVersions; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useDataVersions;
