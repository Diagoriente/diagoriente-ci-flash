import {useState, useEffect} from 'react';
import {CiNames, ciNamesFromRecord} from 'utils/helpers/CiNames';
import {fetchCiNames} from 'services/backend';


export const useCiNames = () => {
  const [ciNames, setCiNames] = useState<CiNames>(ciNamesFromRecord({}));

  useEffect((): void => {
    fetchCiNames()
      .then(setCiNames)
  }, []);

  return ciNames; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useCiNames;
