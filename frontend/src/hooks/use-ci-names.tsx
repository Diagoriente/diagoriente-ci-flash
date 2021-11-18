import React, {useState, useEffect} from 'react';
import {CiNames, ciNamesFromRecord} from '../core';
import {fetchCiNames} from '../requests';


export const useCiNames = () => {
  const [ciNames, setCiNames] = useState<CiNames>(ciNamesFromRecord({}));

  useEffect((): void => {
    fetchCiNames()
      .then(setCiNames)
  }, []);

  return [ciNames, setCiNames] as const; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};

export default useCiNames;
