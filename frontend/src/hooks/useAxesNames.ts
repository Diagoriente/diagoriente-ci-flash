import {useState, useEffect} from 'react';
import {fetchAxesNames} from 'services/backend';


export function useAxesNames(dataVersion: string | undefined) {
  const [axesNames, setAxesNames] = useState<string[] | undefined>(undefined);

  useEffect((): void => {
    console.log("DATAVERSION CHANGED");
    if (dataVersion !== undefined) {
      fetchAxesNames(dataVersion)
        .then(setAxesNames)
    }
  }, [dataVersion, setAxesNames]);

  return axesNames; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useAxesNames;

