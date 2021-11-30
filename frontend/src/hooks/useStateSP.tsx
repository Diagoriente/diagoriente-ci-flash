import {useState, useEffect} from 'react';
import {useSearchParams} from 'react-router-dom';


// Hook for a states that is also sychronized to a search parameter.
// Throws an error is null if the query parameter is present and could not
// be decoded.
export function useStateSP<T>(defaultVal: T, paramName: string, 
    decode: (s: string | null) => T | null, encode: (v: T) => string | null) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<T>(defaultVal);
  const [firstRender, setFirstRender] = useState<boolean>(true);

  useEffect(() => {
    // TODO: remove condition ?
    if (firstRender) {
      setFirstRender(false);
      const searchParamString: string | null = searchParams.get(paramName);
      console.log(`useStateSP: searchParams.get(${paramName}) = ${searchParamString}`);
      if(searchParamString !== null) {
        const searchParamValueOrNull = decode(searchParamString);
        if (searchParamValueOrNull === null){
          throw Error(`Could not decode query parameter value {paramName}={searchParamString}`);
        } else {
          console.log(`useStateSP: Setting state of ${paramName} to ${JSON.stringify(searchParamValueOrNull)}`);
          setState(searchParamValueOrNull);
        }
      }
    }
  }, [firstRender, paramName, searchParams, decode]);

  useEffect(() => {
    let encoded = encode(state);
    if (encoded === null) {
      searchParams.delete(paramName);
    } else {
      searchParams.set(paramName, encoded);
    }
    console.log(`useStateSP: searchParams.set(${paramName}) to ${JSON.stringify(encoded)}`);
    setSearchParams(searchParams);
  }, [state, searchParams, setSearchParams, paramName, encode])

  return [state, setState] as const; // see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/hooks/#custom-hooks
};


export default useStateSP;

