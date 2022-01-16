import {useEffect} from 'react';
import useFetched from 'hooks/useFetched';
import {DataVersions} from 'utils/helpers/DataVersions';


function useDataVersions(curDataVersion: string | undefined,
    setDataVersion: (dataVersions: string) => void) {
  const [dataVersions] = useFetched<DataVersions>("ci_data_versions");

  useEffect((): void => {
    if (dataVersions !== undefined &&
        dataVersions.list.find((item) => item === curDataVersion) === undefined) {
      setDataVersion(dataVersions.default);
    }
  }, [dataVersions, curDataVersion, setDataVersion]);

  return dataVersions; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useDataVersions;
